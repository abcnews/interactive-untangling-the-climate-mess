import React from 'react';
import styles from './styles.scss';

interface ParagraphObserverProps {}

const ParagraphObserver: React.FC<ParagraphObserverProps> = () => {
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/ParagraphObserver</strong>
    </div>
  );
}

export default ParagraphObserver;
