import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./styles.scss";
import { getNextSibling } from "./helpers";
import useWindowSize from "./useWindowSize";
import { nextUntil } from "../../nextUntil";

const d3 = { ...require("d3-scale") };

import { AppContext } from "../../AppContext";

// import { gsap, ScrollTrigger } from "gsap/all";
// gsap.registerPlugin(ScrollTrigger);

// How much taller to make the paragraph panel
const HEIGHT_COMPENSATION = 600;
const FADE_IN_TEXT_THRESHOLD = 300;

const fromBottomScale = d3.scaleLinear().domain([0, FADE_IN_TEXT_THRESHOLD]).range([0, 1.0]);

// Detect if at least one intersection is visible
const isOneVisible = (entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) return true;
  }
  return false;
};

interface ParagraphObserverProps {
  toggle: Function;
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
  // let mainTangle = component.mainTangle;

  const context: any = useContext(AppContext);

  const processObservation = (entries) => {
    // Process onScroll events if any one paragraph panel is visible
    if (isOneVisible(entries)) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      window.removeEventListener("scroll", onScroll);
      // Fix fast scrolling up doesn't trigger onScroll
      context.setTopAbove(0);
    }

    entries.forEach((entry) => {
      setVisible(entry.isIntersecting);

      if (entry.isIntersecting) {
        currentPanel = entry.target;

        // Get elements between hash markers
        currentElements = nextUntil(currentPanel, "#endparagraphtext");
      }
    });
  };

  // We need a scroll handler now to process paragraph fading
  const onScroll = () => {
    // Get's
    const { top } = currentElements[0].getBoundingClientRect();
    const { bottom } = currentElements[currentElements.length - 1].getBoundingClientRect();

    const topPixelsAboveFold = window.innerHeight - 100 - top;

    if (bottom < 0) {
      context.setTopAbove(0);
    } else {
      context.setTopAbove(topPixelsAboveFold);
    }

    if (topPixelsAboveFold > FADE_IN_TEXT_THRESHOLD) {
      // Already fully visible, never mind...
      if (currentElements[0].style.opacity >= 1.0) return;

      // Otherwise set visible and return
      currentElements.forEach((element) => {
        element.style.opacity = 1.0;
      });
      return;
    }

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
  };

  useEffect(() => {
    observer = new IntersectionObserver(processObservation, {
      rootMargin: `-10% 0%`,
    });

    const paragraphStartMarkers: any = document.querySelectorAll('*[id^="paragraphtext"]');

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      observer.observe(paragraphStartElement);

      const paragraphEndElement = getNextSibling(paragraphStartElement, "#endparagraphtext");

      const top = paragraphStartElement.getBoundingClientRect().top;
      const bottom = paragraphEndElement.getBoundingClientRect().top;
      const height = bottom - top;

      paragraphStartElement.className = styles.paragraphStart;

      paragraphStartElement.style.height = `${height + HEIGHT_COMPENSATION}px`;
      paragraphStartElement.style.transform = `translateY(-${HEIGHT_COMPENSATION / 2 + 18}px)`;
    });

    // setTimeout(() => {
      // mainTangle = document.querySelector(".interactive-main-tangle");



    //   gsap.to(".interactive-main-tangle", {
    //     y: -window.innerHeight,
    //     // ease: "none",
    //     scrollTrigger: { trigger: "#paragraphtext", scrub: 0.4, markers: true },
    //   });
    // }, 500)

    

    // Remove all observations on unmount
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    props.toggle(visible);
  }, [visible]);

  useEffect(() => {
    const paragraphStartMarkers: any = document.querySelectorAll('*[id^="paragraphtext"]');

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      const paragraphEndElement = getNextSibling(paragraphStartElement, "#endparagraphtext");

      const top = paragraphStartElement.getBoundingClientRect().top;
      const bottom = paragraphEndElement.getBoundingClientRect().top;
      const height = bottom - top;

      paragraphStartElement.className = styles.paragraphStart;

      paragraphStartElement.style.height = `${height + HEIGHT_COMPENSATION}px`;
      paragraphStartElement.style.transform = `translateY(-${HEIGHT_COMPENSATION / 2 + 18}px)`;
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
