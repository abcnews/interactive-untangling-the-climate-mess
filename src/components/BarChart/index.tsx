import React from "react";
import styles from "./styles.scss";

const Bar = () => {
  return <div className={styles.bar}></div>;
};

interface BarChartProps {}

const BarChart: React.FC<BarChartProps> = () => {
  return (
    <div className={styles.root}>
      <Bar />
    </div>
  );
};

export default BarChart;
