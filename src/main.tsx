import "regenerator-runtime/runtime.js";
import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import jankdefer from "jankdefer";
import { nextUntil } from "./nextUntil";
import styles from "./styles.scss";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";

// Keep TypeScript from throwing errors
declare var Modernizr: any; // Seems to affect __ODYSSEY__ for some reason
declare var module: any;
declare var __webpack_public_path__: any;

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

function preInit() {
  // Insert a div before the header
  const main = document.querySelector("main.Main");
  const delayedHeaderContainer = document.createElement("div");
  delayedHeaderContainer.className = "delayed-header u-full";
  if (main)
    main.insertBefore(delayedHeaderContainer, main.childNodes[0] || null);

  // Some initial transforms to the DOM
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Set up text panels by moving elements within
  // #panel and #endpanel to the starting div
  const panelStarters: any = document.querySelectorAll("[id^='panel']");
  const panelsArray = [...panelStarters];

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const panels = [
    require("./components/OrganicPanel/organic-panel-background-variation-1.svg")
      .default,
    require("./components/OrganicPanel/organic-panel-background-variation-2.svg")
      .default,
    require("./components/OrganicPanel/organic-panel-background-variation-3.svg")
      .default
  ];

  // Loop though panels
  panelsArray.forEach((panel, iteration) => {
    const container = document.createElement("div");
    container.innerHTML = `<div class="organic-panel-background">
      <img
        src="${panels[iteration % panels.length]}"
        class="organic-panel-style-stretch"
      />
    </div>`;
    container.className = styles.panelContentContainer;
    panel.className = styles.panel;

    // Get id string of panel
    const idString: string = panel.id;

    // Check if panel has config
    if (idString !== "panel") {
      // Get alternating case config
      const panelConfig = alternatingCaseToObject(idString);

      if (panelConfig.center) {
        panel.classList.add("nopullright");
      }
    }

    const elements = nextUntil(panel, "#endpanel");

    // Add content to container element
    for (const element of elements) {
      container.appendChild(element);
    }

    // Add container to panel
    panel.appendChild(container);
  });

  // Set up pre header panel DOM
  const markers = document.querySelectorAll("[id^='preheaderpanel']");
  const markersArray = Array.from(markers);

  const panelArray = markersArray.map((panel, i) => {
    const panelContainer = document.createElement("div");
    panelContainer.className = "preheader-container";
    const elementArray: any = [];
    const panelElements = nextUntil(panel, "#endpreheaderpanel");

    // // Add content to container element
    panelElements.forEach((element, iteration) => {
      panelContainer.appendChild(element);
    });

    document.body.appendChild(panelContainer);
  });

  // Add classes to paragraphs from #fragments
  classify("class");

  // Add spacing to last of type panels
  const paragraphTextElements: any = document.querySelectorAll(
    "#paragraphtext"
  );
  const paragraphTextElementsArray = [...paragraphTextElements];

  for (const el of paragraphTextElementsArray) {
    // Get panel 2 from paragraph text and add class
    const panel = el.previousSibling.previousSibling;
    panel.classList.add("last-panel");
  }
}

function init() {
  render(<App projectName={PROJECT_NAME} />, root);
}

const waitForOdyssey = () => {
  if (window.__ODYSSEY__) {
    preInit();
    init();
  } else {
    window.addEventListener("odyssey:api", () => {
      preInit();
      init();
    });
  }
};

// TODO: Maybe make this Modernizr detection?
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
    } catch (err: any) {
      import("./components/ErrorBox").then(({ default: ErrorBox }) => {
        render(<ErrorBox error={err} />, root);
      });
    }
  });
}

if (process.env.NODE_ENV === "development") {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}

// Add class via CoreMedia hashtags eg. #classverytop
function classify(targetString) {
  // Set deafult for params
  if (targetString === undefined) {
    targetString = "class";
  }

  const anchors = document.querySelectorAll("[data-mount]");

  // Loop through all the anchor nodes
  anchors.forEach(anchor => {
    // Leave normal links on the page alone
    // if (anchor.innerHTML !== " ") return;

    // Get name value
    const elementName = anchor.getAttribute("id");
    if (!elementName) return;

    // Detect class
    if (elementName.slice(0, targetString.length) !== targetString) return;

    // Get class name to apply
    const classToApply = elementName.substr(targetString.length);

    // Get the next paragraph to work with
    const nextElement = anchor.nextElementSibling;
    if (!nextElement) return;

    // Apply the class
    nextElement.classList.add(classToApply);

    // Remove anchor
    anchor.parentNode?.removeChild(anchor);
  });
}
