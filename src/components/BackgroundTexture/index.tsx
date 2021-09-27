import React from "react";
import styles from "./styles.scss";

import background from "./assets/background.jpg";

interface BackgroundTextureProps {}

const BackgroundTexture: React.FC<BackgroundTextureProps> = () => {
  return (
    <div className={styles.backgroundImageContainer}>
      {/* <img className={styles.backgroundImage} src={background} /> */}
      {/* TODO: Detect devices that don't support fixed backgrounds and apply image above */}
    </div>
  );
};

export default BackgroundTexture;
