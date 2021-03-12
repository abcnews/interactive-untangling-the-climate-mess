/** @format */

import React from "react";
import styles from "./styles.scss";

type DynamicTextProps = {
  text: string;
  userInputState: any;
};

const DynamicText: React.FC<DynamicTextProps> = props => {
  const { text } = props;
  return <div className={styles.root}>{text}</div>;
};

export default DynamicText;
