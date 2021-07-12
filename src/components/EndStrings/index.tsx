import styles from "./styles.scss";
import React, { useState, useEffect, useRef } from "react";
import SVG from "react-inlinesvg";
import "../MainTangle/keyshape";
declare let KeyshapeJS;

// Load up end tangles
import endString1 from "./assets/end-string-1.svg";
import endString2 from "./assets/end-string-2.svg";
import endString3 from "./assets/end-string-3.svg";
import endString4 from "./assets/end-string-4.svg";
import endString5 from "./assets/end-string-5.svg";

// Put them in an array
const endStrings = [endString1, endString2, endString3, endString4, endString5];

import string1Animation from "./assets/end-string-1";
import string2Animation from "./assets/end-string-2";
import string3Animation from "./assets/end-string-3";
import string4Animation from "./assets/end-string-4";
import string5Animation from "./assets/end-string-5";

const stringAnimations = {
  renewables: string1Animation,
  transportation: string2Animation,
  carboncapture: string3Animation,
  industry: string4Animation,
  livestock: string5Animation
};

const PLAY_RATE = 0.8;

// define our timesline, just module scoped for now
let timelines: any = {};

interface EndStringsProps {
  opacity: number;
  stringsNew?: any;
}

const EndStrings: React.FC<EndStringsProps> = props => {
  const [allLoaded, setAllLoaded] = useState(false);
  const [stringOne, setStringOne] = useState(false);
  const [strings, setStrings] = useState({
    renewables: 0,
    transportation: 0,
    carboncapture: 0,
    industry: 0,
    livestock: 0
  });

  function initAnimations(iteration) {
    // So we can load up all the animations
    let animationNumber: string = "renewables";
    if (iteration === 1) animationNumber = "transportation";
    if (iteration === 2) animationNumber = "carboncapture";
    if (iteration === 3) animationNumber = "industry";
    if (iteration === 4) {
      animationNumber = "livestock";

      setAllLoaded(true);
    }

    // Load all timelines into a timeline object
    timelines[animationNumber] = stringAnimations[animationNumber]()
      .rate(PLAY_RATE)
      .pause(1);
  }

  function resetAnimations() {
    for (const tl in timelines) {
      timelines[tl].pause(0);
    }
  }

  useEffect(() => {
    // Make sure ks is on window
    (window as any).ks = (document as any).ks = KeyshapeJS;
  }, []);

  useEffect(
    function () {
      if (!allLoaded) return;
      console.log("All end animations loaded...");
    },
    [allLoaded]
  );

  useEffect(() => {
    if (!allLoaded) return;

    const { stringsNew } = props;

    for (const key in stringsNew) {
      // If new string wants to come in
      if (stringsNew[key] > strings[key]) {
        timelines[key].range(1, "2");
        timelines[key].time(1);
        timelines[key].loop(false);
        timelines[key].play();

        timelines[key].onfinish = function () {
          this.loop(true);
          this.range("1a", "2");
          timelines[key].time("1a"); // Don't you, forget about me
          this.play();
        };
      }

      // If new string wants to go out
      if (stringsNew[key] < strings[key]) {
        timelines[key].range("2", timelines[key].duration() - 50);
        timelines[key].time("2");
        timelines[key].loop(false);
        timelines[key].play();

        timelines[key].onfinish = function () {
          // this.loop(true);
          // this.range("1a", "2");
          // timelines[key].time("1a"); // Don't you, forget about me
          this.pause();
        };
      }
    }

    setStrings(stringsNew);
  }, [props.stringsNew]);

  return (
    <div className={styles.root} style={{ opacity: props.opacity }}>
      {endStrings.map((svg, index) => {
        return (
          <div className={styles.svgLayer} key={index}>
            <SVG
              src={svg}
              preProcessor={code => {
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
