import React, { useEffect } from "react";
import styles from "./styles.scss";

interface StoryPanelProps {}

const StoryPanel: React.FC<StoryPanelProps> = () => {
  useEffect(() => {
    console.log("StoryPanel component mounted...");
  }, []);
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/StoryPanel</strong>
    </div>
  );
};

export default StoryPanel;
