import React from "react";
import BarChart from "../BarChart";

type ProportionsChartProps = {
  dynamicText: Record<string, string>;
};

const ProportionsChart: React.FC<ProportionsChartProps> = ({ dynamicText }) => {
  return (
    <BarChart
      bars={[
        {
          title: "Electricity",
          percent: parseInt(dynamicText["CHART-percent-electricity"] || "37"),
          color: "#F65C1B", // Orange
          textColor: "#C42F05" // Text orange
        },
        {
          title: "Agriculture",
          percent: parseInt(dynamicText["CHART-percent-agriculture"] || "12"),
          color: "#007B52", // Green
          textColor: "#007B52"
        },
        {
          title: "Transport",
          percent: parseInt(dynamicText["CHART-percent-transport"] || "19"),
          color: "#007CBF", // Light blue
          textColor: "#007CBF"
        },
        {
          title: "Industry",
          percent: parseInt(dynamicText["CHART-percent-industry"] || "32"),
          color: "#2A4059", // Dark blue
          textColor: "#2A4059"
        }
      ]}
    />
  );
};

export default ProportionsChart;
