import styles from "./styles.scss";
import React, { useState, useEffect, useRef } from "react";
import SVG from "react-inlinesvg";
import "../MainTangle/keyshape";
declare let KeyshapeJS;

// Load up end tangles
import endString1 from "./assets/EndString1.svg";
import endString2 from "./assets/EndString2.svg";
import endString3 from "./assets/EndString3.svg";
import endString4 from "./assets/EndString4.svg";
import endString5 from "./assets/EndString5.svg";

import string1Animation from "./assets/end-string-1";

// Put them in an array
const endStrings = [
  endString1,
  // endString2
];

interface EndStringsProps {
  opacity: number;
}

const EndStrings: React.FC<EndStringsProps> = (props) => {
  function initAnimations() {
    const timeline1 = string1Animation();

    console.log(timeline1);
  }

  useEffect(() => {
    // Make sure ks is on window
    (window as any).ks = (document as any).ks = KeyshapeJS;
  }, []);

  return (
    <div className={styles.root} style={{ opacity: props.opacity }}>
      {endStrings.map((svg, index) => {
        return (
          <div className={styles.svgLayer} key={index}>
            <SVG
              src={svg}
              preProcessor={(code) => {
                return code;
              }}
              onLoad={(src, hasCache) => {
                initAnimations();
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EndStrings;
