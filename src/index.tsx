import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import jankdefer from "jankdefer";

const PROJECT_NAME: string = "interactive-untangling-the-climate-mess";
const root = document.querySelector(`#interactivemount`);

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

// Insert a div before the header
const el = document.querySelector(".Main");
const newEl = document.createElement("div");
newEl.className = "delayed-header u-full";

if (el) el.insertBefore(newEl, el.childNodes[0] || null);

function init() {
  console.log(":)");
  render(<App projectName={PROJECT_NAME} />, root);
}

if (window.__ODYSSEY__) {
  jankdefer(init);
  // init();
} else {
  window.addEventListener("odyssey:api", init);
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
