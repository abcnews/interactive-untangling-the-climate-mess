import React from 'react';
import styles from './styles.scss';

interface DelayedHeaderProps {}

const DelayedHeader: React.FC<DelayedHeaderProps> = () => {
  return (
    <div className={styles.root}>
      <p><span>Climate change - we get it, it’s a depressing mess.</span></p>
    </div>
  );
}

export default DelayedHeader;
