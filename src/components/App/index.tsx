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
import ParagraphFade from "../ParagraphFade";
import ParagraphPull from "../ParagraphPull";

import { Client } from "@abcnews/poll-counters-client";

// Using the React context API for global state
import { AppContext } from "../../AppContext";

// Other imports etc.
import EndStrings from "../EndStrings";
import BarChart from "../BarChart/index";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";
import InteractivePanel from "../InteractivePanel/index";

import to from "await-to-js";

const d3 = { ...require("d3-scale") };

// Set up our poll counter
const GROUP = "interactive-untangling-the-climate-mess";
const pollClient = new Client(GROUP);

const TANGLE_DOWNPAGE_START = 0.75;
const TANGLE_MAX_OFFSET = -200;

// Control position of main tangle depending on marker
const markerConfig = {
  initial: 0.2,
  2: 0.01, // Story Title: Untangling The Climate Mess
  3: 0.1, // Back to ball
  4: 0.01 // Power lines (purple)
};

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
let initialPositioningComplete = false;

const App: React.FC<AppProps> = ({ projectName }) => {
  const { subscribe, unsubscribe } = window.__ODYSSEY__.scheduler;

  const [backdropOffset, setBackdropOffset] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(200);
  const [marker, _setMarker] = useState<any>();
  const markerRef = useRef(marker);
  // So we can use opacity in an event listener
  const setMarker = data => {
    markerRef.current = data;
    _setMarker(data);
  };

  const [userInputState, setUserInputState] = useState({});
  const [topAbove, setTopAbove] = useState();
  const [backgroundIsRendered, setBackgroundIsRendered] = useState();
  const [mainTangleOpacity, _setMainTangleOpacity] = useState(0.0);
  const mainTangleOpacityRef = useRef(mainTangleOpacity);
  // So we can use opacity in an event listener
  const setMainTangleOpacity = data => {
    mainTangleOpacityRef.current = data;
    _setMainTangleOpacity(data);
  };

  const [mainTangleXPos, setMainTangleXPos] = useState(0);
  const [mainTangleYPos, setMainTangleYPos] = useState(1.1);
  const [mainTangleScale, setMainTangleScale] = useState(100);
  const [endTangleOpacity, setEndTangleOpacity] = useState(0.0);
  const [mainTangleHidden, setMainTangleHidden] = useState(false);
  const [mainTangleMaskPos, setMainTangleMaskPos] = useState(0);
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
  const [interactivePanelElements, setInteractivePanelElements]: [
    any,
    any
  ] = useState();

  // User input state ----------------
  const [questionCompleteness, setQuestionCompleteness] = useState("nothing");
  const [convincedState, setConvincedState] = useState("orange");
  const [subQuestionsConvinvedOf, setSubQuestionsConvinvedOf] = useState(0);
  // ----------------
  const [australiaConvincedOf, setAustraliaConvincedOf] = useState(0);
  const [sectionColor, setSectionColor] = useState();

  // ---- Combined config for InteractivePanel components
  // const [interactivePanelInput, setInteractivePanelInput] = useState({
  //   completeness: 0,
  //   persuasiveness: "incomplete",
  // });

  /**
   * TODO: I think we could move this to a single prop on the InteractivePanel
   * component using input={{completeness: questionCompleteness}} etc etc.
   *
   * Try when Easter is over...
   *
   * ... or later
   */

  // Used to test if the user has actively engaged with the article
  // (whether that is by reading it or clicking on a button, etc)
  // Immediately invoking this effect just because it will only be used once.
  const [userHasEngaged, setUserHasEngaged] = useState(false);
  useEffect(() => {
    if (!userHasEngaged) return;
    console.log("User has engaged!");

    (async () => {
      const [err, result] = await to(
        pollIncrement({
          question: "USERINFO",
          answer: "engagement-count"
        })
      );

      if (err) console.error(err);
    })();
  }, [userHasEngaged]);

  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // const onScrollUpdate = () => {
  //   scrollY = window.pageYOffset;
  //   // Only process when user at top
  //   if (scrollY > window.innerHeight * 2 || mainTangleOpacityRef.current < 0.9)
  //     return;

  //   const percentScale = d3
  //     .scaleLinear()
  //     .domain([0, window.innerHeight])
  //     .range([0.8, 0.2])
  //     .clamp(true);

  //   const calculatedY = TANGLE_DOWNPAGE_START - scrollY / 2000;

  //   setMainTangleYPos(percentScale(scrollY));
  // };

  // onMount
  useEffect(() => {
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

      let localAusConvinced = 0;

      for (const area in pollTotals) {
        if (pollTotals[area] === 0) localAusConvinced++;
      }

      setAustraliaConvincedOf(localAusConvinced);
    });

    // Listen for scroll
    // document.addEventListener("scroll", onScrollUpdate);

    const panelStarters: any = document.querySelectorAll(
      "[id^='interactivepanel']"
    );
    const panelsArray = [...panelStarters];

    setInteractivePanelElements(panelsArray);

    // Let's try to convert some anchors into colored pillboxes
    const anchors = document.getElementsByTagName("a");
    const anchorArray = Array.from(anchors);

    // Filter the ones with #pillbox
    const pillBoxes = anchorArray.filter(anchor => {
      const href: string = anchor.href || "";
      const reg = /#pillbox.*/;
      const match = href.match(reg);

      if (match) return true;
    });

    // Loop through and transform
    for (const pill of pillBoxes) {
      const href: string = pill.href || "";
      const reg = /#pillbox.*/;
      const match = href.match(reg);

      if (match) {
        const config = alternatingCaseToObject(match[0]);

        const pillEl = document.createElement("strong");
        pillEl.innerHTML = pill.innerHTML;

        pillEl.classList.add(styles.pillbox);
        pillEl.style.backgroundColor = `#${config.color}`;

        if (pill.parentNode) {
          pill.parentNode.replaceChild(pillEl, pill);
        }
      }
    }

    return () => {
      // unsubscribe(onSubscriptionUpdate);
      // document.removeEventListener("scroll", onScrollUpdate);
    };
  }, []);

  // USED TO START TANGLE AT BOTTOM OF SCREEN AT FIRST
  // WE ARE TRYING TO MOVE THIS FUNCTIONALITY INTO THE MAIN TANGLE
  // COMPONENT
  useEffect(() => {
    if (!backgroundIsRendered) return;

    setTimeout(() => {
      // mainTangleEl = document.querySelector(".interactive-main-tangle");

      // // TODO: Calculate y scroll for loading downpage a bit
      // if (window.pageYOffset < window.innerHeight * 2) {
      //   gsap.fromTo(
      //     mainTangleEl,
      //     { y: window.innerHeight * 1.25 },
      //     {
      //       y: window.innerHeight * TANGLE_DOWNPAGE_START,
      //       ease: "power3",
      //       duration: 1.0
      //     }
      //   );
      // }

      // Wait a while before we bring in the tangle
      setTimeout(() => {
        if (markerRef.current === "initial")
          setMainTangleYPos(TANGLE_DOWNPAGE_START);
        // else setMainTangleYPos(markerConfig[markerRef.current] || 0.01);
        // TODO: Start at Core position config
        else setMainTangleYPos(0.01);

        // We have initially positioned
        initialPositioningComplete = true;

        // Otherwise the tangle is invisible
        setMainTangleOpacity(1.0);
      }, 1000);
    }, 100); // Wait a bit or else doesn't work properly
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

    // Count up number user convinced by
    let localConvincedCount = 0;

    for (const area in nextUserStrings) {
      if (nextUserStrings[area] === 0) localConvincedCount++;
    }

    setSubQuestionsConvinvedOf(localConvincedCount);

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
    if (typeof marker === "undefined") return;

    // Position tangle according to marker
    // TODO: Now handled by CoreMedia #hash
    // if (
    //   typeof markerConfig[marker] !== "undefined" &&
    //   initialPositioningComplete
    // ) {
    //   setMainTangleYPos(markerConfig[marker]);
    // }

    if (marker === 18) {
      // Hide main tangle for performance sake
      // after a certain point
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
    else setEndTangleOpacity(0.0);

    // mechanism for bringing in appropriate strings
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

    // If user has scrolled enough, set them as has engaged
    if (marker === 2) {
      setUserHasEngaged(true);
    }

    console.log("Current marker", marker);
  }, [marker]);

  return (
    <AppContext.Provider value={{ topAbove, setTopAbove }}>
      <>
        <Portal node={document && document.querySelector(".delayed-header")}>
          <DelayedHeader />
        </Portal>

        <Portal node={document && document.getElementById("inputtier1")}>
          <UserInputBox
            color={"#2A4059"}
            questionKey="MAINQ1-can-we-still-save-the-world"
            title={"Can we still save the world?"}
            buttons={[
              {
                label: "Of course we can",
                value: "certain",
                response: (
                  <>
                    <p>
                      Ok, so you’re onboard - but how do we get there? Let’s see
                      if you’re still convinced after reading what it takes.
                    </p>
                  </>
                )
              },
              {
                label: "Yes I think we can",
                value: "hopeful",
                response: (
                  <>
                    <p>
                      Ok, so you’re onboard - but how do we get there? Let’s see
                      if you’re still convinced after reading what it takes.
                    </p>
                  </>
                )
              },
              {
                label: "Probably not",
                value: "doubtful",
                response: (
                  <p>
                    Ok that's fair enough - we'd be skeptical too - but let’s
                    see how you feel after reading what’s involved with
                    cancelling Australia’s emissions.
                  </p>
                )
              },
              {
                label: "No way we're screwed",
                value: "impossible",
                response: (
                  <p>
                    Ok that's fair enough - we'd be skeptical too - but let’s
                    see how you feel after reading what’s involved with
                    cancelling Australia’s emissions.
                  </p>
                )
              }
            ]}
            poll={pollClient}
            setUserInputState={setUserInputState}
            pollClient={pollClient}
          />
        </Portal>

        {/* Energy questions */}

        <Portal node={document && document.getElementById("inputzerocarbon")}>
          <UserInputBox
            color={"#A3297C"}
            questionKey="SUBQ1-renewables-zero-carbon"
            title={"So - what do you reckon our chances of doing this are?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
            pollClient={pollClient}
          />
        </Portal>

        {/* Livestock user input here */}
        {/* inputlivestockemissions */}

        <Portal
          node={document && document.getElementById("inputlivestockemissions")}
        >
          <UserInputBox
            color={"#2A4059"}
            questionKey="SUBQ2-livestock-emissions"
            title={"Can we reach reach zero livestock emissions?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
            pollClient={pollClient}
          />
        </Portal>

        <Portal
          node={document && document.getElementById("inputfossiltransport")}
        >
          <UserInputBox
            color={"#007B52"}
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
            pollClient={pollClient}
          />
        </Portal>

        {/* Industry input buttons go here */}
        {/* inputindustryemissions */}
        <Portal
          node={document && document.getElementById("inputindustryemissions")}
        >
          <UserInputBox
            color={"#F65C1B"}
            questionKey="SUBQ4-industry-emissions"
            title={"Can we elliminate emissions from industry?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
            pollClient={pollClient}
          />
        </Portal>

        <Portal
          node={document && document.getElementById("inputcarboncapture")}
        >
          <UserInputBox
            color={"#0076C5"}
            questionKey="SUBQ5-carbon-capture"
            title={"So, what do you think? Can we capture all that carbon?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" }
            ]}
            setUserInputState={setUserInputState}
            pollClient={pollClient}
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
            pollClient={pollClient}
          />
        </Portal>

        <Portal node={document && document.getElementById("chartproportions")}>
          <BarChart
            bars={[
              {
                title: "Enery",
                percent: 33,
                color: "#A3297C",
                textColor: "#A3297C"
              },
              {
                title: "Burping cows",
                percent: 10,
                color: "#2A4059",
                textColor: "#2A4059"
              },
              {
                title: "Transport",
                percent: 20,
                color: "#007B52",
                textColor: "#007B52"
              },
              {
                title: "Industry",
                percent: 40,
                color: "#F65C1B",
                textColor: "#C42F05"
              }
            ]}
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
            setBackgroundIsRendered={setBackgroundIsRendered}
            opacity={mainTangleOpacity}
            xPos={mainTangleXPos}
            yPos={mainTangleYPos}
            scale={mainTangleScale}
            hidden={mainTangleHidden}
            maskPosition={mainTangleMaskPos}
          />
          {/* )} */}

          <EndStrings opacity={endTangleOpacity} stringsNew={endStrings} />
          <BackgroundTexture />
        </Portal>

        <ScrollObserver
          setMarker={setMarker}
          setMainTangleYPos={setMainTangleYPos}
        />

        {/* Sets paragraph text where we break out of 
        scrolly panels (and hide background animations on mobile) */}
        {backgroundIsRendered && (
          <>
            {/* A panel that goes over the top with paragraph text on it #paragraphpanel */}
            <ParagraphPanel setMaskPosition={setMainTangleMaskPos} />
            <ParagraphObserver />
            <ParagraphFade setMainTangleOpacity={setMainTangleOpacity} />
            <ParagraphPull
              setMainTangleOpacity={setMainTangleOpacity}
              setMainTangleYPos={setMainTangleYPos}
              mainTangleYPos={mainTangleYPos}
              setMainTangleHidden={setMainTangleHidden}
            />
          </>
        )}

        {/* Just a line down the center of the screen for testing */}
        {/* <div className={styles.centerHint} /> */}

        {interactivePanelElements?.map((panel, iteration) => {
          const panelConfig = alternatingCaseToObject(panel.id);

          return (
            <Portal key={iteration} node={panel}>
              <InteractivePanel
                panelKey={panelConfig.key}
                questionCompleteness={questionCompleteness}
                convincedState={convincedState}
                subQuestionsConvinvedOf={subQuestionsConvinvedOf}
                australiaConvincedOf={australiaConvincedOf}
                userInputState={userInputState}
              />
            </Portal>
          );
        })}
      </>
    </AppContext.Provider>
  );
};

export default App;
