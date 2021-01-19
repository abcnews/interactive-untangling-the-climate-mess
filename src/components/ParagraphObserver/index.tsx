import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.scss";
import { getNextSibling } from "./helpers";

interface ParagraphObserverProps {
  toggle: Function;
}

const ParagraphObserver: React.FC<ParagraphObserverProps> = (props) => {
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Set state
  const [visible, setVisible] = useState(false);

  // Init some component vars
  let observer = component.observer;

  const processObservation = (entries) => {
    entries.forEach((entry) => {
      setVisible(entry.isIntersecting);
    });
  };

  useEffect(() => {
    observer = new IntersectionObserver(processObservation, {
      rootMargin: `-10% 0%`,
    });

    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphtext"]'
    );


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

  useEffect(() => {
    // if (visible) {
      // const portalMount: any = document.getElementById("portalmount");
      // portalMount.style.visibility = "hidden";
      
    // } else {
      // const portalMount: any = document.getElementById("portalmount");
      // portalMount.style.visibility = "visible";
    // }

    props.toggle(visible)
  }, [visible]);

  return <div className={styles.root}></div>;
};

export default ParagraphObserver;
