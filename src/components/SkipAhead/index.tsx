import React from "react";
import Portal from "react-portal";
import a2o from "@abcnews/alternating-case-to-object";

import styles from "./styles.scss";

type SkipAheadProps = { mount?: any; scroll: any; applySkipAhead: any };

const SkipAhead: React.FC<SkipAheadProps> = ({
  mount,
  scroll,
  applySkipAhead,
  ...props
}) => {
  const { id } = mount;
  const config = a2o(id || "TOundefined");
  const { from, to } = config;
  const target = document.getElementById(to);

  function getQuestionKey(shortId: string) {
    switch (shortId) {
      case "renewables":
        return "SUBQ1-renewables-zero-carbon";
      case "agriculture":
        return "SUBQ2-livestock-emissions";
      case "transport":
        return "SUBQ3-transportation-off-fossil";
      case "industry":
        return "SUBQ4-industry-emissions";
    }

    return null;
  }

  return (
    <div className={styles.root}>
      <button
        onClick={() => {
          scroll.animateScroll(target);
          applySkipAhead(getQuestionKey(from));
        }}
      >
        Skip ahead
      </button>
    </div>
  );
};

export default SkipAhead;
