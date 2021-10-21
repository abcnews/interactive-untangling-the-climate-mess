import React from "react";
import { useCanvasHeightEmitter } from "../../lib/react-apple-news";
import styles from "./styles.scss";

type EmbedProps = {};

const Embed: React.FC<EmbedProps> = ({ children }) => {
  useCanvasHeightEmitter();

  return <div className={styles.root}>{children}</div>;
};

export default Embed;
