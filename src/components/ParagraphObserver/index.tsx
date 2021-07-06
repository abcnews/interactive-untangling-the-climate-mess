import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext
} from "react";
import styles from "./styles.scss";
import { getNextSibling } from "./helpers";
import useWindowSize from "./useWindowSize";
import { nextUntil } from "../../nextUntil";
import { gsap } from "gsap";
import debounce from "debounce-promise";

const d3 = { ...require("d3-scale") };

const SCRUB_DURATION = 250; // In milliseconds

// We are making an animation frame version of onScroll
// Detect request animation frame
let rAf: any;

let lastPosition = -1;
let monitorScroll = false;
let observationElementCount = 0;
let isFirstObservation = true;
let mainOnTop = true;
let immediatePosition = false;

// How much taller to make the paragraph panel
const HEIGHT_COMPENSATION = 600;
const FADE_IN_TEXT_THRESHOLD = 300;

// Used for text tranparency
// Not really used any more
const fromBottomScale = d3
  .scaleLinear()
  .domain([0, FADE_IN_TEXT_THRESHOLD])
  .range([0.01, 1.0]);

// Detect if at least one intersection is visible
// NOTE: There were issues with this...
const isOneVisible = entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) return true;
  }
  return false;
};

interface ParagraphObserverProps {
  setYOffset?: any;
}

const ParagraphObserver: React.FC<ParagraphObserverProps> = props => {
  const windowSize = useWindowSize();
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Init some component vars
  let observer = component.observer;
  let currentPanel = component.currentPanel;
  let currentElements = component.currentElements;
  let mainTangle = component.mainTangle;

  const processObservation = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observationElementCount++;
        currentPanel = entry.target;

        // Get elements between hash markers
        currentElements = nextUntil(currentPanel, "#endparagraphtext");
      } else {
        if (!isFirstObservation) {
          observationElementCount--;

          setTimeout(() => {
            positionTangle(mainTangle, 0);
          }, 250); // Slight delay otherwise doesn't work
        }
      }
    });

    if (observationElementCount > 0) {
      monitorScroll = true;
    } else {
      monitorScroll = false;
    }

    setTimeout(() => {
      // TODO: WORK OUT WHY I THOUGHT I NEEDED THIS??
      // AHH It's to stop overpositioning when fast scrolling
      // Try to fix this another way. Otherwise this will pop animation back
      // and cause jerkiness!
      //

      // Hacky workaround to get proper at least 1 visible
      if (isFirstObservation) {
        isFirstObservation = false;
      }
    }, 200); // Wait a bit otherwise animationFrame jumps the gun

    onScroll();
  };

  const positionTangle = (element, yPos: number) => {
    gsap.to(element, {
      y: yPos,
      ease: "power3",
      duration: SCRUB_DURATION / 1000
    });
  };

  const positionTangleImmediate = (element, yPos: number) => {
    gsap.to(element, {
      y: yPos,
      ease: "power3",
      duration: 0
      // onComplete: () => {
      //   immediatePosition = false;
      // }
    });
  };

  const positionTangleImmediateFromTo = (
    element,
    fromPos: number,
    yPos: number
  ) => {
    gsap.fromTo(
      element,
      { y: fromPos },
      { y: yPos, ease: "power3", duration: 0 }
    );
  };

  function later(value) {
    return new Promise(function (resolve) {
      mainTangle.style.visibility = "visible";

      resolve(value);
    });
  }

  // Debouce our unhide Promise -> time in ms
  const unHideMainTangle = debounce(later, 250);

  let onScroll: any = () => {
    if (!currentPanel) return;
    // Avoid calculations if not needed
    if (lastPosition == window.pageYOffset) {
      if (monitorScroll && rAf) rAf(onScroll);
      return false;
    } else lastPosition = window.pageYOffset;

    const { top, bottom } = currentPanel.getBoundingClientRect();

    const topPixelsAboveFold = window.innerHeight - top;
    const bottomPixelsAboveFold = window.innerHeight - bottom;

    if (top > 0) {
      // We are pushing top up

      if (!mainOnTop) {
        mainTangle.style.visibility = "hidden";
        immediatePosition = true;
        mainOnTop = true;
      }

      if (top > 300) {
        mainTangle.style.visibility = "visible";
      }

      positionTangle(mainTangle, -topPixelsAboveFold);
    } else {
      // We are pulling from underneath

      if (mainOnTop) {
        mainTangle.style.visibility = "hidden";

        mainOnTop = false;
      }

      if (top < -300) {
        mainTangle.style.visibility = "visible";
      }

      positionTangle(mainTangle, window.innerHeight - bottomPixelsAboveFold);
    }

    // Recall the loop
    if (monitorScroll && rAf) rAf(onScroll);
  };

  useEffect(() => {
    // Request animation frame fallback function
    rAf =
      window.requestAnimationFrame ||
      window["webkitRequestAnimationFrame"] ||
      window["mozRequestAnimationFrame"] ||
      window["msRequestAnimationFrame"] ||
      window["oRequestAnimationFrame"] ||
      // IE Fallback, you can even fallback to onscroll
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

    observer = new IntersectionObserver(processObservation, {
      rootMargin: `0% 0%`
    });

    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphtext"]'
    );

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      observer.observe(paragraphStartElement);

      mainTangle = document.querySelector(".interactive-main-tangle");
    });

    // Remove all observations on unmount and other cleanup
    return () => {
      observer.disconnect();
      rAf = undefined;
      // document.removeEventListener("scroll", onScroll);
    };
  }, []);

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
      // Move it down a bit to equalise top and bottom
      paragraphStartElement.style.transform = `translateY(-${
        HEIGHT_COMPENSATION / 3 + 18
      }px)`;

      // (OR DON'T IF WE WANT JUST THE BOTTOM EXTENDED)
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
