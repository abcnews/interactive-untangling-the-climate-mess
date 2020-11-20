import React from 'react';
import { Portal } from 'react-portal';

import styles from './styles.scss';

interface AppProps {
  projectName: string;
}

const App: React.FC<AppProps> = ({ projectName }) => {
  return (
    <>
      {/* <div className={styles.root}>
        <h1>{projectName}</h1>
      </div> */}

      <Portal node={document && document.getElementById('portalmount')}>
        <div className={styles.userInputBox}></div>
      </Portal>
    </>
  );
};

export default App;
