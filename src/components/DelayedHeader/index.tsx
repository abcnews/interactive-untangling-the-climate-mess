import React from "react";
import styles from "./styles.scss";

interface DelayedHeaderProps {}

const DelayedHeader: React.FC<DelayedHeaderProps> = () => {
  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <p>
          <span>Climate change - we get it, it’s a depressing mess.</span>
        </p>
        <p>
          <span>
            We’ve spent the last thirty years not making the drastic changes
            needed to protect our way of life.
          </span>
        </p>
        <p>
          <span>We’ve even lost a few prime ministers over it.</span>
        </p>
      </div>

      <div className={styles.panel}>
        <p>
          <span>
            For three decades, we’ve been told that ditching our love affair
            with carbon will make us poorer, hotter, colder and more prone to
            sitting in candlelit rooms, and not the romantic kind.
          </span>
        </p>
        <p>
          <span>
            But what if it didn’t have to? What if, instead of an impending
            apocalypse, this were a good news story for Australia? A story of
            how we dodged a bullet, much like we’ve managed with coronavirus
            (touch wood) and the GFC?
          </span>
        </p>
      </div>

      <div className={styles.panel}>
        <p>
          <span>
            What if Australia could get to net zero and actually… improve our
            lives?
          </span>
        </p>
      </div>
    </div>
  );
};

export default DelayedHeader;