import React from "react";
import styles from "./styles.scss";

const defaultProps = {
  heading: "Proportion of emissions",
  bars: [{ title: "Enery", percent: 33 }],
};

const Bar = ({ color, percent, title, textColor }) => {
  return (
    <div className={styles.barContainer}>
      <div className={styles.text} style={{color: textColor}}>{title} <span style={{color: textColor}}>{percent}%</span></div>
      <div className={styles.barOutline}>
        <div
          className={styles.bar}
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            boxShadow: `0 0 0 3px ${color}`,
          }}
        ></div>
      </div>
    </div>
  );
};

interface BarChartProps {
  heading?: string;
  bars?: any[];
}

const BarChart: React.FC<BarChartProps> = ({ heading, bars }) => {
  return (
    <div className={styles.root}>
      <h3 className={styles.heading}>{heading}</h3>
      {bars?.map((bar) => (
        <Bar percent={bar.percent} color={bar.color} title={bar.title} textColor={bar.color} />
      ))}
    </div>
  );
};

BarChart.defaultProps = defaultProps;

export default BarChart;
