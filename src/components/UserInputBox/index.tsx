import React from 'react';
import styles from './styles.scss';

interface UserInputBoxProps {
  title: string;
}

const UserInputBox: React.FC<UserInputBoxProps> = props => {
  return (
    <div className={styles.root}>
      <h1>{props.title}</h1>
    </div>
  );
};

export default UserInputBox;
