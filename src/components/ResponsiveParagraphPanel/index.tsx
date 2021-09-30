import React, { useEffect } from "react";
import styles from "./styles.scss";
import { nextUntil } from "../../nextUntil";

type ResponsiveParagraphPanelProps = {};

const ResponsiveParagraphPanel: React.FC<ResponsiveParagraphPanelProps> = () => {
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

      insertBefore(paragraphWrapper, startEl);
    });
  }, []);

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


