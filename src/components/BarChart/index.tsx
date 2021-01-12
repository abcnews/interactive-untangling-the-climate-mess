import React from 'react';
import styles from './styles.scss';

interface BarChartProps {}

const BarChart: React.FC<BarChartProps> = () => {
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/BarChart</strong>
    </div>
  );
}

export default BarChart;
