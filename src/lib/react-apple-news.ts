import { useLayoutEffect } from "react";
import { emitCanvasHeight } from "./apple-news";

export const useCanvasHeightEmitter = () => {
  let timeoutId: NodeJS.Timeout;

  const emitTarget = (target: HTMLElement) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      if (window.applenews) {
        emitCanvasHeight(target);
      } else if (window.parent !== window) {
        window.parent.postMessage({ height: target.clientHeight }, "*");
      }
    }, 100);
  };

  useLayoutEffect(() => {
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

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  emitTarget(document.body);
};
