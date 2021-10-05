import React, { useEffect, useState } from "react";
import styles from "./styles.scss";
import { nextUntil } from "../../nextUntil";
import { gsap } from "gsap";
const d3 = { ...require("d3-scale") };
import useWindowSize from "../ParagraphObserver/useWindowSize";

const FADE_IN_TEXT_THRESHOLD = window.innerHeight * 0.25;

const fromBottomScale = d3
  .scaleLinear()
  .domain([0, FADE_IN_TEXT_THRESHOLD])
  .range([0, 1.0]);

type ResponsiveParagraphPanelProps = {};

let paragraphPanels;

const ResponsiveParagraphPanel: React.FC<ResponsiveParagraphPanelProps> = () => {
  const windowSize = useWindowSize();

  // TODO: Maybe only process near viewport panels
  // if needed using intersection observer
  const onScroll = e => {
    if (window.innerWidth >= 1200) {
      return;
    }

    paragraphPanels.forEach(panel => {
      const { firstChild } = panel;
      const top = firstChild.getBoundingClientRect().top;
      if (top < 100) {
        panel.style.opacity = 1.0;
        return;
      }

      if (top > window.innerHeight) {
        panel.style.opacity = 0.0;
        return;
      }

      // Else fade in
      const fromBottom = window.innerHeight - top;
      panel.style.opacity = fromBottomScale(fromBottom);
    });
  };

  // onMount take the paragraphs and put them in a div
  // Place them above the paragraphpanel elements
  // so they aren't processed on hot reload
  useEffect(() => {
    const paragraphStartMarkers: any = document.querySelectorAll(
      '*[id^="paragraphpanel"]'
    );

    paragraphStartMarkers.forEach((startEl, index: number) => {
      const paragraphWrapper = document.createElement("div");
      paragraphWrapper.classList.add(styles.paragraphWrapper);
      const elementsBetween = nextUntil(startEl, "#endparagraphpanel");

      elementsBetween.forEach((el: any) => {
        paragraphWrapper.appendChild(el);
      });

      if (elementsBetween.length > 0) insertBefore(paragraphWrapper, startEl);
    });

    paragraphPanels = document.querySelectorAll(`.${styles.paragraphWrapper}`);

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const { width, height } = windowSize;

    paragraphPanels.forEach(panel => {
      if (width > 1200) {
        panel.style.opacity = 1.0;
        return;
      }
    });
  }, [windowSize.width, windowSize.height]);

  return (
    <div className={styles.root}>
      {/* Find me in <strong>src/components/ResponsiveParagraphPanel</strong> */}
    </div>
  );
};

export default ResponsiveParagraphPanel;

function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function insertBefore(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode);
}
