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
  const { current: refs }: { current: any } = componentRef;

  const animate = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;
    const ks = KeyshapeJS;

    import("./animations").then(({ animate }) => {
      refs.timeline = animate();

      refs.ranges = { startLoop: ["1", "2"], opening: ["2", "3"] };

      refs.timeline.range(...refs.ranges.startLoop);

      // refs.timeline.rate(0.05);

      refs.timeline.loop(true);

      // Pause when done with certain range
      refs.timeline.onfinish = function () {
        this.pause();
      };

      refs.timeline.play();

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
    if (!refs.timeline) return;

    refs.timeline.pause(props.animationFrame);
  }, [props.animationFrame]);

  useEffect(() => {
    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!props.scrollMarker || !refs.timeline) return;

    console.log(props.scrollMarker);

    if (props.scrollMarker === "tangletopofscreen") {
      refs.timeline.range(...refs.ranges.opening);
      refs.timeline.loop(0);
      refs.timeline.play();
    }
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
