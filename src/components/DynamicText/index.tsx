/** @format */

import React from "react";
import styles from "./styles.scss";

type DynamicTextProps = {
  watchForKey: string;
  userInputState: any;
};

const DynamicText: React.FC<DynamicTextProps> = props => {
  const { watchForKey, userInputState } = props;
  console.log("Dynamic Text Component:", userInputState[watchForKey]);
  return <div className={styles.root}>{userInputState[watchForKey]}</div>;
};

export default DynamicText;
