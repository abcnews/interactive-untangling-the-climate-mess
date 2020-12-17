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

const rangeLookup = {
  1: {
    start: "1a",
    end: "2",
    loopback: "1a",
  },
  2: {
    start: "2",
    end: "3",
    loopback: "2a",
  },
  3: {
    start: "3",
    end: "4",
    loopback: "3a",
  },
  4: {
    start: "4",
    end: "5",
    loopback: "4a",
  },
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
    if (!props.scrollMarker || !timeline) return;

    const { scrollMarker } = props;
    console.log("Scroll marker prop:", scrollMarker);
    const currentTime = timeline.time();
    console.log("Current time:", currentTime);
    const markerTime = markers[scrollMarker];
    console.log("Marker time:", markerTime);
    const playloop = rangeLookup[scrollMarker] || rangeLookup["1"];
    console.log("Range lookup:", playloop);

    timeline.loop(false);
    timeline.range(playloop.start, playloop.end);
    timeline.time(playloop.start);
    timeline.onfinish = function () {
      console.log("Finished... now looping")
      this.loop(true);
      this.range(playloop.loopback, playloop.end);
      this.play()
    };

    // if (markerTime) {
    //   timeline.range(currentTime, markerTime);
    // } else {
    //   timeline.range(...ranges.startLoop);
    // }

    // console.log(markers[scrollMarker]);

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
