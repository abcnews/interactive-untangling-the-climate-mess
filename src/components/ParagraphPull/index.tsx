import React from 'react';
import styles from './styles.scss';

type ParagraphPullProps = {}

const ParagraphPull: React.FC<ParagraphPullProps> = () => {
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/ParagraphPull</strong>
    </div>
  );
}

export default ParagraphPull;
