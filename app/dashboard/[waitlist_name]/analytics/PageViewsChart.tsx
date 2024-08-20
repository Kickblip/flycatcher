"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format, parse } from "date-fns"

const chartConfig = {
  views: {
    label: "Visitors",
  },
  signups: {
    label: "Sign ups",
  },
  pageViews: {
    label: "Visitors",
    color: "#FF3300",
  },
  pageSignups: {
    label: "Sign ups",
    color: "#FF3300",
  },
} satisfies ChartConfig

export default function PageViewsChart({ chartData }: { chartData: { date: string; pageViews: number; pageSignups: number }[] }) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("pageViews")

  const total = React.useMemo(
    () => ({
      pageViews: chartData.reduce((acc, curr) => acc + curr.pageViews, 0),
      pageSignups: chartData.reduce((acc, curr) => acc + curr.pageSignups, 0),
    }),
    [],
  )

  console.log(chartData)

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Waitlist Performance</CardTitle>
          <CardDescription>Analytics from your waitlist page over the last week</CardDescription>
        </div>
        <div className="flex">
          {["pageViews", "pageSignups"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground w-16">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = parse(value, "yyyy-MM-dd", new Date())
                return format(date, "MMM d")
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart === "pageViews" ? "views" : "signups"}
                  labelFormatter={(value) => {
                    const date = parse(value, "yyyy-MM-dd", new Date())
                    return format(date, "MMM d, yyyy")
                  }}
                />
              }
            />
            <Line dataKey={activeChart} type="linear" stroke={`var(--color-${activeChart})`} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
