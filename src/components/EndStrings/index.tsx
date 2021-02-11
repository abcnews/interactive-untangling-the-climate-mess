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

// Put them in an array
const endStrings = [endString1, endString2, endString3, endString4, endString5];

import string1Animation from "./assets/end-string-1";
import string2Animation from "./assets/end-string-2";
import string3Animation from "./assets/end-string-3";
import string4Animation from "./assets/end-string-4";
import string5Animation from "./assets/end-string-5";

const stringAnimations = {
  one: string1Animation,
  two: string2Animation,
  three: string3Animation,
  four: string4Animation,
  five: string5Animation,
};

// define our timesline, just module scoped for now
let timelines: any = {};

interface EndStringsProps {
  opacity: number;
}

const EndStrings: React.FC<EndStringsProps> = (props) => {
  const [allLoaded, setAllLoaded] = useState(false);

  function initAnimations(iteration) {
    // So we can load up all the animations
    let animationNumber: string = "one";
    if (iteration === 1) animationNumber = "two";
    if (iteration === 2) animationNumber = "three";
    if (iteration === 3) animationNumber = "four";
    if (iteration === 4) {
      animationNumber = "five";

      setAllLoaded(true);
    }

    // Load all timelines into a timeline object
    timelines[animationNumber] = stringAnimations[animationNumber]().rate(0.5).pause();
  }

  useEffect(() => {
    // Make sure ks is on window
    (window as any).ks = (document as any).ks = KeyshapeJS;
  }, []);

  useEffect(
    function () {
      if (!allLoaded) return;
      console.log("All end animations loaded...")

      // setTimeout(() => {
      //   timelines.one.play();
      // }, 3000);
      // setTimeout(() => {
      //   timelines.two.play();
      // }, 2000);
      // setTimeout(() => {
      //   timelines.three.play();
      // }, 1000);
      // setTimeout(() => {
      //   timelines.four.play();
      // }, 4000);
      // setTimeout(() => {
      //   timelines.five.play();
      // }, 5000);

    },
    [allLoaded]
  );

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
                initAnimations(index);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EndStrings;
