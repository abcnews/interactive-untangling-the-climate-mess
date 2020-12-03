import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.scss";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";

const OBSERVATION_WINDOW_IN_PIXELS = 64;
const TRIGGER_FROM_BOTTOM_PERCENTAGE = 10;

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

        const idString: string = entry.target.id;
        const markerObject = alternatingCaseToObject(idString);

        if (entry.isIntersecting) {
          props.setMarker(markerObject.key);
        } else {
          const currentIndex = component.markers.indexOf(markerObject.key);
          const previousIndex = currentIndex === 0 ? 0 : currentIndex - 1;
          const previousMarker = component.markers[previousIndex];

          props.setMarker(previousMarker);
        }
      });
    };

    component.observer = new IntersectionObserver(callback, {
      rootMargin: `0% 0% -${TRIGGER_FROM_BOTTOM_PERCENTAGE}%`,
    });

    component.markerElements = document.querySelectorAll('*[id^="visualKEY"]');
    component.markers = [...component.markerElements].map((el) => {
      return alternatingCaseToObject(el.id).key;
    });

    console.log(component.markers);

    component.markerElements.forEach((markerEl) => {
      component.observer.observe(markerEl);
    });

    return () => {
      component.observer.disconnect();
    };
  }, []);

  return <div className={styles.root}></div>;
};

export default IntersectionTeller;
