import "./keyshape";
declare let KeyshapeJS;

import React, { useEffect, useRef, useLayoutEffect, useContext, useState } from "react";
import styles from "./styles.scss";
import SVG from "react-inlinesvg";

import untangleAnimation from "./assets/untangle-loop.svg";

const PLAY_RATE = 1.333;

const lookupRange = (marker: string) => {
  if (marker === "1" || marker === "initial")
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

  // If any other marker just stay at the end
  if (isNaN(Number(marker)))
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
  animationFrame?: number;
  scrollMarker?: string;
  yOffset?: number;
  setBackgroundIsRendered?: any;
  opacity: number;
}

const MainTangle: React.FC<MainTangleProps> = (props) => {
  const mainEl = useRef(null);
  // Component state
  const [markers, setMarkers] = useState({});

  // Use a component ref objet to store things properly
  // across renders.
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Init component vars
  let timeline = component.timeline;

  const initSvg = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;

    import("./assets/animations").then(({ animate }) => {
      // Set up the animations and return a timeline
      component.timeline = animate();
      const timeline = component.timeline;

      // Load up the timeline markers so we can compare them later
      setMarkers(timeline.l?.markers || timeline._options.markers);

      // Try to start animation down page on reload
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
    });
  };

  // Init effect
  useEffect(() => {
    // Set initial marker pressure
    component.pressure = 0;

    // Tell App that we've been rendered
    props.setBackgroundIsRendered(true);

    // gsap.to("progress", {
    //   value: 100,
    //   // ease: "none",
    //   scrollTrigger: { trigger: "#paragraphtext", scrub: 0.8 },
    // });
  }, []);

  useEffect(() => {
    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!timeline) return;

    timeline.pause(props.animationFrame);
  }, [props.animationFrame]);

  // Do something when scrollMarker changes
  useEffect(() => {
    // console.log("Received scroll marker:", props.scrollMarker);
    component.pressure = component.pressure + 1;

    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!props.scrollMarker || !timeline) return;

    const { scrollMarker }: { scrollMarker?: string } = props;

    const currentTime = timeline.time();
    // const markerTime = markers[scrollMarker];

    // Coerce type as string here as it doesn't check for some reason
    const playloop = lookupRange(scrollMarker + "");

    const endTime = markers[playloop.end];

    // If going forward
    if (currentTime < endTime) {
      timeline.rate(PLAY_RATE * component.pressure);
      timeline.loop(false);
      timeline.range(currentTime, endTime);
      timeline.time(currentTime);
      timeline.play();
      timeline.onfinish = function () {
        // We made it. Take the pressure off
        component.pressure = 0;
        timeline.rate(PLAY_RATE);

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
      timeline.rate(-PLAY_RATE * component.pressure);
      timeline.loop(false);
      timeline.range(playloop.loopback, currentTime);
      timeline.time(currentTime);
      timeline.play();
      timeline.onfinish = function () {
        component.pressure = 0;
        timeline.rate(PLAY_RATE);

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

  return (
    <>
      <div className={styles.root} style={{ opacity: props.opacity }}>
        <div className={`interactive-main-tangle ${styles.svgContainer}`} ref={mainEl}>
          <SVG
            className={styles.svg}
            src={untangleAnimation}
            preProcessor={(code) => {
              return code;
            }}
            onLoad={initSvg}
            uniqueHash={"maintangle"}
            uniquifyIDs={true}
          />
        </div>
      </div>
    </>
  );
};

export default MainTangle;
