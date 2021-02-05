import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from "react";
import styles from "./styles.scss";
import { getNextSibling } from "./helpers";
import useWindowSize from "./useWindowSize";
import { nextUntil } from "../../nextUntil";
import { gsap } from "gsap";

const d3 = { ...require("d3-scale") };

const SCRUB_DURATION = 1000; // In milliseconds

// We are making an animation frame version of onScroll
// Detect request animation frame
const rAf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window["mozRequestAnimationFrame"] ||
  window["msRequestAnimationFrame"] ||
  window["oRequestAnimationFrame"] ||
  // IE Fallback, you can even fallback to onscroll
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

let lastPosition = -1;
let monitorScroll = false;

// How much taller to make the paragraph panel
const HEIGHT_COMPENSATION = 600;
const FADE_IN_TEXT_THRESHOLD = 300;

const fromBottomScale = d3
  .scaleLinear()
  .domain([0, FADE_IN_TEXT_THRESHOLD])
  .range([0, 1.0]);

// Detect if at least one intersection is visible
const isOneVisible = (entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) return true;
  }
  return false;
};

interface ParagraphObserverProps {
  toggle: Function;
  setYOffset?: any;
}

const ParagraphObserver: React.FC<ParagraphObserverProps> = (props) => {
  const windowSize = useWindowSize();
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Set state
  const [visible, setVisible] = useState(false);

  // Init some component vars
  let observer = component.observer;
  let currentPanel = component.currentPanel;
  let currentElements = component.currentElements;
  let mainTangle = component.mainTangle;

  const processObservation = (entries) => {
    // Process (turbo boosted) onScroll events if any one paragraph panel is visible
    if (isOneVisible(entries)) {
      monitorScroll = true;
    } else {
      monitorScroll = false;
      // Fix fast scrolling up doesn't trigger onScroll
      positionTangle(mainTangle, 0);
    }

    entries.forEach((entry) => {
      setVisible(entry.isIntersecting);

      if (entry.isIntersecting) {
        currentPanel = entry.target;

        // Get elements between hash markers
        currentElements = nextUntil(currentPanel, "#endparagraphtext");
        onAnimationFrameScroll();
      }
    });
  };

  const positionTangle = (element, yPos: number) => {
    gsap.to(mainTangle, { y: yPos, ease: "power3", duration: SCRUB_DURATION / 1000 });
  };

  function onAnimationFrameScroll() {
    // Avoid calculations if not needed
    if (lastPosition == window.pageYOffset) {
      if (monitorScroll) rAf(onAnimationFrameScroll);
      return false;
    } else lastPosition = window.pageYOffset;

    // Process below per animation frame while scrolling
    const { top } = currentElements[0].getBoundingClientRect();
    const { bottom } = currentElements[
      currentElements.length - 1
    ].getBoundingClientRect();

    const topPixelsAboveFold = window.innerHeight - top;

    if (topPixelsAboveFold < 0 || bottom < 0) {
      positionTangle(mainTangle, 0);
    } else {
      positionTangle(mainTangle, -topPixelsAboveFold);
    }

    // Above threshold make fully visible
    if (topPixelsAboveFold > FADE_IN_TEXT_THRESHOLD) {
      // If not already fully visible...
      if (currentElements[0].style.opacity < 1.0) {
        currentElements.forEach((element) => {
          element.style.opacity = 1.0;
        });
      }
    } else {
      // Below the fold, make invisible
      if (topPixelsAboveFold < 0) {
        currentElements.forEach((element) => {
          element.style.opacity = 0;
        });
      } else {
        currentElements.forEach((element) => {
          // Set elements visible corresponding to scroll position
          element.style.opacity = fromBottomScale(topPixelsAboveFold);
        });
      }
    }

    // Recall the loop
    if (monitorScroll) rAf(onAnimationFrameScroll);
  }

  useEffect(() => {
    observer = new IntersectionObserver(processObservation, {
      rootMargin: `-10% 0%`,
    });

    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphtext"]'
    );

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      observer.observe(paragraphStartElement);

      mainTangle = document.querySelector(".interactive-main-tangle");
    });

    // Remove all observations on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    props.toggle(visible);
  }, [visible]);

  // On resize
  useLayoutEffect(() => {
    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphtext"]'
    );

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      const paragraphEndElement = getNextSibling(
        paragraphStartElement,
        "#endparagraphtext"
      );

      const top = paragraphStartElement.getBoundingClientRect().top;
      const bottom = paragraphEndElement.getBoundingClientRect().top;
      const height = bottom - top;

      paragraphStartElement.className = styles.paragraphStart;

      paragraphStartElement.style.height = `${height + HEIGHT_COMPENSATION}px`;
      paragraphStartElement.style.transform = `translateY(-${
        HEIGHT_COMPENSATION / 2 + 18
      }px)`;
    });

    return () => {
      // Translate back before we take more measurements
      // TODO: Make absolutely sure this doesn't need to happen on resize too
      // Seems to not matter on resize, but ....... not sure.
      paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
        paragraphStartElement.style.transform = `translateY(0px)`;
      });
    };
  }, [windowSize.width, windowSize.height]);

  return <div className={styles.root}></div>;
};

export default ParagraphObserver;
