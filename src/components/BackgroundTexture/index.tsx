import React from "react";
import styles from "./styles.scss";

import background from "./assets/background.jpg";

interface BackgroundTextureProps {}

const BackgroundTexture: React.FC<BackgroundTextureProps> = () => {
  return (
    <div className={styles.backgroundImageContainer}>
      <img className={styles.backgroundImage} src={background} />
    </div>
  );
};

export default BackgroundTexture;
