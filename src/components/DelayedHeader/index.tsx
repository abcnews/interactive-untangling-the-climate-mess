import React from 'react';
import styles from './styles.scss';

interface DelayedHeaderProps {}

const DelayedHeader: React.FC<DelayedHeaderProps> = () => {
  return (
    <div className={styles.root}>
      <p><span>Climate change - we get it, it’s a depressing mess.</span></p>
      <p><span>We’ve spent the last thirty years not making the drastic changes needed to protect our way of life.</span></p>
    </div>
  );
}

export default DelayedHeader;
