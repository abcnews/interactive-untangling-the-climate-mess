import React from "react";
import Portal from "react-portal";
import a2o from "@abcnews/alternating-case-to-object";

import styles from "./styles.scss";

type SkipAheadProps = { mount?: any; scroll: any };

const SkipAhead: React.FC<SkipAheadProps> = ({ mount, scroll, ...props }) => {
  const { id } = mount;
  const config = a2o(id || "TOundefined");
  const { to } = config;
  const target = document.getElementById(to);

  return (
    <div className={styles.root}>
      <button
        onClick={() => {
          scroll.animateScroll(target);
        }}
      >
        Skip ahead
      </button>
    </div>
  );
};

export default SkipAhead;
