import React, { useEffect, useRef } from "react";
import styles from "./styles.scss";
import { getNextSibling } from "./helpers";

interface ParagraphObserverProps {}

const ParagraphObserver: React.FC<ParagraphObserverProps> = () => {
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Init some component vars
  let observer = component.observer;

  const processObservation = (entries) => {
    console.log(entries);
  };

  useEffect(() => {
    observer = new IntersectionObserver(processObservation, {
      // Pull root top above the viewport
      // rootMargin: `${ROOT_PULL}px 0% -${100 - props.waypoint!}%`,
    });

    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphtext"]'
    );

    console.log(paragraphStartMarkers);

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      // paragraphStart.dataset.index = index;

      observer.observe(paragraphStartElement);
      const paragraphEndElement = getNextSibling(
        paragraphStartElement,
        "#endparagraphtext"
      );


      const top = paragraphStartElement.getBoundingClientRect().top;
      const bottom = paragraphEndElement.getBoundingClientRect().top;
      const height = bottom - top;

      console.log(top, bottom, `Height: ${height}`);

      paragraphStartElement.className = styles.paragraphStart;

      // paragraphStartElement.style.position = "absolute";
      paragraphStartElement.style.height = `${height}px`;
    });

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
