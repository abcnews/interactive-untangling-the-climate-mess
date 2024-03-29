import "./keyshape";
declare let KeyshapeJS;

import { subscribe } from "@abcnews/progress-utils";
import React, { useEffect, useRef, useContext, useState } from "react";
import styles from "./styles.scss";
import SVG from "react-inlinesvg";
import { gsap } from "gsap";
import useReducedMotion from "../../lib/useReducedMotion";

import untangleAnimation from "./assets/untangle-final-3.svg";

const PLAY_RATE = 1.0;
const FAST_SKIP_INCREASE = 1.0;

// Set to true to enable tangle movement when on mobile
// WE ARE NOT DOING THIS SO KEEP FALSE
const POS_ON_MOBILE = false;
const TOP_DOCK_POSITION = 0.01;
const BOTTOM_DOCK_POSITION = 0.9;
const HIDE_TOP = -0.05;
const MID_POINT = 0.05;

const lookupRange = (marker: string) => {
  if (marker === "1" || marker === "initial")
    return {
      start: "1a",
      end: "2",
      loopback: "1a"
    };

  if (marker === "20")
    return {
      start: "20",
      end: "21",
      loopback: null
    };

  // If any other marker just stay at the end
  if (isNaN(Number(marker)))
    return {
      start: "20",
      end: "21",
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
  scrollMarker?: string | number;
  yOffset?: number;
  setBackgroundIsRendered?: any;
  opacity: number;
  xPos?: number;
  yPos?: number; // Percent
  scale?: number; // Percent
  hidden?: boolean;
  maskPosition?: number;
  windowSize: any;
  animationDuration?: number;
}

const MainTangle: React.FC<MainTangleProps> = ({
  hidden = false,
  maskPosition = 0,
  windowSize,
  animationDuration = 1.5,
  ...props
}) => {
  const mainEl = useRef(null);

  // Component state
  const [markers, setMarkers] = useState({});
  const prevScrollMarker = usePrevious(props.scrollMarker);
  const [yPosState, setYPosState] = useState(BOTTOM_DOCK_POSITION);

  // Use a component ref objet to store things properly
  // across renders.
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  const prefersReducedMotion = useReducedMotion(false);

  // Init component vars
  let timeline = component.timeline;

  const initSvg = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;

    import("./assets/untangle-final-3").then(({ animate }) => {
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
    if (prefersReducedMotion || !playloop.loopback) {
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

  // Manage progress events for title playback (mobile only)
  useEffect(() => {
    if (
      window.innerWidth >= 1200 ||
      Object.keys(markers).length === 0 ||
      component.timeline == null
    ) {
      return;
    }

    const startTime = markers["2"];
    const loopbackTime = markers["2a"];
    let wasProgressWithinPlaybackRange = false;

    const unsubscribe = subscribe(
      "scroll-based-title-playback",
      message => {
        if (message.type !== "progress") {
          return;
        }

        const progress = message.data.threshold;
        const isProgressWithinPlaybackRange = progress >= -0.1 && progress < 1.1;

        if (wasProgressWithinPlaybackRange !== isProgressWithinPlaybackRange) {
          (window as any).ks[
            isProgressWithinPlaybackRange ? "globalPause" : "globalPlay"
          ]();

          wasProgressWithinPlaybackRange = isProgressWithinPlaybackRange;
        }

        if (isProgressWithinPlaybackRange) {
          component.timeline.time(
            startTime + (loopbackTime - startTime) * progress
          );
        }
      },
      {
        indicatorSelector: `[data-mount][id="visualKEY2"]`,
        regionThreshold: 0.8,
        shouldClampProgress: false
      }
    );

    return unsubscribe;
  }, [markers, component.timeline]);

  useEffect(() => {
    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!timeline) return;

    timeline.pause(props.animationFrame);
  }, [props.animationFrame]);

  // Do something when scrollMarker changes
  useEffect(() => {
    const onScrollMarkerChange = async () => {
      // Note animationFrames sent before rendered
      // will not be reflected in graphic
      if (!props.scrollMarker || !timeline) return;

      if (typeof prevScrollMarker === "undefined") {
        // If reloaded or hot reloaded
        loadDownPage();
      } else {
        // Speeds up animations if user is scrolling quickly
        component.pressure = component.pressure + FAST_SKIP_INCREASE;

        const { scrollMarker } = props;

        const currentTime = timeline.time();
        // const markerTime = markers[scrollMarker];

        // Coerce type as string here as it doesn't check for some reason
        const playloop = lookupRange(scrollMarker + "");

        const endTime = markers[playloop.end];

        if (POS_ON_MOBILE && window.innerWidth < 1200) {
          const tanglePosition = {
            intial: 0.01, // Initial ball
            2: 0.01, // Title
            3: 0.01, // After title ball
            4: 0.01,
            5: 0.01,
            6: 0.01,
            7: 0.01, // Cable
            8: 0.01, // Pool
            9: 0.01,
            10: 0, // Cow
            11: -0.001,
            12: -0.001,
            13: -0.001,
            14: -0.001,
            15: -0.01, // Car
            16: -0.01,
            17: -0.01,
            18: -0.015, // Smelt
            19: -0.015
          };

          const posY = tanglePosition[scrollMarker];

          if (typeof prevScrollMarker !== "undefined") {
            const prevPosY = tanglePosition[prevScrollMarker || 0];

            // Uncomment/comment if we want to async the gsap animation
            // to wait until it finishes, or not
            // if (posY !== prevPosY) {
            //   gsap.to(mainEl.current, {
            //     y: posY == 0 ? 0 : posY * window.innerHeight,
            //     ease: "power2.inOut",
            //     duration: 10
            //   });
            // }
          }
        }

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

            if (prefersReducedMotion || !playloop.loopback) {
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
            component.pressure > 1
              ? -PLAY_RATE * component.pressure
              : -PLAY_RATE
          );
          timeline.loop(false);
          timeline.range(playloop.loopback, currentTime);
          timeline.time(currentTime);
          timeline.play();
          timeline.onfinish = function () {
            component.pressure = 0;
            // Keep looping backwards to avoid loop weirdness
            timeline.rate(-PLAY_RATE);

            if (prefersReducedMotion || !playloop.loopback) {
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
    };
    onScrollMarkerChange();
  }, [props.scrollMarker]);

  useEffect(() => {
    if (
      typeof props.yPos === "undefined" ||
      typeof props.xPos === "undefined" ||
      typeof props.scale === "undefined"
    )
      return;

    setYPosState(props.yPos);
  }, [props.yPos]);

  useEffect(() => {
    if (
      typeof props.yPos === "undefined" ||
      typeof props.xPos === "undefined" ||
      typeof props.scale === "undefined"
    )
      return;

    gsap.to(mainEl.current, {
      y: yPosState * window.innerHeight,
      x: props.xPos * window.innerWidth,
      scale: props.scale * 0.01,
      ease: "power3.out",
      duration: animationDuration
    });
  }, [yPosState, props.scale, props.xPos, windowSize]);

  return (
    <div
      className={`${styles.root} ${hidden ? styles.hidden : styles.notHidden}`}
      style={{ opacity: props.opacity }}
      ref={mainEl}
    >
      <div className={`interactive-main-tangle ${styles.svgContainer}`}>
        <SVG
          className={styles.svg}
          src={untangleAnimation}
          // preProcessor={code => {
          //   return code;
          // }}
          onLoad={initSvg}
          uniqueHash={"maintangle"}
          uniquifyIDs={true}
        />
      </div>
    </div>
  );
};

export default MainTangle;

// Hooks
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
