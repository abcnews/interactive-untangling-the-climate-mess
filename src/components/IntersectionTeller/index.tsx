import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.scss";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";

interface IntersectionTellerProps {
  setMarker: Function;
}

const IntersectionTeller: React.FC<IntersectionTellerProps> = (props) => {
  const componentRef = useRef({});
  const { current: refs }: { current: any } = componentRef;

  const [currentVis, setCurrentVis] = useState();

  useEffect(() => {
    console.log("IntersectionTeller mounted...");

    let callback = (entries, observer) => {
      entries.forEach((entry) => {
        // Each entry describes an intersection change for one observed
        // target element:
        //   entry.boundingClientRect
        //   entry.intersectionRatio
        //   entry.intersectionRect
        //   entry.isIntersecting
        //   entry.rootBounds
        //   entry.target
        //   entry.time

        if (entry.isIntersecting) {
          const idString: string = entry.target.id;
          const markerObject = alternatingCaseToObject(idString);

          if (markerObject.key) props.setMarker(markerObject.key);
        }
      });
    };

    refs.observer = new IntersectionObserver(callback, {});

    refs.observer.observe(
      document.querySelector("#visualKEYtangletopofscreen")
    );

    return () => {
      refs.observer.unobserve(
        document.querySelector("#visualKEYtangletopofscreen")
      );
    };
  }, []);

  return <div className={styles.root}></div>;
};

export default IntersectionTeller;
