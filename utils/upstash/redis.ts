import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_ANALYTICS_URL,
  token: process.env.UPSTASH_ANALYTICS_TOKEN,
})
