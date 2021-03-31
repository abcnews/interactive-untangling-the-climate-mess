import React, { useEffect, useState, useRef } from "react";
import { Portal } from "react-portal";

// Import stylsheets
import styles from "./styles.scss";

// Import components
import UserInputBox from "../UserInputBox/index";
import BackgroundTexture from "../BackgroundTexture/index";
import MainTangle from "../MainTangle/index";
import ScrollObserver from "../ScrollObserver/index";
import ParagraphObserver from "../ParagraphObserver/index";
import ParagraphPanel from "../ParagraphPanel/index";
import DelayedHeader from "../DelayedHeader/index";
import { gsap } from "gsap";

import { Client } from "@abcnews/poll-counters-client";

// Using the React context API for global state
import { AppContext } from "../../AppContext";

// Other imports etc.
import EndStrings from "../EndStrings";
import BarChart from "../BarChart/index";
import DynamicText from "../DynamicText";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";
import InteractivePanel from "../InteractivePanel/index";

// Set up our poll counter
const GROUP = "interactive-untangling-the-climate-mess";
const pollClient = new Client(GROUP);

// Promisify callback functions here whatever
const pollIncrement = (...args) =>
  new Promise((resolve, reject) => {
    pollClient.increment(...args, (err, question) => {
      if (err) return reject(err);
      resolve(question);
    });
  });

const pollGet = (...args) =>
  new Promise((resolve, reject) => {
    pollClient.get(...args, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

// Add all markers here. They control string visibility later
const mainStringMarkers = ["initial", 1];
const endStringsMarkers = [
  "endstrings",
  "userstrings",
  "endallstrings",
  "endaustralia",
  "endstorycomplete"
];

interface AppProps {
  projectName: string;
}

let scrollY = 0;
let mainTangleEl;

const App: React.FC<AppProps> = ({ projectName }) => {
  const { subscribe, unsubscribe } = window.__ODYSSEY__.scheduler;

  const [backdropOffset, setBackdropOffset] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(200);
  const [marker, setMarker] = useState<any>();
  const [userInputState, setUserInputState] = useState({});
  const [topAbove, setTopAbove] = useState();
  const [backgroundIsRendered, setBackgroundIsRendered] = useState();
  const [mainTangleOpacity, setMainTangleOpacity] = useState(0.0);
  const [endTangleOpacity, setEndTangleOpacity] = useState(0.0);
  const [endStrings, setEndStrings] = useState({});
  const [userStrings, setUserStrings] = useState({
    renewables: 1,
    transportation: 1,
    carboncapture: 1,
    industry: 1,
    livestock: 1
  });
  const [australiaStrings, setAustraliaStrings] = useState({
    renewables: 1,
    transportation: 1,
    carboncapture: 1,
    industry: 1,
    livestock: 1
  });
  const [paragraphTextVisible, setParagraphTextVisible] = useState(false);
  const [interactivePanelElements, setInteractivePanelElements]: [
    any,
    any
  ] = useState();

  // User input state ----------------
  const [questionCompleteness, setQuestionCompleteness] = useState("nothing");
  const [convincedState, setConvincedState] = useState("incomplete");
  const [numberConvinvedOf, setNumberConvinvedOf] = useState(0);
  // End user input state ----------------

  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  const onSubscriptionUpdate = () => {
    scrollY = window.pageYOffset;

    // Only process when user at top
    if (scrollY > window.innerHeight * 2) return;

    const calculatedY = window.innerHeight * 0.75 - scrollY * 0.7;

    if (mainTangleEl) {
      gsap.to(mainTangleEl, {
        y: calculatedY > 0 ? calculatedY : 0,
        ease: "power3",
        duration: 0.5
      });
    }
  };

  // onMount
  useEffect(() => {
    console.log("App mounted...");

    pollGet().then((result: any) => {
      const values = result.value;

      if (!values) return;

      const pollTotals: any = {};

      function getAustraliaConvinced(keyString: string) {
        const certainOn: number = values[keyString].certain || 0;
        const hopefulOn: number = values[keyString].hopeful || 0;
        const doubtfulOn: number = values[keyString].doubtful || 0;
        const impossibleOn: number = values[keyString].impossible || 0;

        // Get number convinced
        const convincedCount = certainOn + hopefulOn;
        const unconvincedCount = doubtfulOn + impossibleOn;

        // Enter Australia convinced or not
        return convincedCount > unconvincedCount ? 0 : 1;
      }

      pollTotals.renewables = getAustraliaConvinced(
        "SUBQ1-renewables-zero-carbon"
      );
      pollTotals.livestock = getAustraliaConvinced("SUBQ2-livestock-emissions");
      pollTotals.transportation = getAustraliaConvinced(
        "SUBQ3-transportation-off-fossil"
      );
      pollTotals.industry = getAustraliaConvinced("SUBQ4-industry-emissions");
      pollTotals.carboncapture = getAustraliaConvinced("SUBQ5-carbon-capture");

      setAustraliaStrings(pollTotals);
    });

    // Subscription might be getting delayed on Firefox
    // Maybe consider simply doing an onScroll listener
    // subscribe(onSubscriptionUpdate);
    document.addEventListener("scroll", onSubscriptionUpdate);

    const panelStarters: any = document.querySelectorAll(
      "[id^='interactivepanel']"
    );
    const panelsArray = [...panelStarters];

    setInteractivePanelElements(panelsArray);

    for (const panel of panelsArray) {
      console.log("Interactive panel:", panel);

      // Get id string of panel
      const idString: string = panel.id;

      // Check if panel has config
      if (idString !== "interactivepanel") {
        console.log("id string:", idString);
        // Get alternating case config
        const panelConfig = alternatingCaseToObject(idString);
        console.log("Panel config:", panelConfig);
      }

      // const container = document.createElement("div");
      // container.className = styles.panelContentContainer;
      // panel.className = styles.panel;

      // // Get id string of panel
      // const idString: string = panel.id;

      // // Check if panel has config
      // if (idString !== "panel") {
      //   console.log("id string:", idString);
      //   // Get alternating case config
      //   const panelConfig = alternatingCaseToObject(idString);
      //   console.log("Panel config:", panelConfig);
      //   if (panelConfig.center) {
      //     panel.classList.add("nopullright");
      //   }
      // }

      // const elements = nextUntil(panel, "#endpanel");

      // // Add content to container element
      // for (const element of elements) {
      //   container.appendChild(element);
      // }

      // // Add container to panel
      // panel.appendChild(container);
    }

    return () => {
      // unsubscribe(onSubscriptionUpdate);
      document.removeEventListener("scroll", onSubscriptionUpdate);
    };
  }, []);

  useEffect(() => {
    if (!backgroundIsRendered) return;

    setTimeout(() => {
      mainTangleEl = document.querySelector(".interactive-main-tangle");

      if (window.pageYOffset < window.innerHeight * 2) {
        gsap.fromTo(
          mainTangleEl,
          { y: window.innerHeight * 1.25 },
          {
            y: window.innerHeight * 0.75,
            ease: "power3",
            duration: 1.0
          }
        );
      }

      setMainTangleOpacity(1.0);
    }, 100);
  }, [backgroundIsRendered]);

  // Effect when userInputState is changed
  useEffect(() => {
    if (!userInputState) return;

    /**
     * Here we are combining sentiment to simply positive or negative
     * or convinced or unconvinced, depending on which subquestion
     * or SUBQ a user presses.
     */

    // Check user state (buttons pressed) and act accordingly
    const nextUserStrings = userStrings;

    // Check renewables yes or no
    if (userInputState["SUBQ1-renewables-zero-carbon"]) {
      switch (userInputState["SUBQ1-renewables-zero-carbon"]) {
        case "certain":
        case "hopeful":
          nextUserStrings.renewables = 0;
          break;
        case "doubtful":
        case "impossible":
          nextUserStrings.renewables = 1;
          break;
      }
    }

    // Check livestock yes or no
    if (userInputState["SUBQ2-livestock-emissions"]) {
      switch (userInputState["SUBQ2-livestock-emissions"]) {
        case "certain":
        case "hopeful":
          nextUserStrings.livestock = 0;
          break;
        case "doubtful":
        case "impossible":
          nextUserStrings.livestock = 1;
          break;
      }
    }

    // Check if SUBQ3-transportation-off-fossil yes or no
    if (userInputState["SUBQ3-transportation-off-fossil"]) {
      switch (userInputState["SUBQ3-transportation-off-fossil"]) {
        case "certain":
        case "hopeful":
          nextUserStrings.transportation = 0;
          break;
        case "doubtful":
        case "impossible":
          nextUserStrings.transportation = 1;
          break;
      }
    }

    // Check if SUBQ4-industry-emissions yes or no
    if (userInputState["SUBQ4-industry-emissions"]) {
      switch (userInputState["SUBQ4-industry-emissions"]) {
        case "certain":
        case "hopeful":
          nextUserStrings.industry = 0;
          break;
        case "doubtful":
        case "impossible":
          nextUserStrings.industry = 1;
          break;
      }
    }

    // Check if SUBQ5-carbon-capture yes or no
    if (userInputState["SUBQ5-carbon-capture"]) {
      switch (userInputState["SUBQ5-carbon-capture"]) {
        case "certain":
        case "hopeful":
          nextUserStrings.carboncapture = 0;
          break;
        case "doubtful":
        case "impossible":
          nextUserStrings.carboncapture = 1;
          break;
      }
    }

    setUserStrings(nextUserStrings);

    console.log(nextUserStrings);

    // Count up number user convinced by
    let localConvincedCount = 0;

    for (const area in nextUserStrings) {
      if (nextUserStrings[area] === 0) localConvincedCount++;
    }

    console.log(localConvincedCount);
    setNumberConvinvedOf(localConvincedCount);

    // Calculate questionCompleteness
    function getMAIN1string(state): string {
      if (state["MAINQ1-can-we-still-save-the-world"]) return "yesMAIN1";
      else return "noMAIN1";
    }

    function getSUBstring(state): string {
      // SUBQ1-renewables-zero-carbon
      // SUBQ2-livestock-emissions
      // SUBQ3-transportation-off-fossil
      // SUBQ4-industry-emissions
      // SUBQ5-carbon-capture

      if (
        state["SUBQ1-renewables-zero-carbon"] &&
        state["SUBQ2-livestock-emissions"] &&
        state["SUBQ3-transportation-off-fossil"] &&
        state["SUBQ4-industry-emissions"] &&
        state["SUBQ5-carbon-capture"]
      )
        return "allSUB";

      if (
        state["SUBQ1-renewables-zero-carbon"] ||
        state["SUBQ2-livestock-emissions"] ||
        state["SUBQ3-transportation-off-fossil"] ||
        state["SUBQ4-industry-emissions"] ||
        state["SUBQ5-carbon-capture"]
      )
        return "someSUB";

      return "noSUB";
    }

    function getMAIN2(state): string {
      if (state["MAINQ2-can-we-still-save-the-world-again-after-article"])
        return "yesMAIN2";

      return "noMAIN2";
    }

    const combinedCompletenessStrings =
      getMAIN1string(userInputState) +
      getSUBstring(userInputState) +
      getMAIN2(userInputState);

    setQuestionCompleteness(combinedCompletenessStrings);

    //
    //

    console.log("User input state:", userInputState);

    // Determine if main question level changed
    const mainChangeLevels = {
      certain: 4,
      hopeful: 3,
      doubtful: 2,
      impossible: 1
    };

    const main1 = userInputState["MAINQ1-can-we-still-save-the-world"];
    const main2 =
      userInputState["MAINQ2-can-we-still-save-the-world-again-after-article"];

    const mainLevel1 = mainChangeLevels[main1];
    const mainLevel2 = mainChangeLevels[main2];

    if (mainLevel1 && main2) {
      if (mainLevel1 === mainLevel2) setConvincedState("orange");
      if (mainLevel1 > mainLevel2) setConvincedState("red");
      if (mainLevel1 < mainLevel2) setConvincedState("green");
    }
  }, [userInputState]);

  useEffect(() => {
    // This effect does something depending on what marker it is
    if (!marker) return;

    if (marker === 18) {
      // Hide for performance sake
      setEndTangleOpacity(0.0);
    }

    // Primarily for scrolling back up. We un-hide the main tangle
    // And hide the end tangle.
    if (marker === 19) {
      setMainTangleOpacity(1.0);
      setEndStrings({
        renewables: 0,
        transportation: 0,
        carboncapture: 0,
        industry: 0,
        livestock: 0
      });
    }

    // Make end strings visible if needed
    if (endStringsMarkers.includes(marker)) setEndTangleOpacity(1.0);

    // TODO: make mechanism for bringing in appropriate strings
    if (marker === "endstrings") {
      setMainTangleOpacity(0.0);

      setEndStrings({
        renewables: 0,
        transportation: 0,
        carboncapture: 0,
        industry: 0,
        livestock: 0
      });
    }

    if (marker === "endallstrings") {
      setEndStrings({
        renewables: 1,
        transportation: 1,
        carboncapture: 1,
        industry: 1,
        livestock: 1
      });
    }

    if (marker === "userstrings") {
      setEndStrings(userStrings);
    }

    if (marker === "endaustralia") {
      setEndStrings(australiaStrings);
    }

    if (marker === "endstorycomplete") {
      setEndStrings({
        renewables: 0,
        transportation: 0,
        carboncapture: 0,
        industry: 0,
        livestock: 0
      });
    }
  }, [marker]);

  //
  //

  useEffect(() => {
    console.log("Question completeness:", questionCompleteness);
  }, [questionCompleteness]);

  useEffect(() => {
    console.log("Convinced state:", convincedState);
  }, [convincedState]);

  return (
    <AppContext.Provider value={{ topAbove, setTopAbove }}>
      <>
        <Portal node={document && document.querySelector(".delayed-header")}>
          <DelayedHeader />
        </Portal>

        <Portal node={document && document.getElementById("inputtier1")}>
          <UserInputBox
            questionKey="MAINQ1-can-we-still-save-the-world"
            title={"Can we still save the world?"}
            buttons={[
              { label: "Of course we can", value: "certain" },
              { label: "Yes I think we can", value: "hopeful" },
              { label: "Probably not", value: "doubtful" },
              { label: "No way we're screwed", value: "impossible" }
            ]}
            poll={pollClient}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputradelaide")}>
          <UserInputBox
            questionKey="ASIDE1-south-australia-battery-good"
            title={"Still laughing at South Australia?"}
            buttons={[
              { label: "No, good one Radelaide", value: "positive" },
              { label: "Yes, they speak funny", value: "negative" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputtoast")}>
          <UserInputBox
            questionKey="ASIDE2-toast-affordable-zero-carbon"
            title={
              "So what do you reckon, can you have your toast in a zero carbon world and eat it too?"
            }
            buttons={[
              { label: "Yeah", value: "positive" },
              { label: "Nah", value: "negative" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputzerocarbon")}>
          <UserInputBox
            questionKey="SUBQ1-renewables-zero-carbon"
            title={"So - what do you reckon our chances of doing this are?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        {/* Livestock user input here */}
        {/* inputlivestockemissions */}

        <Portal
          node={document && document.getElementById("inputlivestockemissions")}>
          <UserInputBox
            questionKey="SUBQ2-livestock-emissions"
            title={"Can we reach reach zero livestock emissions?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal
          node={document && document.getElementById("inputcarscansaveus")}>
          <UserInputBox
            questionKey="ASIDE3-electric-vehicles"
            title={"So how are you feeling about EVs now?"}
            buttons={[
              { label: "CARS CAN SAVE US", value: "positive" },
              { label: "UTEPOCALYPSE IS NIGH", value: "negative" }
            ]}
            padding={true}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal
          node={document && document.getElementById("inputfossiltransport")}>
          <UserInputBox
            questionKey="SUBQ3-transportation-off-fossil"
            title={
              "So now you know how we quit fossil fuels in our transport system, can we do it?"
            }
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        {/* Industry input buttons go here */}
        {/* inputindustryemissions */}
        <Portal
          node={document && document.getElementById("inputindustryemissions")}>
          <UserInputBox
            questionKey="SUBQ4-industry-emissions"
            title={"Can we elliminate emissions from industry?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputbigseaweed")}>
          <UserInputBox
            questionKey="ASIDE4-big-seaweed"
            title={"Where are you splashing your cash?"}
            buttons={[
              { label: "BIG SEAWEED", value: "positive" },
              { label: "BIG FOSSIL", value: "negative" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal
          node={document && document.getElementById("inputcarboncapture")}>
          <UserInputBox
            questionKey="SUBQ5-carbon-capture"
            title={"So, what do you think? Can we capture all that carbon?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputmosquito")}>
          <UserInputBox
            questionKey="ASIDE5-australia-make-a-difference"
            title={"What should we be?"}
            buttons={[
              { label: "MOSQUITO", value: "negative" },
              { label: "DUNG BEETLE", value: "positive" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputtier1again")}>
          <UserInputBox
            questionKey="MAINQ2-can-we-still-save-the-world-again-after-article"
            title={"So, how about now? Can we save the world?"}
            buttons={[
              { label: "Of course we can", value: "certain" },
              { label: "Yes I think we can", value: "hopeful" },
              { label: "Probably not", value: "doubtful" },
              { label: "No way we're screwed", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("chartproportions")}>
          <BarChart
            bars={[
              { title: "Enery", percent: 33, color: "#ff8901" },
              { title: "Burping cows", percent: 10, color: "#22405a" },
              { title: "Transport", percent: 20, color: "#007e4e" },
              { title: "Industry", percent: 40, color: "#ff4e00" }
            ]}
          />
        </Portal>

        <Portal node={document?.getElementById("dynamictext-mainq1")}>
          <DynamicText
            watchForKey={"MAINQ1-can-we-still-save-the-world"}
            userInputState={userInputState}
          />
        </Portal>

        {/* Background visual */}
        <Portal node={document && document.getElementById("portalmount")}>
          {/* {marker && !endStringsMarkers.includes(marker) && ( */}
          {/* Don't unmount this because elements are being observed by ParagraphObserver
          Maybe try visibility hidden or display none instead */}
          <MainTangle
            animationFrame={animationFrame}
            scrollMarker={marker}
            yOffset={backdropOffset}
            setBackgroundIsRendered={setBackgroundIsRendered}
            opacity={mainTangleOpacity}
          />
          {/* )} */}

          <EndStrings opacity={endTangleOpacity} stringsNew={endStrings} />
          <BackgroundTexture />
        </Portal>

        <ScrollObserver setMarker={setMarker} />

        {/* Sets paragraph text where we break out of 
        scrolly panels (and hide background animations on mobile) */}
        {backgroundIsRendered && (
          <>
            <ParagraphObserver setYOffset={setBackdropOffset} />
            <ParagraphPanel toggle={setParagraphTextVisible} />
          </>
        )}

        {/* Just a line down the center of the screen for testing */}
        {/* <div className={styles.centerHint} /> */}

        {interactivePanelElements?.map((panel, iteration) => {
          return (
            <Portal key={iteration} node={panel}>
              <InteractivePanel />
            </Portal>
          );
        })}
      </>
    </AppContext.Provider>
  );
};

export default App;
