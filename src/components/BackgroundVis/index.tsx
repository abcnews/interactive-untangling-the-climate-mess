import "./keyshape";
declare let KeyshapeJS;

import React, { useEffect, useRef, useLayoutEffect, useContext } from "react";
import styles from "./styles.scss";
import SVG from "react-inlinesvg";

import untangleAnimation from "./untangle-loop.svg";
import background from "./background.jpg";
import { AppContext } from "../../AppContext";

interface BackgroundVisProps {
  animationFrame: number;
  scrollMarker?: string;
}

const BackgroundVis: React.FC<BackgroundVisProps> = (props) => {
  // Use a component ref objet to store things properly
  // across renders.
  const componentRef = useRef({});
  const { current }: { current: any } = componentRef;

  const animate = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;

    import("./animations").then(({ animate }) => {
      // Set up the animations and return a timeline
      current.timeline = animate();

      console.log(current.timeline);

      // Load up the timeline markers so we can compare them later
      current.markers =
        current.timeline.l?.markers || current.timeline._options.markers;
      console.log(current.markers);

      current.ranges = { startLoop: ["1a", "2"] };
      current.timeline.range(...current.ranges.startLoop);
      current.timeline.loop(true);

      // Pause when done with certain range
      // current.timeline.onfinish = function () {
      //   this.pause();
      // };

      current.timeline.play();

      // setTimeout(() => {
      //   refs.timeline.range(...ranges.opening);
      //   refs.timeline.loop(0);
      //   refs.timeline.play();
      // }, 10000);
    });
  };

  useEffect(() => {
    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!current.timeline) return;

    current.timeline.pause(props.animationFrame);
  }, [props.animationFrame]);

  // Do something when scrollMarker changes
  useEffect(() => {
    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!props.scrollMarker || !current.timeline) return;

    console.log(props.scrollMarker);
    // console.log(current.markers[props.scrollMarker]);

    const { scrollMarker } = props;

    // const rangeStart =
    //   current.markers[scrollMarker] || current.markers[scrollMarker + "a"];
    // const rangeEnd = current.markers[scrollMarker + 1];

    const rangeStart =
      typeof current.markers[scrollMarker] === "undefined"
        ? scrollMarker + "a"
        : scrollMarker + "";

    const rangeEnd = scrollMarker + 1 + "";

    console.log(rangeStart, rangeEnd);

    if (
      typeof current.markers[rangeStart] === "undefined" ||
      typeof current.markers[rangeEnd] === "undefined"
    )
      return;

    current.timeline.range(rangeStart, rangeEnd);
    current.timeline.loop(0);
    current.timeline.play();

    // if (props.scrollMarker === "tangletopofscreen") {
    //   current.timeline.range(...current.ranges.opening);
    //   current.timeline.loop(0);
    //   current.timeline.play();
    // }
  }, [props.scrollMarker]);

  return (
    <>
      <div className={styles.backgroundImageContainer}>
        <img className={styles.backgroundImage} src={background} />
      </div>

      <div className={styles.root}>
        <SVG
          src={untangleAnimation}
          onLoad={() => {
            animate();
          }}
        />
      </div>
    </>
  );
};

export default BackgroundVis;
