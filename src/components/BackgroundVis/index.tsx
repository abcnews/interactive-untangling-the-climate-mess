declare let KeyshapeJS;

import React, { useEffect, useRef, useLayoutEffect } from "react";
import styles from "./styles.scss";
import SVG from "react-inlinesvg";

import untangleAnimation from "./untangle-loop.svg";
import background from "./background.jpg";
import animations from "./animations";

interface BackgroundVisProps {
  animationFrame: number;
}

const BackgroundVis: React.FC<BackgroundVisProps> = (props) => {
  // Use a component ref objet to store things
  const componentRef = useRef({});
  const { current: refs }: { current: any } = componentRef;

  const animate = () => {
    (window as any).ks = (document as any).ks = KeyshapeJS;
    const ks = KeyshapeJS;

    refs.timeline = animations();

    refs.timeline.range(...["1", "2"]);

    // refs.timeline.rate(0.05);

    refs.timeline.loop(true);

    // Pause when done with certain range
    refs.timeline.onfinish = function () {
      this.pause();
    };

    refs.timeline.play();

    // setTimeout(() => {
    //   refs.timeline.range(...["2", "3"]);
    //   refs.timeline.play();
    // }, 10000)
  };

  useLayoutEffect(() => {
    // Note animationFrames sent before rendered
    // will not be reflected in graphic
    if (!refs.timeline) return;

    refs.timeline.pause(props.animationFrame);
  }, [props.animationFrame]);

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
