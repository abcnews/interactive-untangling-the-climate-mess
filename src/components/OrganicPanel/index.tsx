import React from "react";
import styles from "./styles.scss";

import background from "./organic-panel-background-variation-1.svg";
import background2 from "./organic-panel-background-variation-2.svg";

const backgrounds = [background, background2];

type OrganicPanelProps = { backgroundVariation?: number };

const OrganicPanel: React.FC<OrganicPanelProps> = ({
  backgroundVariation = 0,
  children,
  ...props
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.background}>
        <img
          src={backgrounds[backgroundVariation]}
          className={styles.stretch}
        />
      </div>
      {children}
    </div>
  );
};

// OrganicPanel.defaultProps = {
//   backgroundVariation: 0
// };

export default OrganicPanel;
