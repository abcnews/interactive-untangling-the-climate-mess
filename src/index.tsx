import "regenerator-runtime/runtime.js";
import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import jankdefer from "jankdefer";
import { nextUntil } from "./nextUntil";
import styles from "./styles.scss";

// Feature detection
import "./modernizer";

// Keep TypeScript from throwing errors
declare var Modernizr: any;
declare var module: any;
declare var __webpack_public_path__: any;

if (Modernizr.arrow) {
  console.log("Probably not IE11...");
} else {
  console.log("Probably IE11 or lower...");
}

// Setup Odyssey types to stop TypeScript from complaining
export type OdysseySchedulerClient = {
  hasChanged: boolean;
  fixedHeight: number;
};

export type OdysseySchedulerSubscriber = (client: OdysseySchedulerClient) => void;

type OdysseyAPI = {
  scheduler: {
    subscribe: (subscriber: OdysseySchedulerSubscriber) => void;
    unsubscribe: (subscriber: OdysseySchedulerSubscriber) => void;
    enqueue: (subscriber: OdysseySchedulerSubscriber) => void;
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

const PROJECT_NAME: string = "interactive-untangling-the-climate-mess";
const root = document.querySelector("#interactivemount");

// Insert a div before the header
const main = document.querySelector("main.Main");
const delayedHeaderContainer = document.createElement("div");
delayedHeaderContainer.className = "delayed-header u-full";
if (main) main.insertBefore(delayedHeaderContainer, main.childNodes[0] || null);

// Some initial transforms to the DOM
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Set up text panels by moving elements within
// #panel and #endpanel to the starting div
const panelStarters: any = document.querySelectorAll("#panel");
const panelsArray = [...panelStarters];

for (const panel of panelsArray) {
  const container = document.createElement("div");
  container.className = styles.panelContentContainer;
  panel.className = styles.panel;

  const elements = nextUntil(panel, "#endpanel");

  // Add content to container element
  for (const element of elements) {
    container.appendChild(element);
  }

  // Add container to panel
  panel.appendChild(container);
}

function init() {
  render(<App projectName={PROJECT_NAME} />, root);
}

const waitForOdyssey = () => {
  if (window.__ODYSSEY__) {
    init();
  } else {
    window.addEventListener("odyssey:api", init);
  }
};

if ("IntersectionObserver" in window && NodeList.prototype.forEach) {
  jankdefer(waitForOdyssey);
} else {
  import("./polyfills").then(() => {
    console.log(
      "LOADING POLYFILLS... PLEASE UPGRADE YOUR BROWSER TO FIREFOX OR SOMETHING..."
    );
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
