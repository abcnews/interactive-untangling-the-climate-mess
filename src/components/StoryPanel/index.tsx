import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import styles from "./styles.scss";

interface StoryPanelProps {}

const StoryPanel: React.FC<StoryPanelProps> = () => {
  const [element, setElement] = useState<any>();

  useEffect(() => {
    console.log("StoryPanel component mounted...");

    var s = new XMLSerializer();
    var d = document.querySelector(".Main p");
    var str = d && s.serializeToString(d);
    console.log(str);
    const el = parse(str!);
    console.log(el);

    setElement(el);
  }, []);

  return <div className={styles.root}>{element}</div>;
};

export default StoryPanel;
