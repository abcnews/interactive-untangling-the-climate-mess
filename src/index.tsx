declare var Modernizr: any;

// Feature detection
import "./modernizer";

// Detect browser support
if (Modernizr.arrow) {
  import("./main").then(() => {});
} else {
  console.log(
    "Browser not supported. Please update your browser. https://www.mozilla.org/en-US/firefox/new/"
  );
}

export {};
