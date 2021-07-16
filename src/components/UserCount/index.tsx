import React from "react";
import styles from "./styles.scss";
import { Portal } from "react-portal";

type UserCountProps = {
  anchorString?: string;
};

const UserCount: React.FC<UserCountProps> = ({
  anchorString = "#pollcountertext",
  ...props
}) => {
  return <Portal><span className={styles.root}>1234</span></Portal>;
};

export default UserCount;
