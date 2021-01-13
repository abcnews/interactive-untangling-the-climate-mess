import React from "react";
import styles from "./styles.scss";

const defaultProps = {
  heading: "Proportion of emissions",
  bars: [{ title: "Enery", percent: 33 }],
};

const Bar = (props) => {
  return (
    <div className={styles.barOutline}>
    <div className={styles.bar} style={{width: `${props.percent}%`}}></div>
    </div>
  );
};

interface BarChartProps {
  heading?: string;
  bars?: any[]
}

const BarChart: React.FC<BarChartProps> = ({ heading }) => {
  return (
    <div className={styles.root}>
      <h3 className={styles.heading}>{heading}</h3>
      <Bar percent={20} />
    </div>
  );
};

BarChart.defaultProps = defaultProps;

export default BarChart;
