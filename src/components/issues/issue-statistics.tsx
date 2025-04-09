"use client";

import { useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CATEGORY_COLORS } from "@/lib/constants";

type ChartType = "line" | "bar" | "pie" | "area";

interface ChartSeries {
  key: string;
  name: string;
  color: string;
}

interface IssueStatisticsProps {
  type: ChartType;
  data: any[];
  xKey?: string;
  yKey?: string;
  nameKey?: string;
  valueKey?: string;
  series?: ChartSeries[];
  title?: string;
  showLegend?: boolean;
  height?: number;
  className?: string;
}

export default function IssueStatistics({
  type,
  data,
  xKey = "name",
  yKey = "value",
  nameKey = "name",
  valueKey = "value",
  series,
  title,
  showLegend = true,
  height = 300,
  className = "",
}: IssueStatisticsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Default colors for pie chart
  const COLORS = [
    "#1976D2",
    "#4CAF50",
    "#FFC107",
    "#F44336",
    "#9C27B0",
    "#00BCD4",
    "#3F51B5",
    "#FF9800",
  ];

  // Render the appropriate chart based on type
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {series ? (
                series.map((item, index) => (
                  <Line
                    key={item.key}
                    type="monotone"
                    dataKey={item.key}
                    name={item.name}
                    stroke={item.color}
                    activeDot={{ r: 8 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={yKey}
                  stroke="#1976D2"
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {series ? (
                series.map((item, index) => (
                  <Bar
                    key={item.key}
                    dataKey={item.key}
                    name={item.name}
                    fill={item.color}
                  />
                ))
              ) : (
                <Bar dataKey={yKey} fill="#1976D2" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey={valueKey}
                nameKey={nameKey}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => {
                  // Use category-specific color if available
                  let color = COLORS[index % COLORS.length];

                  if (
                    nameKey === "category" &&
                    CATEGORY_COLORS[entry[nameKey]]
                  ) {
                    color = CATEGORY_COLORS[entry[nameKey]];
                  }

                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Pie>
              {showLegend && <Legend />}
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  return [
                    `${value} (${(
                      (value /
                        data.reduce((sum, item) => sum + item[valueKey], 0)) *
                      100
                    ).toFixed(1)}%)`,
                    name,
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className={className} ref={containerRef}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {data.length > 0 ? (
        renderChart()
      ) : (
        <div className="flex items-center justify-center h-full min-h-[200px] bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
}
