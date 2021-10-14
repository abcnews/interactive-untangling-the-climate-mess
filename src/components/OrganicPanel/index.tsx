import React, { useEffect, useRef } from "react";
import styles from "./styles.scss";

import background from "./organic-panel-background-variation-1.svg";
import background2 from "./organic-panel-background-variation-2.svg";
import background3 from "./organic-panel-background-variation-3.svg";

const backgrounds = [background, background2, background3];

type OrganicPanelProps = {
  backgroundVariation?: number;
  contentEl?: any;
  isCentered?: boolean;
  pullLeftOnDesktop?: boolean;
};

const OrganicPanel: React.FC<OrganicPanelProps> = ({
  backgroundVariation = 0,
  children,
  contentEl,
  isCentered = false,
  pullLeftOnDesktop = true,
  ...props
}) => {
  const thisRef = useRef(null);

  useEffect(() => {
    if (typeof contentEl === "undefined") return;

    if (thisRef.current) {
      const componentEl: any = thisRef.current;
      componentEl.appendChild(contentEl);
    }
  }, [contentEl]);

  return (
    <div
      ref={thisRef}
      className={`${styles.root} ${isCentered && styles.center} ${
        pullLeftOnDesktop && styles.pullLeftOnDesktop
      }`}
    >
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

export default OrganicPanel;
