import "./keyshape";
declare let KeyshapeJS;

import React, { useEffect, useRef, useLayoutEffect, useContext, useState } from "react";
import styles from "./styles.scss";
import SVG from "react-inlinesvg";

import untangleAnimation from "./assets/untangle-loop.svg";

import { AppContext } from "../../AppContext";

const d3 = {
  ...require("d3-selection"),
  ...require("d3-transition"),
  ...require("d3-ease"),
};

const PLAY_RATE = 1.333;

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
  animationFrame?: number;
  scrollMarker?: string;
  shouldObscure: boolean;
  yOffset?: number;
  setBackgroundIsRendered?: any;
}

const MainTangle: React.FC<MainTangleProps> = (props) => {
  const mainEl = useRef(null);
  const main = d3.select(mainEl.current);
  // Use app context
  const context: any = useContext(AppContext);
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
      console.log("scroll marker:", props.scrollMarker);
      const playloop = lookupRange(props.scrollMarker + ""); // Coerce to string
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

    // TODO: Detect if endTime spans multiple markers maybe
    // And speed up the animation or something...

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

  // useEffect(() => {
  //   main
  //     .transition()
  //     .duration(50)
  //     .ease(d3.easeLinear)
  //     .style("transform", `translate3d(0, -${props.yOffset}px, 0)`);
  // }, [props.yOffset]);

  return (
    <>
      <div className={styles.root}>
        <div
          className={`interactive-main-tangle ${styles.svgContainer} ${
            props.shouldObscure ? styles.obscured : styles.shown
          }`}
          // style={{
          //   transform: `translate3d(0, -${props.yOffset}px, 0)`,
          // transition: `transform 256ms`,
          // }}
          ref={mainEl}
        >
          <SVG
            className={styles.svg}
            src={untangleAnimation}
            preProcessor={(code) => {
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
