"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function Chart(props: {chartData: {month: string, done: number, undone: number}[]}) {
  const chartConfig = {
    done: {
      label: "Lunas",
      color: "hsl(var(--chart-2))",
    },
    undone: {
      label: "Belum Lunas",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={props.chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line"/>}
            />
            <ChartLegend content={<ChartLegendContent/>}/>
            <Bar dataKey="done" fill="var(--color-done)" radius={4} />
            <Bar dataKey="undone" fill="var(--color-undone)" radius={4} />
        </BarChart>
    </ChartContainer>
  )
}
