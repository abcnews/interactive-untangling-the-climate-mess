import React from 'react';
import styles from './styles.scss';

// Actually don't think we'll do it this way (delete this component)

interface StateMachineProps {}

const StateMachine: React.FC<StateMachineProps> = () => {
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/StateMachine</strong>
    </div>
  );
}

export default StateMachine;
