import React from "react";
import styles from "./styles.scss";

import background from "./organic-panel-background.svg";

type OrganicPanelProps = {};

const OrganicPanel: React.FC<OrganicPanelProps> = props => {
  return (
    <div className={styles.root}>
      <div className={styles.background}>
        <img src={background} className={styles.stretch} />
      </div>
      {props.children}
    </div>
  );
};

export default OrganicPanel;
