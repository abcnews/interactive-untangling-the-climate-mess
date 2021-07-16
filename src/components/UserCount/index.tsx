import React, { useEffect } from "react";
import styles from "./styles.scss";
import { Portal } from "react-portal";

type UserCountProps = {
  anchorString?: string;
};

const UserCount: React.FC<UserCountProps> = ({
  anchorString = "#pollcountertext",
  ...props
}) => {
  useEffect(() => {
    const el = document.querySelector(`a[href='${anchorString}']`);

    console.log(el);
  }, []);

  return (
    <Portal>
      <span className={styles.root}>1234</span>
    </Portal>
  );
};

export default UserCount;
