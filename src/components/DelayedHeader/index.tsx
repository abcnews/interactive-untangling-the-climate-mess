import React from "react";
import styles from "./styles.scss";
import OrganicPanel from "../OrganicPanel";

interface DelayedHeaderProps {}

const DelayedHeader: React.FC<DelayedHeaderProps> = () => {
  return (
    <div className={styles.root}>
      <div
        id="visualKEYinitial"
        data-component="Anchor"
        data-mount="true"
      ></div>

      <div className={`${styles.heroText}`}>
        Climate change... <br />
        we get it, it’s a depressing mess.
      </div>

      <div className={styles.panel}>
        <OrganicPanel>
          <p>
            We’ve spent the last thirty years not making the drastic changes
            needed to protect our way of life.
          </p>

          <p>We’ve even lost a few prime ministers over it.</p>
        </OrganicPanel>
      </div>

      <div className={styles.panel}>
        <OrganicPanel backgroundVariation={1}>
          <p>
            For three decades, we’ve been told that ditching our love affair
            with carbon will make us poorer, hotter, colder and more prone to
            sitting in candlelit rooms, and not the romantic kind.
          </p>
          <p>
            But what if it didn’t have to? What if, instead of an impending
            apocalypse, this were a good news story for Australia? A story of
            how we dodged a bullet, much like we’ve managed with coronavirus
            (touch wood) and the GFC?
          </p>
        </OrganicPanel>
      </div>

      <div className={styles.panel}>
        <p>
          <span>
            What if Australia could get to net zero and actually… improve our
            lives?
          </span>
        </p>
        <div id="visualKEY2" data-component="Anchor" data-mount="true"></div>
      </div>
    </div>
  );
};

export default DelayedHeader;
