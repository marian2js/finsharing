import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Post } from '../../src/types/Post'
import IconButton from '@material-ui/core/IconButton'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Router from 'next/router'

interface Props {
  post: Post
  viewerId: string | undefined
}

export const PostVotes = (props: Props) => {
  const { post, viewerId } = props
  const [createPostVote] = useMutation(CREATE_POST_VOTE_MUTATION)
  const [deletePostVote] = useMutation(DELETE_POST_VOTE_MUTATION)
  const [viewerVote, setViewerVote] = useState(post.viewerVote ? (post.viewerVote.value === 'POSITIVE_1' ? 1 : -1) : 0)

  useEffect(() => {
    setViewerVote(post.viewerVote ? (post.viewerVote.value === 'POSITIVE_1' ? 1 : -1) : 0)
  }, [post.viewerVote])

  const refetchPostVotesQuery = {
    query: gql`
      query ($slug: String!) {
        post (slug: $slug) {
          slug
          ...PostVotes
        }
      }
      ${PostVotes.fragments.post}
    `,
    variables: {
      slug: post.slug
    }
  }

  const handleVote = async (e: React.MouseEvent<HTMLButtonElement>, value: 1 | -1) => {
    e.preventDefault()

    if (!viewerId) {
      await Router.push('/register')
      return
    }

    if (value === viewerVote) {
      await handleDeleteVote(true)
    } else if (viewerVote) {
      await handleDeleteVote(false)
      await handleCreateVote(value)
    } else {
      await handleCreateVote(value)
    }
  }

  const handleCreateVote = async (value: 1 | -1) => {
    const voteValue = value === 1 ? 'POSITIVE_1' : 'NEGATIVE_1'
    await createPostVote({
      variables: {
        postId: post.id,
        value: voteValue
      },
      refetchQueries: [refetchPostVotesQuery]
    })
  }

  const handleDeleteVote = async (refetchVotes: boolean) => {
    await deletePostVote({
      variables: {
        voteId: post.viewerVote.id
      },
      ...(refetchVotes && { refetchQueries: [refetchPostVotesQuery] })
    })
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item xs>
        <div>
          <IconButton size="small" aria-label="Up vote"
                      color={viewerVote === 1 ? 'primary' : 'default'}
                      onClick={e => handleVote(e, 1)}>
            <ExpandLessIcon fontSize="large"/>
          </IconButton>
        </div>
      </Grid>
      <Grid item xs>
        <Typography gutterBottom variant="h6" component="div" style={{ margin: '7px 14px' }}>
          {post.votes}
        </Typography>
      </Grid>
      <Grid item xs>
        <div>
          <IconButton size="small" aria-label="Down vote"
                      color={viewerVote === -1 ? 'secondary' : 'default'}
                      onClick={e => handleVote(e, -1)}>
            <ExpandMoreIcon fontSize="large"/>
          </IconButton>
        </div>
      </Grid>
    </Grid>
  )
}

const CREATE_POST_VOTE_MUTATION = gql`
  mutation ($postId: ID!, $value: PostVoteValueEnum!) {
    createPostVote (input: { post: $postId, value: $value }) {
      postVote {
        value
      }
    }
  }
`

const DELETE_POST_VOTE_MUTATION = gql`
  mutation ($voteId: ID!) {
    deletePostVote (input: { id: $voteId }) {
      result
    }
  }
`

PostVotes.fragments = {
  post: gql`
    fragment PostVotes on Post {
      id
      votes
      viewerVote {
        id
        value
      }
    }
  `,
}
