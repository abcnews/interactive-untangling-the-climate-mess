/** @format */

import React from "react";
import styles from "./styles.scss";

type DynamicTextProps = {
  text: string;
  userInputState: any;
};

const DynamicText: React.FC<DynamicTextProps> = props => {
  const { text, userInputState } = props;
  console.log("Dynamic Text Component:", userInputState["MAINQ1-can-we-still-save-the-world"]);
  return <div className={styles.root}>{userInputState["MAINQ1-can-we-still-save-the-world"]}</div>;
};

export default DynamicText;
