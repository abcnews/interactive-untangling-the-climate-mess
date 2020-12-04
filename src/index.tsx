// import "regenerator-runtime/runtime.js";

import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import jankdefer from "jankdefer";

// Setup Odyssey types to stop TypeScript from complaining
export type OdysseySchedulerClient = {
  hasChanged: boolean;
  fixedHeight: number;
};

export type OdysseySchedulerSubscriber = (
  client: OdysseySchedulerClient
) => void;

type OdysseyAPI = {
  scheduler: {
    subscribe: (subscriber: OdysseySchedulerSubscriber) => void;
    unsubscribe: (subscriber: OdysseySchedulerSubscriber) => void;
  };
  utils: {
    dom: {
      detach: (el: Element) => void;
    };
  };
};

declare global {
  interface Window {
    __ODYSSEY__: OdysseyAPI;
  }
}

// Because we are splitting modernJS through hash-script-loader
// let's do a fallback "nomodule" tag for browsers that don't support "modules"
// NOTE: Yeah... this won't work because it's not even loading this script in IE11 haha
// const scriptTag = document.createElement("script");
// scriptTag.setAttribute("nomodule", "");
// scriptTag.setAttribute("src", `${__webpack_public_path__}index.js`);
// document.head.appendChild(scriptTag);

const PROJECT_NAME: string = "interactive-untangling-the-climate-mess";
const root = document.querySelector(`#interactivemount`);

// Insert a div before the header
const main = document.querySelector("main.Main");
const delayedHeaderContainer = document.createElement("div");
delayedHeaderContainer.className = "delayed-header u-full";
if (main) main.insertBefore(delayedHeaderContainer, main.childNodes[0] || null);

// Solid colour at bottom of article
// const footer = main?.nextElementSibling;
// if (footer) footer.className = "footer-container"
// NOTE: doing this in pure CSS now.

function init() {
  console.log(":)");

  render(<App projectName={PROJECT_NAME} />, root);
}

const waitForOdyssey = () => {
  if (window.__ODYSSEY__) {
    init();
  } else {
    window.addEventListener("odyssey:api", init);
  }
};

if ("IntersectionObserver" in window) {
  jankdefer(waitForOdyssey);
} else {
  import("./polyfills").then(() => {
    console.log("LOADING POLYFILLS... PLEASE CONSIDER UPGRADING YOUR BROWSER...")
    jankdefer(waitForOdyssey);
  });
}

if (module.hot) {
  module.hot.accept("./components/App", () => {
    try {
      init();
    } catch (err) {
      import("./components/ErrorBox").then(({ default: ErrorBox }) => {
        render(<ErrorBox error={err} />, root);
      });
    }
  });
}

if (process.env.NODE_ENV === "development") {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
