import { useEffect } from "react";
import useSWR from "swr";
import { emitCanvasHeight } from "./apple-news";

export const useCanvasHeightEmitter = () => {
  const emitTarget = (target: HTMLElement) => {
    if (window.applenews) {
      emitCanvasHeight(target);
    } else if (window.parent !== window) {
      window.parent.postMessage({ height: target.clientHeight }, "*");
    }
  };

  useEffect(() => {
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(entries =>
        entries.forEach(entry => emitTarget(entry.target as HTMLElement))
      );

      resizeObserver.observe(document.body);

      return () => {
        resizeObserver.disconnect();
      };
    }

    let lastHeight = document.body.clientHeight;
    const intervalId = setInterval(() => {
      const height = document.body.clientHeight;

      if (height !== lastHeight) {
        lastHeight = height;
        emitTarget(document.body);
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, []);

  emitTarget(document.body);
};

export const useDynamicText = () => {
  const dynamicText = {};
  const { data, error } = useSWR(
    `${window.applenews ? "./" : __webpack_public_path__}dynamic-text.json`,
    async url => await (await fetch(url, { cache: "no-cache" })).text()
  );

  if (data) {
    try {
      for (const record of JSON.parse(data)) {
        const { fields } = record;
        const { name, text } = fields;

        const isBlank =
          text === "\n" ||
          text === "" ||
          text === " " ||
          text === null ||
          text === undefined;

        dynamicText[name] = isBlank ? undefined : text;
      }
    } catch (err) {}
  }

  return {
    dynamicText,
    dynamicTextLoading: !error && !data,
    dynamicTextError: error
  };
};
