import React from 'react';
import { Portal } from 'react-portal';

// Import stylsheets
import styles from './styles.scss';

// Import components
import UserInputBox from '../UserInputBox/index';

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
        <UserInputBox title={""} />
      </Portal>
    </>
  );
};

export default App;
