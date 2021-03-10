/** @format */

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

const d3 = { ...require("d3-scale") };

const SCRUB_DURATION = 1000; // In milliseconds

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
    // console.log("OBSERVATION!!!", entries);

    // Process (turbo boosted) on animation frame events
    // if (isOneVisible(entries)) {
    //   monitorScroll = true;
    // } else {
    //   monitorScroll = false;
    //   // Fix fast scrolling up doesn't trigger onScroll
    //   console.log("Not monitoring???")
    //   positionTangle(mainTangle, 0);
    // }

    
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observationElementCount++;
        currentPanel = entry.target;

        // Get elements between hash markers
        currentElements = nextUntil(currentPanel, "#endparagraphtext");
      } else {
        if (!isFirstObservation) {
          observationElementCount--;
        }
      }
    });

    console.log("Observation count:", observationElementCount);

    if (observationElementCount > 0) {
      monitorScroll = true;
      document.addEventListener("scroll", onScroll)
    } else {
      monitorScroll = false;
      document.removeEventListener("scroll", onScroll)
    }

    setTimeout(() => {

      // TODO: WORK OUT WHY I THOUGHT I NEEDED THIS??
      // AHH It's to stop overpositioning when fast scrolling
      // Try to fix this another way. Otherwise this will pop animation back 
      // and cause jerkiness!
      // if (!isFirstObservation) positionTangle(mainTangle, 0);

      // Hacky workaround to get proper at least 1 visible
      if (isFirstObservation) {
        isFirstObservation = false;
      }
    }, 200); // Wait a bit otherwise animationFrame jumps the gun

    // onAnimationFrameScroll();
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
      duration: 0,
      immediateRender: true
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
      { y: yPos, ease: "power3", duration: 0, immediateRender: true }
    );
  };

  let onScroll: any = () => {
    if (!currentPanel) return;
    // Avoid calculations if not needed
    // if (lastPosition == window.pageYOffset) {
      // if (monitorScroll && rAf) rAf(onScroll);
    //   return false;
    // } else lastPosition = window.pageYOffset;

    // Process below per animation frame while scrolling

    // We can either use paragraph text or the panel
    // const { top } = currentElements[0].getBoundingClientRect();
    // const { bottom } = currentElements[
    //   currentElements.length - 1
    // ].getBoundingClientRect();

    const { top, bottom } = currentPanel.getBoundingClientRect();




    const topPixelsAboveFold = window.innerHeight - top;
    const bottomPixelsAboveFold = window.innerHeight - bottom;

    // console.log("Top:", top);
    // console.log("Bottom:", bottom);
    // console.log("Top above Fold:", topPixelsAboveFold);
    // console.log("Bottom above Fold:", bottomPixelsAboveFold);

    // TODO: This will require tweaking so that the animation
    // appears seamless. Use positionTangleImmediate() to get the animation down the bottom.

    // if (top < 300 && top > -300) {
    //   flipImmediate = true;
    // } else {
    //   flipImmediate = false;
    // }

    // const { top: mainTop } = mainTangle.getBoundingClientRect();
    // console.log(mainTop);

    // console.log(top)

    if (top > 0) {
      // We are pushing top up

      if (!mainOnTop) {
        console.log("Flip to top");
        mainTangle.style.visibility = "hidden";
        immediatePosition = true;

        mainOnTop = true;
      }

      if (top > 300) {
        mainTangle.style.visibility = "visible";
        immediatePosition = false;
      }

      immediatePosition 
        ? positionTangleImmediate(mainTangle, -topPixelsAboveFold)
        : positionTangle(mainTangle, -topPixelsAboveFold);
    } else {
      // We are pulling from underneath

      if (mainOnTop) {
        console.log("Flip to bottom");
        // mainTangle.style.visibility = "hidden";
        immediatePosition = true;

        mainOnTop = false;
      }

      if (top < -300) {
        // mainTangle.style.visibility = "visible";
        immediatePosition = false;
      }

      immediatePosition
        ? positionTangleImmediate(
            mainTangle,
            window.innerHeight - bottomPixelsAboveFold
          )
        : positionTangle(
            mainTangle,
            window.innerHeight - bottomPixelsAboveFold
          );
    }

    // if (topPixelsAboveFold > window.innerHeight - 200) {
    //   positionTangleImmediate(mainTangle, window.innerHeight - bottomPixelsAboveFold + 400);
    // } else {
    //   if (topPixelsAboveFold < 0 || bottom < 0) {
    //     positionTangleImmediate(mainTangle, 0);
    //   } else {
    //     positionTangleImmediate(
    //       mainTangle,
    //       // Don't go too far up if you don't have to
    //       topPixelsAboveFold > window.innerHeight
    //         ? -window.innerHeight
    //         : -topPixelsAboveFold
    //     );
    //   }
    // }

    //

    // FADE IN TEXT AS WE SCROLL
    // (REMOVED FOR NOW)
    // Above threshold make fully visible
    // if (topPixelsAboveFold > FADE_IN_TEXT_THRESHOLD) {
    //   // If not already fully visible...
    //   if (currentElements[0].style.opacity < 1.0) {
    //     currentElements.forEach((element) => {
    //       element.style.opacity = 1.0;
    //     });
    //   }
    // } else {
    //   // Below the fold, make invisible
    //   if (topPixelsAboveFold < 0) {
    //     currentElements.forEach((element) => {
    //       element.style.opacity = 0;
    //     });
    //   } else {
    //     currentElements.forEach((element) => {
    //       // Set elements visible corresponding to scroll position
    //       element.style.opacity = fromBottomScale(topPixelsAboveFold);
    //     });
    //   }
    // }

    // Recall the loop
    // if (monitorScroll && rAf) rAf(onScroll);
  };

  useEffect(() => {
    // Request animation frame fallback function
    rAf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
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
      document.removeEventListener("scroll", onScroll)
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
