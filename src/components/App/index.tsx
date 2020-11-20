import React from 'react';
import Worm from '../Worm';
import styles from './styles.scss';

interface AppProps {
  projectName: string;
}

const App: React.FC<AppProps> = ({ projectName }) => {
  return (
    <div className={styles.root}>
      <h1>{projectName}</h1>
    </div>
  );
};

export default App;
