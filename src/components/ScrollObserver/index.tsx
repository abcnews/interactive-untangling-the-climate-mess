import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.scss";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";

const ROOT_PULL = 1000; // Pixels to pull observer root above screen
const DEADZONE_ADJUST = 500; // How fast can a user scroll?

// Define all the props for the component
interface ScrollObserverProps {
  setMainTangleYPos: Function;
  setMainTangleXPos: Function;
  setMarker: Function;
  waypoint?: number;
}

const ScrollObserver: React.FC<ScrollObserverProps> = ({
  setMainTangleYPos,
  setMainTangleXPos,
  ...props
}) => {
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Init some component vars
  let initCount = component.initCount;
  let markerEls = component.markerElements;
  let observer = component.observer;
  let closestEntry = component.closestEntry;

  // This is called when a marker comes in or out of observation
  let processMarker = entries => {
    // Note: will usually only happen once (even though this is a forEach)
    entries.forEach(entry => {
      // Ignore once per marker due to Intersection Observer firing on page load
      if (initCount < markerEls.length) {
        // Set closest marker on load
        if (typeof closestEntry === "undefined") {
          closestEntry = entry;
        } else {
          // See if this marker is closer to the trigger point
          const triggerPoint = window.innerHeight * (props.waypoint! / 100);

          const comparisonDistance = Math.abs(
            triggerPoint - closestEntry.boundingClientRect.y
          );
          const newDistance = Math.abs(
            triggerPoint - entry.boundingClientRect.y
          );

          // If so set new entry and index
          if (newDistance < comparisonDistance) {
            closestEntry = entry;
          }
        }

        initCount++;

        // At the end set our initial marker
        if (initCount === markerEls.length) {
          const idString: string = closestEntry.target.id;
          const markerObject = alternatingCaseToObject(idString);
          props.setMarker(markerObject.key);
        }

        return;
      }

      // Don't observe top of root intersections
      if (entry.boundingClientRect.top < -DEADZONE_ADJUST) return;

      const idString: string = entry.target.id;
      const markerObject = alternatingCaseToObject(idString);

      let positionY;
      let isMinus = false;

      // Moving forward, otherwise moving back
      if (entry.isIntersecting) {
        props.setMarker(markerObject.key);
        positionY = markerObject.position;
        if (markerObject.minus) isMinus = true;
      } else {
        const currentIndex = +entry.target.dataset.index;
        const previousIndex = currentIndex === 0 ? 0 : currentIndex - 1;
        const previousMarkerEl = markerEls[previousIndex];
        const previousIdString: string = previousMarkerEl.id;
        const previousMarkerObject = alternatingCaseToObject(previousIdString);
        positionY = previousMarkerObject.position;
        if (previousMarkerObject.minus) isMinus = true;
        props.setMarker(previousMarkerObject.key);
      }

      // If position is set in Core, set it here
      if (positionY) {
        if (isMinus) setMainTangleYPos(-positionY / 100);
        else setMainTangleYPos(positionY / 100);
      }
    });
  };

  // Initialise component
  useEffect(() => {
    observer = new IntersectionObserver(processMarker, {
      // Pull root top above the viewport
      rootMargin: `${ROOT_PULL}px 0% -${100 - props.waypoint!}%`
    });

    markerEls = document.querySelectorAll('*[id^="visualKEY"]');

    markerEls.forEach((markerEl, index: number) => {
      markerEl.dataset.index = index;
      observer.observe(markerEl);
    });

    // Keep track of markers we've initialised
    // so they don't fire on load
    initCount = 0;

    // Remove all observations on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return <div className={styles.root}></div>;
};

export default ScrollObserver;

ScrollObserver.defaultProps = {
  waypoint: 100
};
