import React, { useState, useEffect } from "react";
import styles from "./styles.scss";

type InteractivePanelProps = { panelKey };

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
        Panel key: {props.panelKey}
      </div>
    </div>
  );
};

export default InteractivePanel;
