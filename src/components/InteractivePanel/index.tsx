import React from 'react';
import styles from './styles.scss';

type InteractivePanelProps = {}

const InteractivePanel: React.FC<InteractivePanelProps> = () => {
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/InteractivePanel</strong>
    </div>
  );
}

export default InteractivePanel;
