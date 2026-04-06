import React from "react";
import {XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart} from "recharts";

const CustomLineChart = ({data = []}) => {
    const CustomTooltip = ({active, payload}) => {
        if (active && payload && payload.length) {
            const point = payload[0].payload;

            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-xs font-semibold text-purple-800 mb-1">
                        {point.category}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                        {point.displayDate}
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount:{" "}
                        <span className="text-sm font-medium text-gray-900">
                            ${point.amount}
                        </span>
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="bg-white mt-6">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{top: 10, right: 20, left: 0, bottom: 0}}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                    <XAxis
                        dataKey="xKey"
                        stroke="none"
                        tick={{ fontSize: 12, fill: "#555" }}
                        tickFormatter={(value) => value.split("__")[0]}
                    />

                    <YAxis
                        stroke="none"
                        tick={{ fontSize: 12, fill: "#555" }}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#875CF5"
                        fill="#cfbefb"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomLineChart;