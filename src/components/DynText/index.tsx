import React from "react";
import Markdown from "markdown-to-jsx";

import styles from "./styles.scss";

type DynTextProps = { children?: string };

const DynText: React.FC<DynTextProps> = ({ children, ...props }) => {
  if (!children) return <></>;
  return <Markdown>{children}</Markdown>;
};

export default DynText;
