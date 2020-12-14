import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.scss";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";

// import IntersectionObserver from 'intersection-observer-polyfill/dist/IntersectionObserver';

// const OBSERVATION_WINDOW_IN_PIXELS = 64;
const TRIGGER_FROM_BOTTOM_PERCENTAGE = 20;

interface IntersectionTellerProps {
  setMarker: Function;
}

const IntersectionTeller: React.FC<IntersectionTellerProps> = (props) => {
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // This is called when a marker comes in or out of observation
  let processMarker = (entries) => {
    entries.forEach((entry) => {
      // Ignore all but at in and out at the bottom
      // if (
      //   Math.abs(entry.boundingClientRect.y - entry.rootBounds.bottom) >
      //   OBSERVATION_WINDOW_IN_PIXELS
      // )
      //   return;

      // Don't observer top intersections
      if (entry.boundingClientRect.top < -500) return;

      console.log(entry);

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

  // Initialise component
  useEffect(() => {
    component.observer = new IntersectionObserver(processMarker, {
      rootMargin: `1000px 0% -${TRIGGER_FROM_BOTTOM_PERCENTAGE}%`,
    });

    // component.observer.POLL_INTERVAL = 100;
    // component.observer.USE_MUTATION_OBSERVER = false;

    component.markerElements = document.querySelectorAll('*[id^="visualKEY"]');
    component.markers = [...component.markerElements].map((el) => {
      return alternatingCaseToObject(el.id).key;
    });

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
