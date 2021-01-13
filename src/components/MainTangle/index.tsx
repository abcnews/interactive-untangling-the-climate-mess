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

// import background from "./assets/background.jpg";
import { AppContext } from "../../AppContext";

const PLAY_RATE = 1.888;

const lookupRange = (marker: string) => {
  if (marker === "1" || isNaN(Number(marker)))
    return {
      start: "1a",
      end: "2",
      loopback: "1a",
    };

  if (marker === "19")
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

interface MainTangleProps {
  animationFrame: number;
  scrollMarker?: string;
}

const MainTangle: React.FC<MainTangleProps> = (props) => {
  // Use a component ref objet to store things properly
  // across renders.
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Component state
  const [markers, setMarkers] = useState({});

  // Init component vars
  let timeline = component.timeline;
  // let ranges = component.ranges;

  const initSvg = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;

    console.log("Initialising animation...");

    import("./assets/animations").then(({ animate }) => {
      // Set up the animations and return a timeline
      component.timeline = animate();
      const timeline = component.timeline;

      // Load up the timeline markers so we can compare them later
      setMarkers(timeline.l?.markers || timeline._options.markers);

      // Try to start animation down page on reload
      console.log("scroll marker:", props.scrollMarker);
      const playloop = lookupRange(props.scrollMarker + "");
      console.log(playloop);

      if (!playloop.loopback) {
        timeline.pause(playloop.start);
      } else {
        timeline.rate(PLAY_RATE);
        timeline.loop(true);
        timeline.range(playloop.loopback, playloop.end);
        timeline.time(playloop.loopback);
        timeline.play();
      }
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
    // console.log("Received scroll marker:", props.scrollMarker);
    
    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!props.scrollMarker || !timeline) return;

    const { scrollMarker }: { scrollMarker?: string } = props;
    // console.log("Scroll marker prop:", scrollMarker);
    const currentTime = timeline.time();
    // console.log("Current time:", currentTime);

    const markerTime = markers[scrollMarker];
    // console.log("Marker time:", markerTime);

    // Coerce type as string here as it doesn't check for some reason
    const playloop = lookupRange(scrollMarker + "");

    // console.log("Range lookup:", playloop);
    const endTime = markers[playloop.end];
    // console.log("End time:", endTime);

    // If going forward
    if (currentTime < endTime) {
      timeline.rate(PLAY_RATE);
      timeline.loop(false);
      timeline.range(currentTime, endTime);
      timeline.time(currentTime);
      timeline.play();
      timeline.onfinish = function () {
        if (!playloop.loopback) {
          this.pause();
          return;
        }

        this.loop(true);
        this.range(playloop.loopback, playloop.end);
        this.play();
      };
    }

    // If scrolling back up
    if (currentTime > endTime) {
      timeline.rate(-PLAY_RATE);
      timeline.loop(false);
      timeline.range(playloop.loopback, currentTime);
      timeline.time(currentTime);
      timeline.play();
      timeline.onfinish = function () {
        if (!playloop.loopback) {
          this.pause();
          return;
        }

        timeline.rate(PLAY_RATE);
        this.loop(true);
        this.range(playloop.loopback, playloop.end);
        this.play();
      };
    }
  }, [props.scrollMarker]);

  // useEffect(() => {
  //   console.log("Animation markers:", markers);
  // }, [markers]);

  return (
    <>
      {/* <div className={styles.backgroundImageContainer}>
        <img className={styles.backgroundImage} src={background} />
      </div> */}

      <div className={styles.root}>
        <div className={styles.svgContainer}>
          <SVG
            className={styles.svg}
            src={untangleAnimation}
            preProcessor={(code) => {
              // console.log(code)
              return code;
            }}
            onLoad={initSvg}
          />
        </div>
      </div>
    </>
  );
};

export default MainTangle;
