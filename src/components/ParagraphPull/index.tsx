import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.scss";
import { getNextSibling } from "../ParagraphFade/helpers";
import useWindowSize from "../ParagraphFade/useWindowSize";
import { nextUntil } from "../../nextUntil";

const d3 = { ...require("d3-scale") };

const HEIGHT_COMPENSATION = 600;
const PUSH_THRESHOLD = window.innerHeight * 0.6;
const OPACITY_MIN = 0.1;

const heightScale = d3
  .scaleLinear()
  .domain([0, window.innerHeight])
  .range([0.0, 1.0]);

// Detect if at least one intersection is visible
const isOneVisible = entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) return true;
  }
  return false;
};

interface ParagraphPullProps {
  toggle?: Function;
  setMainTangleOpacity: Function;
  setMainTangleYPos: Function;
  mainTangleYPos: number;
  setMainTangleHidden: Function;
}

const ParagraphPull: React.FC<ParagraphPullProps> = ({
  setMainTangleOpacity,
  setMainTangleYPos,
  mainTangleYPos,
  setMainTangleHidden,
  ...props
}) => {
  const windowSize = useWindowSize();
  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // Set state
  const [visible, setVisible] = useState(false);

  // Init some component vars
  let observer = component.observer;
  let currentPanel = component.currentPanel;
  let currentElements = component.currentElements;

  const processObservation = entries => {
    // Process onScroll events if any one paragraph panel is visible
    if (isOneVisible(entries)) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      window.removeEventListener("scroll", onScroll);
    }

    entries.forEach(entry => {
      // setVisible(entry.isIntersecting);

      if (entry.isIntersecting) {
        currentPanel = entry.target;

        // Get elements between hash markers
        currentElements = nextUntil(currentPanel, "#endparagraphpull");
      }
    });
  };

  // We need a scroll handler now to process paragraph fading
  const onScroll = () => {
    const top = currentElements[0].getBoundingClientRect().top;
    const topFromFold = window.innerHeight - top;

    const bottomFromTop = currentElements[
      currentElements.length - 1
    ].getBoundingClientRect().bottom;

    // console.log(topFromFold, bottomFromTop);

    if (bottomFromTop < window.innerHeight) {
      setMainTangleYPos(-1.0)
    }

    else if (topFromFold > 0) {
      setMainTangleYPos(-heightScale(topFromFold));
    }

    // Trigger top animation
    //   if (topFromFold > 0 && topFromFold < FADE_IN_THRESHOLD) {
    //     setMainTangleYPos(fromBottomScale(topFromFold));
    //   } else if (topFromFold <= 0) {
    //     setMainTangleYPos(1.0);
    //   } else if (bottomFromTop > FADE_IN_THRESHOLD) {
    //     setMainTangleYPos(OPACITY_MIN);
    //   } else if (bottomFromTop > 0 && bottomFromTop < FADE_IN_THRESHOLD) {
    //     setMainTangleYPos(fromBottomScale(bottomFromTop));
    //   } else if (bottomFromTop < 0) {
    //     setMainTangleYPos(1.0);
    //   }
  };

  useEffect(() => {
    observer = new IntersectionObserver(processObservation, {
      rootMargin: `-10% 0%`
    });

    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphpull"]'
    );

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      observer.observe(paragraphStartElement);

      const paragraphEndElement = getNextSibling(
        paragraphStartElement,
        "#endparagraphpull"
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

  // useEffect(() => {
  //   props.toggle(visible);
  // }, [visible]);

  useEffect(() => {
    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphpull"]'
    );

    paragraphStartMarkers.forEach((paragraphStartElement, index: number) => {
      const paragraphEndElement = getNextSibling(
        paragraphStartElement,
        "#endparagraphpull"
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

export default ParagraphPull;
