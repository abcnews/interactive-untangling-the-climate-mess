import React from 'react';
import styles from './styles.scss';

console.log("Intersection code running...")

interface IntersectionTellerProps {}

const IntersectionTeller: React.FC<IntersectionTellerProps> = () => {
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/IntersectionTeller</strong>
    </div>
  );
}

export default IntersectionTeller;
