import React from "react";
import styles from "./styles.scss";
import SVG from "react-inlinesvg";

import untangleAnimation from "./untangle-animation.svg";
import background from "./background.jpg";

interface BackgroundVisProps {}

const BackgroundVis: React.FC<BackgroundVisProps> = () => {
  return (
    <>
      <div className={styles.backgroundImageContainer}>
        <img className={styles.backgroundImage} src={background} />
      </div>

      <div className={styles.root}>
        <SVG src={untangleAnimation} onLoad={() => {}} />
      </div>
    </>
  );
};

export default BackgroundVis;
