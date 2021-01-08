import React, { useEffect, useState } from "react";
import { Portal } from "react-portal";

// Import stylsheets
import styles from "./styles.scss";

// Import components
import UserInputBox from "../UserInputBox/index";
import BackgroundTexture from "../BackgroundTexture/index";
import MainTangle from "../MainTangle/index";
import ScrollObserver from "../ScrollObserver/index";
import DelayedHeader from "../DelayedHeader/index";

import { Client } from "@abcnews/poll-counters-client";

// Using the React context API for global state
import { AppContext } from "../../AppContext";
import EndStrings from "../EndStrings";

// Set up our poll counter
const GROUP = "__example__";
const QUESTION = "x";
const ANSWER = "y";

const pollClient = new Client(GROUP);

// Specify markers that are in main BackgroundVis
// const backgroundVisMarkers = [
//   "initial",
//   1,
//   2,
//   3,
//   4,
//   5,
//   6,
//   7,
//   8,
//   9,
//   10,
//   11,
//   12,
//   13,
//   14,
//   15,
//   16,
//   17,
//   18,
//   19,
// ];

const endStringsMarkers = ["endstrings"];

interface AppProps {
  projectName: string;
}

const App: React.FC<AppProps> = ({ projectName }) => {
  const [backdropOffset, setBackdropOffset] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(200);
  const [marker, setMarker] = useState<any>();
  // const [panels, setPanels] = useState<any>();

  // SCHEDULER TO HANDLE ONSCROLL AND RESIZE ON BACKGROUND
  const { subscribe, unsubscribe, enqueue } = window.__ODYSSEY__.scheduler;

  // const masthead = document.querySelector('[data-component="Masthead"]');

  const onUpdate = () => {
    // Push animation down so not hidden by Masthead
    // Note: might not be necessary
    // if (window.scrollY < 200) {
    //   const offset = masthead?.getBoundingClientRect().bottom;
    //   if (offset && offset > 0) setBackdropOffset(offset);
    //   else setBackdropOffset(0);
    // } else setBackdropOffset(0);
    // setAnimationFrame(window.scrollY);
  };

  useEffect(() => {
    console.log("App mounted...");

    // // Set up panel styling
    // const panelStarters: any = document.querySelectorAll("#panel");
    // setPanels([...panelStarters]);

    // Test Odyssey enqueueing
    enqueue(() => {
      // console.log("Enqueue test...");
    });

    // Uncomment to enable Odyssey subscriber service
    subscribe(onUpdate);
    return () => unsubscribe(onUpdate);
  }, []);

  // useEffect(() => {
  //   if (!marker) return;

  //   console.log("Current marker:", marker);
  // }, [marker]);

  return (
    <AppContext.Provider value={{ marker }}>
      <>
        <Portal node={document && document.querySelector(".delayed-header")}>
          <DelayedHeader />
        </Portal>

        <Portal node={document && document.getElementById("inputtier1")}>
          <UserInputBox
            title={"Can we still save the world?"}
            poll={pollClient}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputradelaide")}>
          <UserInputBox
            title={"Still laughing at South Australia?"}
            buttons={[
              { label: "No, good one Radelaide", value: "1" },
              { label: "Yes, they speak funny", value: "2" },
            ]}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputtoast")}>
          <UserInputBox
            title={
              "So what do you reckon, can you have your toast in a zero carbon world and eat it too?"
            }
            buttons={[
              { label: "Yeah", value: "1" },
              { label: "Nah", value: "2" },
            ]}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputzerocarbon")}>
          <UserInputBox
            title={"So - what do you reckon our chances of doing this are?"}
            buttons={[
              { label: "That's a piece of cake", value: "1" },
              { label: "It can be done", value: "2" },
              { label: "This sounds like a stretch", value: "3" },
              { label: "You're dreaming", value: "4" },
            ]}
          />
        </Portal>

        <Portal
          node={document && document.getElementById("inputcarscansaveus")}
        >
          <UserInputBox
            title={"So how are you feeling about EVs now?"}
            buttons={[
              { label: "CARS CAN SAVE US", value: "1" },
              { label: "UTEPOCALYPSE IS NIGH", value: "2" },
            ]}
          />
        </Portal>

        <Portal
          node={document && document.getElementById("inputfossiltransport")}
        >
          <UserInputBox
            title={
              "So now you know how we quit fossil fuels in our transport system, can we do it?"
            }
            buttons={[
              { label: "That's a piece of cake", value: "1" },
              { label: "It can be done", value: "2" },
              { label: "This sounds like a stretch", value: "3" },
              { label: "You're dreaming", value: "4" },
            ]}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputbigseaweed")}>
          <UserInputBox
            title={"Where are you splashing your cash?"}
            buttons={[
              { label: "BIG SEAWEED", value: "1" },
              { label: "BIG FOSSIL", value: "2" },
            ]}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputmosquito")}>
          <UserInputBox
            title={"What should we be?"}
            buttons={[
              { label: "MOSQUITO", value: "1" },
              { label: "DUNG BEETLE", value: "2" },
            ]}
          />
        </Portal>

        <ScrollObserver setMarker={setMarker} />

        {/* Background visual */}
        <Portal node={document && document.getElementById("portalmount")}>
          {!endStringsMarkers.includes(marker) ? (
            <MainTangle animationFrame={animationFrame} scrollMarker={marker} />
          ) : (
            <>
              <EndStrings />
            </>
          )}
        </Portal>

        <BackgroundTexture />

        {/* Just a line down the center of the screen for testing */}
        {/* <div className={styles.centerHint} /> */}
      </>
    </AppContext.Provider>
  );
};

export default App;
