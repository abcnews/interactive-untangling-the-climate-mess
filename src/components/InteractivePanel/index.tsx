import React, { useState, useEffect } from "react";
import styles from "./styles.scss";

type InteractivePanelProps = { panelKey };

const InteractivePanel: React.FC<InteractivePanelProps> = props => {
  const { panelKey } = props;
  const [hidden, setHidden] = useState(false);
  const [panelText, setPanelText] = useState("This is the default panel text.");

  // onMount
  useEffect(() => {
    // setTimeout(() => {
    //   setHidden(true);
    // }, 10000);
  }, []);

  return (
    <div className={`${styles.root} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.panelContentContainer}>{panelText}</div>
    </div>
  );
};

export default InteractivePanel;
