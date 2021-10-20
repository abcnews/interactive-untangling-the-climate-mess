import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.scss";
import OrganicPanel from "../OrganicPanel";
import { nextUntil } from "../../nextUntil";
import convert from "react-from-dom";
import { InView } from "react-intersection-observer";
import { useInView } from "react-intersection-observer";
import { useDynamicText } from "../../lib/fetchDynamicText";
import DynText from "../DynText";

interface DelayedHeaderProps {
  setTransformsComplete: (complete: boolean) => void;
  openingCentered: boolean;
  isDesktop: boolean;
  setIsPastOpening: (isPastOpening: boolean) => void;
}

const DelayedHeader: React.FC<DelayedHeaderProps> = ({
  setTransformsComplete,
  openingCentered,
  isDesktop,
  setIsPastOpening,
  ...props
}) => {
  const [contentArray, setContentArray] = useState<any>([]);

  const { ref: lastPanelRef, inView, entry } = useInView({});

  const {
    dynamicText,
    dynamicTextLoading,
    dynamicTextError
  } = useDynamicText();

  useEffect(() => {
    // Uses intersection observer to check if scrolled past a certain point
    if (typeof entry === "undefined") return;
    const marker: any = entry.target;
    const bounds = marker.getBoundingClientRect();
    if (bounds.bottom > 0) setIsPastOpening(false);
    else setIsPastOpening(true);
  }, [entry]);

  useEffect(() => {
    const onMount = async () => {
      const markers = document.querySelectorAll(".preheader-container");
      const markersArray = Array.from(markers);

      setContentArray(markersArray);

      // Observe intersections
    };
    onMount();

    return () => {
      contentArray.forEach(el => {
        document.body.appendChild(el);
      });
    };
  }, []);

  useEffect(() => {
    if (contentArray.length > 0) {
      // contentArray.forEach(el => {
      //   el.parentNode.removeChild(el);
      // });
      setTransformsComplete(true);
    }
  }, [contentArray]);

  // TODO: MAP THE PANELS IF WE NEED MORE
  // But probably just keep it manual for now

  return (
    <div className={styles.root}>
      <div
        id="visualKEYinitial"
        data-component="Anchor"
        data-mount="true"
      ></div>

      <div className={styles.heroContainer}>
        <div
          className={`${styles.heroText} ${
            !openingCentered && isDesktop && styles.pullLeft
          }`}
        >
          {/* Climate change... <br />
        we get it, it’s a depressing mess. */}
          <DynText>{dynamicText["hero-heading"]}</DynText>
        </div>
      </div>

      <div
        className={`${styles.panel} ${
          !openingCentered && isDesktop && styles.pullLeft
        }`}
      >
        {/* <div
          id="visualKEYinitialPOSITION10MINUSfalse"
          data-component="Anchor"
          data-mount="true"
        ></div> 
        
        NOW CONTROLLED ON SCROLL */}
        <OrganicPanel isCentered={true} pullLeftOnDesktop={false}>
          {convert(contentArray[0])}

          {/* <p>
            We’ve spent the last thirty years not making the drastic changes
            needed to protect our way of life.
          </p>

          <p>We’ve even lost a few prime ministers over it.</p> */}
        </OrganicPanel>
      </div>

      <div
        className={`${styles.panel} ${
          !openingCentered && isDesktop && styles.pullLeft
        }`}
      >
        <OrganicPanel
          backgroundVariation={1}
          isCentered={true}
          pullLeftOnDesktop={false}
        >
          {convert(contentArray[1])}
          {/* <p>
            For three decades, we’ve been told that ditching our love affair
            with carbon will make us poorer, hotter, colder and more prone to
            sitting in candlelit rooms, and not the romantic kind.
          </p>
          <p>
            But what if it didn’t have to? What if, instead of an impending
            apocalypse, this were a good news story for Australia? A story of
            how we dodged a bullet, much like we’ve managed with coronavirus
            (touch wood) and the GFC?
          </p> */}
        </OrganicPanel>
      </div>

      <div className={styles.panel}>
        <OrganicPanel
          backgroundVariation={2}
          isCentered={true}
          pullLeftOnDesktop={false}
        >
          <div ref={lastPanelRef}>
            {convert(contentArray[2])}
            {/* <p>
            What if Australia could get to net zero and actually… improve our
            lives?
          </p> */}
          </div>
        </OrganicPanel>
      </div>
      <div id="visualKEY2" data-component="Anchor" data-mount="true"></div>
    </div>
  );
};

export default DelayedHeader;
