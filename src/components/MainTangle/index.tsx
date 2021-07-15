import "./keyshape";
declare let KeyshapeJS;

import React, { useEffect, useRef, useContext, useState } from "react";
import styles from "./styles.scss";
import SVG from "react-inlinesvg";
import { gsap } from "gsap";

import untangleAnimation from "./assets/untangling-color-change.svg";

const PLAY_RATE = 1;

const lookupRange = (marker: string) => {
  if (marker === "1" || marker === "initial")
    return {
      start: "1a",
      end: "2",
      loopback: "1a"
    };

  if (marker === "19")
    return {
      start: "19",
      end: "20",
      loopback: null
    };

  // If any other marker just stay at the end
  if (isNaN(Number(marker)))
    return {
      start: "19",
      end: "20",
      loopback: null
    };

  // Make sure number is a number
  const markerInt: number = Number(marker);

  return {
    start: markerInt + "",
    end: markerInt + 1 + "",
    loopback: marker + "a"
  };
};

interface MainTangleProps {
  animationFrame?: number;
  scrollMarker?: string;
  yOffset?: number;
  setBackgroundIsRendered?: any;
  opacity: number;
  xPos?: number;
  yPos?: number; // Percent
  scale?: number; // Percent
  hidden?: boolean;
  maskPosition?: number;
  windowSize: number;
}

const MainTangle: React.FC<MainTangleProps> = ({
  hidden = true,
  maskPosition = 0,
  windowSize,
  ...props
}) => {
  const mainEl = useRef(null);
  // Component state
  const [markers, setMarkers] = useState({});
  const prevScrollMarker = usePrevious(props.scrollMarker);

  

  // Use a component ref objet to store things properly
  // across renders.
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Init component vars
  let timeline = component.timeline;

  const initSvg = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;

    import("./assets/untangling-color-change").then(({ animate }) => {
      // Set up the animations and return a timeline
      component.timeline = animate();
      const timeline = component.timeline;

      // Load up the timeline markers so we can compare them later
      setMarkers(timeline.l?.markers || timeline._options.markers);

      loadDownPage();
    });
  };

  function loadDownPage() {
    const timeline = component.timeline;

    const playloop = lookupRange(props.scrollMarker + ""); // Coerce to string

    // If at the end just play the end animation
    if (!playloop.loopback) {
      timeline.rate(PLAY_RATE);
      timeline.loop(false);
      timeline.range(playloop.start, playloop.end);
      timeline.time(playloop.start);
      timeline.play();
    } else {
      // Otherwise find where we are and play the loopback animation
      timeline.rate(PLAY_RATE);
      timeline.loop(true);
      timeline.range(playloop.loopback, playloop.end);
      timeline.time(playloop.loopback);
      timeline.play();
    }
  }

  // Init effect
  useEffect(() => {
    // Set initial marker pressure
    component.pressure = 0;

    // Tell App component that we've been rendered
    props.setBackgroundIsRendered(true);
  }, []);

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

    if (typeof prevScrollMarker === "undefined") {
      // If reloaded or hot reloaded
      loadDownPage();
    } else {
      // Speeds up animations if user is scrolling quickly
      component.pressure = component.pressure + 1;

      const { scrollMarker }: { scrollMarker?: string } = props;

      const currentTime = timeline.time();
      // const markerTime = markers[scrollMarker];

      // Coerce type as string here as it doesn't check for some reason
      const playloop = lookupRange(scrollMarker + "");

      const endTime = markers[playloop.end];

      // If going forward
      if (currentTime < endTime) {
        // Speed up if over 2 transitions (over 2 to prevent speeding up on quick backtrack)
        // Pushed it back to over 1 for now as it wasn't what was causing
        // the speed up at the bottom, but rather a build up of pressure
        // and no release... much like life.
        timeline.rate(
          component.pressure > 1 ? PLAY_RATE * component.pressure : PLAY_RATE
        );
        timeline.loop(false);
        timeline.range(currentTime, playloop.end);
        timeline.time(currentTime);
        timeline.play();
        timeline.onfinish = function () {
          // Under pressure? Take the pressure off
          component.pressure = 0;
          timeline.rate(PLAY_RATE);

          if (!playloop.loopback) {
            this.pause();
            return;
          }

          this.loop(true);
          this.range(playloop.loopback, playloop.end);
          timeline.time(playloop.loopback); // Don't you, forget about me
          this.play();
        };
      }

      // If scrolling back up
      else if (currentTime > endTime) {
        timeline.rate(
          component.pressure > 1 ? -PLAY_RATE * component.pressure : -PLAY_RATE
        );
        timeline.loop(false);
        timeline.range(playloop.loopback, currentTime);
        timeline.time(currentTime);
        timeline.play();
        timeline.onfinish = function () {
          component.pressure = 0;
          // Keep looping backwards to avoid loop weirdness
          timeline.rate(-PLAY_RATE);

          if (!playloop.loopback) {
            this.pause();
            return;
          }

          this.loop(true);
          this.range(playloop.loopback, playloop.end);
          timeline.time(playloop.end);
          this.play();
        };
      } else {
        component.pressure = 0;
      }
    }
  }, [props.scrollMarker]);

  // props.yPos change effect
  useEffect(() => {
    if (
      typeof props.yPos === "undefined" ||
      typeof props.xPos === "undefined" ||
      typeof props.scale === "undefined"
    )
      return;

    gsap.to(mainEl.current, {
      y: props.yPos * window.innerHeight,
      x: props.xPos * window.innerWidth,
      scale: props.scale * 0.01,
      ease: "power3",
      duration: 1.25
    });
  }, [props.yPos, props.scale, props.xPos, windowSize]);

  return (
    <>
      <div
        className={`${styles.root} ${
          hidden ? styles.hidden : styles.notHidden
        }`}
        style={{ opacity: props.opacity }}
      >
        <div
          className={`interactive-main-tangle ${styles.svgContainer}`}
          ref={mainEl}
        >
          <SVG
            className={styles.svg}
            src={untangleAnimation}
            preProcessor={code => {
              return code;
            }}
            onLoad={initSvg}
            uniqueHash={"maintangle"}
            uniquifyIDs={true}
            // style={{WebkitMaskPosition: `0 ${maskPosition}vh`}}
          />
        </div>
      </div>
    </>
  );
};

export default MainTangle;

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
