import React from 'react';
import SVG from "react-inlinesvg";

import styles from './styles.scss';

// Load up end tangles
import endString1 from "./assets/EndString1.svg";
import endString2 from "./assets/EndString2.svg";
import endString3 from "./assets/EndString3.svg";
import endString4 from "./assets/EndString4.svg";
import endString5 from "./assets/EndString5.svg";


// Put them in an array
const endStrings = [endString1, endString2, endString3, endString4, endString5];

interface EndStringsProps {}

const EndStrings: React.FC<EndStringsProps> = () => {
  return (
    <div className={styles.root}>
      {endStrings.map((svg, index) => {
          return (
            <div className={styles.svgLayer} key={index}>
              <SVG
                src={svg}
                preProcessor={(code) => {
                  return code;
                }}
                onLoad={() => {
                  // animate();
                }}
              />
            </div>
          );
        })}
    </div>
  );
}

export default EndStrings;
