import React from "react";
import { render } from "react-dom";
import App from "./components/App";

const PROJECT_NAME: string = "interactive-untangling-the-climate-mess";
const root = document.querySelector(`#interactivemount`);

function init() {
  console.log(":)");
  render(<App projectName={PROJECT_NAME} />, root);
}

if ((window as any).__ODYSSEY__) {
  init();
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
