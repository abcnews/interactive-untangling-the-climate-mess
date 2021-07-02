import React from 'react';
import styles from './styles.scss';

type PillBoxProps = {}

const PillBox: React.FC<PillBoxProps> = () => {
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/PillBox</strong>
    </div>
  );
}

export default PillBox;
