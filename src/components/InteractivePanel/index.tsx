import React, { useState, useEffect } from "react";
import styles from "./styles.scss";

type InteractivePanelProps = {};

const InteractivePanel: React.FC<InteractivePanelProps> = props => {
  const [hidden, setHidden] = useState(false);

  // onMount
  useEffect(() => {
    // setTimeout(() => {
    //   setHidden(true);
    // }, 10000);
  }, []);

  return (
    <div className={`${styles.root} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.panelContentContainer}>
        Interactive content will go here!!!
      </div>
    </div>
  );
};

export default InteractivePanel;
