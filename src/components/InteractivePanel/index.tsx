import React from "react";
import styles from "./styles.scss";

type InteractivePanelProps = {};

const InteractivePanel: React.FC<InteractivePanelProps> = () => {
  return (
    <div className={styles.root}>
      <div className={styles.panelContentContainer}>
        Interactive content will go here!!!
      </div>
    </div>
  );
};

export default InteractivePanel;
