"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function DeviceTypePieChart({
  chartData,
  statName,
  chartName,
}: {
  chartData: { deviceType: string; stat: number; fill: string }[]
  statName: string
  chartName: string
}) {
  const totalStat = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.stat, 0)
  }, [])

  const chartConfig = {
    stat: {
      label: statName,
    },
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
    unknown: {
      label: "Unknown",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig

  return (
    <div className="w-40 h-40">
      <ChartContainer config={chartConfig} className="aspect-square">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey="stat" nameKey="deviceType" innerRadius={35} strokeWidth={5}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 4} className="fill-foreground text-lg font-bold">
                        {totalStat.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 12} className="fill-muted-foreground text-xs">
                        {statName}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
