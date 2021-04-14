console.log("main index");
declare var Modernizr: any;

// Feature detection
import "./modernizer";
let notIE = false;

if (Modernizr.arrow) {
  console.log("Probably not IE11...");
  notIE = true;

  import("./main").then(() => {
    console.log("...loaded main")
  })
} else {
  console.log("Probably IE11 or lower...");

  // This unfortunately doesn't stop our JS from
  // running due to Webpack pushing all the css etc up top
  throw new Error(
    "Something went badly wrong... you are using an unsupported browser"
  );
}

export {}