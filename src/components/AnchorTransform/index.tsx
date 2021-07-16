import React, { useEffect, useState } from "react";
import styles from "./styles.scss";
import { Portal } from "react-portal";

type AnchorTransformProps = {
  anchorString?: string;
};

const AnchorTransform: React.FC<AnchorTransformProps> = ({
  anchorString = "#pollcountertext",
  children,
  ...props
}) => {
  const [transformed, setTransformed] = useState(false);

  useEffect(() => {
    // If not already transformed, select the anchor and transform to span
    const el: any = document.querySelector(`a[href='${anchorString}']`);

    if (el) {
      const countEl = document.createElement("span");
      countEl.classList.add(styles.root);
      if (el.parentNode) {
        el.parentNode.replaceChild(countEl, el);
      }
    }

    setTransformed(true);

    // We don't need to transform it back
    return () => {};
  }, []);

  return (
    <>
      {transformed && (
        <Portal node={document.querySelector(`.${styles.root}`)}>
          {children}
        </Portal>
      )}
    </>
  );
};

export default AnchorTransform;
