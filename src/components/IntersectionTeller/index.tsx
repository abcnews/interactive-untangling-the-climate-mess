import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.scss";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";

const OBSERVATION_WINDOW_IN_PIXELS = 32;

interface IntersectionTellerProps {
  setMarker: Function;
}

const IntersectionTeller: React.FC<IntersectionTellerProps> = (props) => {
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Initialise component
  useEffect(() => {
    let callback = (entries) => {
      entries.forEach((entry) => {
        if (
          Math.abs(entry.boundingClientRect.y - entry.rootBounds.bottom) >
          OBSERVATION_WINDOW_IN_PIXELS
        )
          return;

        console.log(entry);

        // if (entry.isIntersecting) {
        //   const idString: string = entry.target.id;
        //   const markerObject = alternatingCaseToObject(idString);

        //   if (markerObject.key) props.setMarker(markerObject.key);
        // }
      });
    };

    component.observer = new IntersectionObserver(callback, {
      rootMargin: `0% 0% -${10}%`,
    });

    const markerElements = document.querySelectorAll('*[id^="visualKEY"]');

    markerElements.forEach((marker) => {
      component.observer.observe(marker);
    });

    return () => {
      component.observer.disconnect();
    };
  }, []);

  return <div className={styles.root}></div>;
};

export default IntersectionTeller;
