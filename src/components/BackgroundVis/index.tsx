import "./keyshape";
declare let KeyshapeJS;

import React, { useEffect, useRef, useLayoutEffect, useContext } from "react";
import styles from "./styles.scss";
import SVG from "react-inlinesvg";

import untangleAnimation from "./assets/untangle-loop.svg";

import background from "./assets/background.jpg";
import { AppContext } from "../../AppContext";

// Load up end tangles
import endString1 from "./assets/EndString1.svg";
import endString2 from "./assets/EndString2.svg";
import endString3 from "./assets/EndString3.svg";
import endString4 from "./assets/EndString4.svg";
import endString5 from "./assets/EndString5.svg";

// Put them in an array
const endStringArray = [
  endString1,
  endString2,
  endString3,
  endString4,
  endString5,
];

interface BackgroundVisProps {
  animationFrame: number;
  scrollMarker?: string;
}

const BackgroundVis: React.FC<BackgroundVisProps> = (props) => {
  // Use a component ref objet to store things properly
  // across renders.
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Init component vars
  let timeline = component.timeline;
  let markers = component.markers;

  const init = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;

    console.log("Initialising animation...");

    import("./assets/animations").then(({ animate }) => {
      // Set up the animations and return a timeline
      component.timeline = animate();

      // Load up the timeline markers so we can compare them later
      component.markers = component.timeline.l?.markers || component.timeline._options.markers;

      component.ranges = { startLoop: ["1a", "2"] };
      component.timeline.range(...component.ranges.startLoop);
      component.timeline.loop(true);

      // Pause when done with certain range
      // component.timeline.onfinish = function () {
      //   this.pause();
      // };

      component.timeline.play();
    });
  };

  useEffect(() => {
    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!timeline) return;

    timeline.pause(props.animationFrame);
  }, [props.animationFrame]);

  // Do something when scrollMarker changes
  useEffect(() => {
    // Note animationFrames sent before rendered
    // will not be reflected in graphic

    console.log("Scroll marker prop:", props.scrollMarker);

    if (!props.scrollMarker || !timeline) return;

    const { scrollMarker } = props;

    console.log(markers[scrollMarker]);

    // const rangeStart =
    //   typeof markers[scrollMarker] === "undefined"
    //     ? scrollMarker + "a"
    //     : scrollMarker + "";

    // const rangeEnd = scrollMarker + 1 + "";

    // if (
    //   typeof markers[rangeStart] === "undefined" ||
    //   typeof markers[rangeEnd] === "undefined"
    // )
    //   return;

    // timeline.range(rangeStart, rangeEnd);
    // timeline.loop(0);
    // timeline.play();
  }, [props.scrollMarker]);

  return (
    <>
      <div className={styles.backgroundImageContainer}>
        <img className={styles.backgroundImage} src={background} />
      </div>

      <div className={styles.root}>
        <SVG
          src={untangleAnimation}
          preProcessor={(code) => {
            // console.log(code)
            return code;
          }}
          onLoad={init}
        />

        {/* {endStringArray.map((svg, index) => {
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
        })} */}
      </div>
    </>
  );
};

export default BackgroundVis;
