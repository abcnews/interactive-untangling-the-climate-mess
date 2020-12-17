import "./keyshape";
declare let KeyshapeJS;

import React, {
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
  useState,
} from "react";
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
const endStrings = [endString1, endString2, endString3, endString4, endString5];

const lookupRange = (marker: any) => {
  console.log(typeof marker);
  if (marker === 1 || isNaN(Number(marker)))
    return {
      start: "1a",
      end: "2",
      loopback: "1a",
    };

  if (marker === 19)
    return {
      start: "19",
      end: "20",
      loopback: null,
    };

  const markerInt: number = Number(marker);

  return {
    start: markerInt + "",
    end: markerInt + 1 + "",
    loopback: marker + "a",
  };
};

interface BackgroundVisProps {
  animationFrame: number;
  scrollMarker?: string;
}

const BackgroundVis: React.FC<BackgroundVisProps> = (props) => {
  // Use a component ref objet to store things properly
  // across renders.
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Component state
  const [markers, setMarkers] = useState({});

  // Init component vars
  let timeline = component.timeline;
  let ranges = component.ranges;

  const init = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;

    console.log("Initialising animation...");

    import("./assets/animations").then(({ animate }) => {
      // Set up the animations and return a timeline
      component.timeline = animate();

      // Load up the timeline markers so we can compare them later
      setMarkers(
        component.timeline.l?.markers || component.timeline._options.markers
      );

      component.ranges = { startLoop: ["1a", "2"] };
      component.timeline.range(...component.ranges.startLoop);
      component.timeline.loop(true);

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
    if (!props.scrollMarker || !timeline) return;

    const { scrollMarker } = props;
    console.log("Scroll marker prop:", scrollMarker);
    const currentTime = timeline.time();
    console.log("Current time:", currentTime);
    const markerTime = markers[scrollMarker];
    console.log("Marker time:", markerTime);
    // const playloop = rangeLookup[scrollMarker] || rangeLookup["1"];
    const playloop = lookupRange(scrollMarker);
    console.log("Range lookup:", playloop);
    const endTime = markers[playloop.end];
    console.log("End time:", endTime);

    // If going forward
    if (currentTime < endTime) {
      timeline.rate(1);
      timeline.loop(false);
      timeline.range(currentTime, endTime);
      timeline.time(currentTime);
      timeline.play();
      timeline.onfinish = function () {
        if (!playloop.loopback) {
          this.pause();
          return;
        }

        console.log("Finished... now looping");
        this.loop(true);
        this.range(playloop.loopback, playloop.end);
        this.play();
      };
    }

    // If scrolling back up
    if (currentTime > endTime) {
      timeline.rate(-1);
      timeline.loop(false);
      timeline.range(playloop.loopback, currentTime);
      timeline.time(currentTime);
      timeline.play();
      timeline.onfinish = function () {
        if (!playloop.loopback) {
          this.pause();
          return;
        }

        console.log("Finished... now looping");
        timeline.rate(1);
        this.loop(true);
        this.range(playloop.loopback, playloop.end);
        this.play();
      };
    }
  }, [props.scrollMarker]);

  useEffect(() => {
    console.log("Animation markers:", markers);
  }, [markers]);

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

        {/* {endStrings.map((svg, index) => {
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
