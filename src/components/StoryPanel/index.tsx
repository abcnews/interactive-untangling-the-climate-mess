import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import styles from "./styles.scss";
import { nextUntil } from "./nextUntil";
import { Portal } from "react-portal";

const serializer = new XMLSerializer();

interface StoryPanelProps {
  startElement?: Element | null;
  endSelector?: string;
}

const defaultProps: StoryPanelProps = {
  startElement: document.querySelector("#panel"),
  endSelector: "#endpanel",
};

const StoryPanel: React.FC<StoryPanelProps> = (props) => {
  const [reactElements, setReactElements] = useState<any>();

  useEffect(() => {
    console.log("StoryPanel component mounted...");

    const elements = nextUntil(props.startElement, props.endSelector);

    for (const el of elements) {
      el.style.display = "block";
    }

    const stringElements = elements.map((el) =>
      serializer.serializeToString(el)
    );

    setReactElements(stringElements);

    for (const el of elements) {
      el.style.display = "none";
    }
  }, []);

  return (
    <Portal node={props.startElement}>
      <div className={styles.root}>
        {reactElements &&
          reactElements.map((string, index) =>
            parse(string, {
              replace: (node: any) => {
                if (node.attribs) node.attribs.key = index;
                return node;
              },
            })
          )}
      </div>
    </Portal>
  );
};

StoryPanel.defaultProps = defaultProps;

export default StoryPanel;
