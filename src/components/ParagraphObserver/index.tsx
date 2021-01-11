import React, { useEffect, useRef } from "react";
import styles from "./styles.scss";

interface ParagraphObserverProps {}

const ParagraphObserver: React.FC<ParagraphObserverProps> = () => {
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Init some component vars
  let observer = component.observer;

  const processObservation = () => {};

  useEffect(() => {
    observer = new IntersectionObserver(processObservation, {
      // Pull root top above the viewport
      // rootMargin: `${ROOT_PULL}px 0% -${100 - props.waypoint!}%`,
    });

    const paragraphStartMarkers = document.querySelectorAll(
      '*[id^="paragraphtext"]'
    );

    console.log(paragraphStartMarkers);

    // markerEls.forEach((markerEl, index: number) => {
    //   markerEl.dataset.index = index;
    //   observer.observe(markerEl);
    // });

    // // Keep track of markers we've initialised
    // // so they don't fire on load
    // initCount = 0;

    // Remove all observations on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return <div className={styles.root}></div>;
};

export default ParagraphObserver;
