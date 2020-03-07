import { RedisClient as Client } from 'redis'

let client: Client

const getClient = async (): Promise<Client> => {
  if (!client) {
    const redis = await import('redis')
    client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    })
  }
  return client
}

export const RedisClient = {
  get (key: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      (await getClient()).get(key, (err: any, value: any) => {
        if (err) {
          return reject(err)
        }
        resolve(value)
      })
    })
  },

  getMany (keys: string[]): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      (await getClient()).mget(keys, (err, values) => {
        if (err) {
          return reject(err)
        }
        resolve(values)
      })
    })
  },

  async getAllByPattern (pattern: string): Promise<{ [key: string]: any }> {
    const keys = await this.getKeys(pattern)
    if (!keys.length) {
      return {}
    }
    const values = await this.getMany(keys)
    const results: { [key: string]: any } = {}
    for (let i = 0; i < keys.length; i++) {
      results[keys[i]] = values[i]
    }
    return results
  },

  getKeys (pattern: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      (await getClient()).keys(pattern, (err, keys) => {
        if (err) {
          return reject(err)
        }
        resolve(keys)
      })
    })
  },
}
