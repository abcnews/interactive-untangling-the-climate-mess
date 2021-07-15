import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.scss";
import { getNextSibling } from "./helpers";
import useWindowSize from "./useWindowSize";
import { nextUntil } from "../../nextUntil";

const d3 = { ...require("d3-scale") };

// This corresponds to the css $fade-height var
const HEIGHT_COMPENSATION = 360 * 2;
const FADE_IN_TEXT_THRESHOLD = 300;

const fromBottomScale = d3
  .scaleLinear()
  .domain([0, FADE_IN_TEXT_THRESHOLD])
  .range([0, 1.0]);

// Detect if at least one intersection is visible
const isOneVisible = entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) return true;
  }
  return false;
};

interface ParagraphPanelProps {
  toggle?: Function;
  setMaskPosition?: Function;
}

const ParagraphPanel: React.FC<ParagraphPanelProps> = ({
  setMaskPosition,
  ...props
}) => {
  const windowSize = useWindowSize();
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Init some component vars
  let observer = component.observer;
  let currentPanel = component.currentPanel;
  let currentElements = component.currentElements;

  const processObservation = entries => {
    // Process onScroll events if any one paragraph panel is visible
    if (isOneVisible(entries)) {
      window.addEventListener("scroll", onScroll);
    } else {
      window.removeEventListener("scroll", onScroll);
    }

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentPanel = entry.target;

        // Get elements between hash markers
        currentElements = nextUntil(currentPanel, "#endparagraphpanel");
      }
    });
  };

  // We need a scroll handler now to process paragraph fading
  const onScroll = () => {
    if (window.innerWidth >= 1200) return;

    const top = currentElements[0].getBoundingClientRect().top;
    const fromFold = window.innerHeight - top;

    // if (setMaskPosition) setMaskPosition(-fromFold);

    if (fromFold > FADE_IN_TEXT_THRESHOLD) {
      // Already fully visible, never mind...
      if (currentElements[0].style.opacity >= 1.0) return;

      // Otherwise set visible and return
      currentElements.forEach(element => {
        element.style.opacity = 1.0;
      });
      return;
    }

    // Below the fold, make invisible
    if (fromFold < 0) {
      currentElements.forEach(element => {
        element.style.opacity = 0;
      });
    } else {
      currentElements.forEach(element => {
        // Set elements visible corresponding to scroll position
        element.style.opacity = fromBottomScale(fromFold);
      });
    }
  };

  useEffect(() => {
    // Observe bottom half of the screen and a little more
    observer = new IntersectionObserver(processObservation, {
      rootMargin: `-90% 0px 30px 0px`
    });

    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphpanel"]'
    );

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      observer.observe(paragraphStartElement);

      const paragraphEndElement = getNextSibling(
        paragraphStartElement,
        "#endparagraphpanel"
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

    // Remove all observations on unmount
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphpanel"]'
    );

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      const paragraphEndElement = getNextSibling(
        paragraphStartElement,
        "#endparagraphpanel"
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

export default ParagraphPanel;
