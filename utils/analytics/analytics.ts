import { redis } from "../upstash/redis"
import { format, parse, subDays } from "date-fns"

export const getDate = (sub: number = 0) => {
  const dateXDaysAgo = subDays(new Date(), sub)

  return format(dateXDaysAgo, "yyyy-MM-dd")
}

type AnalyticsArgs = {
  retention?: number
}

type TrackOptions = {
  persist?: boolean
}

export class Analytics {
  private retention: number = 60 * 60 * 24 * 7

  constructor(opts?: AnalyticsArgs) {
    if (opts?.retention) {
      this.retention = opts.retention
    }
  }

  async track(namespace: string, page: string, event: object = {}, opts?: TrackOptions) {
    let key = `${page}::${namespace}`

    if (!opts?.persist) {
      key += `::${getDate()}`
    }

    await redis.hincrby(key, JSON.stringify(event), 1)
    if (!opts?.persist) {
      await redis.expire(key, this.retention)
    }
  }

  async retrieveDays(namespace: string, page: string, nDays: number) {
    type AnalyticsPromise = ReturnType<typeof analytics.retrieve>
    const promises: AnalyticsPromise[] = []

    for (let i = 0; i < nDays; i++) {
      const formattedDate = getDate(i)
      const promise = analytics.retrieve(namespace, page, formattedDate)
      promises.push(promise)
    }

    const fetched = await Promise.all(promises)

    const data = fetched.sort((a, b) => {
      if (parse(a.date, "yyyy-MM-dd", new Date()) > parse(b.date, "yyyy-MM-dd", new Date())) {
        return 1
      } else {
        return -1
      }
    })

    return data
  }

  async retrieve(namespace: string, page: string, date: string) {
    const res = await redis.hgetall<Record<string, string>>(`${page}::${namespace}::${date}`)

    return {
      date,
      events: Object.entries(res ?? []).map(([key, value]) => ({
        [key]: Number(value),
      })),
    }
  }
}

export const analytics = new Analytics()
