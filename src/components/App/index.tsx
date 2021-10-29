import React, { useEffect, useState, useRef } from "react";
import { Portal } from "react-portal";
import SmoothScroll from "smooth-scroll";
import { selectMounts } from "@abcnews/mount-utils";
import { useDynamicText } from "../../lib/fetchDynamicText";
import DynText from "../DynText";

// Import stylsheets
import styles from "./styles.scss";

// Using the React context API for global state
import { AppContext } from "../../AppContext";

// Import components
import UserInputBox from "../UserInputBox/index";
import BackgroundTexture from "../BackgroundTexture/index";
import MainTangle from "../MainTangle/index";
import ScrollObserver from "../ScrollObserver/index";
import DelayedHeader from "../DelayedHeader/index";
import AudienceChart from "../AudienceChart";
import BarChart from "../BarChart";
import InteractivePanel from "../InteractivePanel";
import EndStrings from "../EndStrings";
import AnchorTransform from "../AnchorTransform";
import SkipAhead from "../SkipAhead";
import ResponsiveParagraphPanel from "../ResponsiveParagraphPanel";

import useWindowSize from "../ParagraphObserver/useWindowSize";
import { Client } from "@abcnews/poll-counters-client";
import alternatingCaseToObject from "@abcnews/alternating-case-to-object";
import to from "await-to-js";

const d3 = { ...require("d3-scale") };

import useReducedMotion from "../../lib/useReducedMotion";

// Set up our poll counter
const GROUP = "interactive-untangling-the-climate-mess";
const pollClient = new Client(GROUP);

const TOP_DOCK_POSITION = 0.01;
const BOTTOM_DOCK_POSITION = 0.9;
const BOTTOM_DOCK_SIDE_BY_SIDE_POSITION = 0.35;

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
// const mainStringMarkers = ["initial", 1];
const endStringsMarkers = [
  "endstrings",
  "userstrings",
  "endallstrings",
  "endaustralia",
  "endstorycomplete"
];

const scroll = new SmoothScroll('a[href*="#"]', {
  offset: (anchor, toggle) => {
    const offset = window.innerHeight * 0.65;
    return offset;
  }
});

interface AppProps {
  projectName: string;
}

let scrollY = 0;
let initialPositioningComplete = false;

const App: React.FC<AppProps> = ({ projectName, ...props }) => {
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

  // So we can use opacity in an event listener or setTimeout
  const setMainTangleOpacity = data => {
    mainTangleOpacityRef.current = data;
    _setMainTangleOpacity(data);
  };

  const [mainTangleXPos, setMainTangleXPos] = useState(0);
  const [mainTangleYPos, setMainTangleYPos] = useState(1.1);
  const [mainTangleScale, setMainTangleScale] = useState(100);
  const [renderMainTangle, setRenderMainTangle] = useState(false);

  const [endTangleOpacity, setEndTangleOpacity] = useState(0.0);
  const [endStrings, setEndStrings] = useState({});
  const [userStrings, setUserStrings] = useState({
    renewables: 1,
    transportation: 1,
    industry: 1,
    livestock: 1
  });
  const [australiaStrings, setAustraliaStrings] = useState({
    renewables: 1,
    transportation: 1,
    industry: 1,
    livestock: 1
  });
  const [interactivePanelElements, setInteractivePanelElements]: [any, any] =
    useState();

  // User input state ----------------
  const [questionCompleteness, setQuestionCompleteness] = useState("nothing");
  const [convincedState, setConvincedState] = useState("orange");
  const [subQuestionsConvinvedOf, setSubQuestionsConvinvedOf] = useState(0);
  // ----------------
  const [australiaConvincedOf, setAustraliaConvincedOf] = useState(0);

  // Used to wait for transforms before intersection observing
  const [transformsComplete, setTransformsComplete] = useState(false);

  // Percentages of Australians convinced
  const [energyConvinced, setEnergyConvinced] = useState(0);
  const [livestockConvinced, setLiveStockConvinced] = useState(0);
  const [transportConvinced, setTransportConvinced] = useState(0);
  const [industryConvinced, setIndustryConvinced] = useState(0);

  // Used to test if the user has actively engaged with the article
  // (whether that is by reading it or clicking on a button, etc)
  // Immediately invoking this effect just because it will only be used once.
  const [userHasEngaged, setUserHasEngaged] = useState(false);

  const { dynamicText, dynamicTextLoading, dynamicTextError } =
    useDynamicText();

  // Reduce motion. Both native and manual
  const [manualReduceMotion, setManualReduceMotion] = useState(false);

  // Detect reduced motion a11y settings
  const prefersReducedMotion = useReducedMotion(false);

  useEffect(() => {
    setManualReduceMotion(prefersReducedMotion);
  }, [prefersReducedMotion]);

  console.log("Manual reduced motion:", manualReduceMotion);

  const mounts = selectMounts("skipahead", { includeOwnUsed: true });

  useEffect(() => {
    if (!userHasEngaged) return;

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

  const [numberOfEngagedUsers, setNumberOfEngagedUsers] = useState(0);

  // Track if we are on Desktop or not
  const [isDesktop, setIsDesktop] = useState(false);

  // Switch between pull left (Tim) and centered (Ben) opening
  const [openingCentered, setOpeningCentered] = useState(true);
  const [isPastOpening, setIsPastOpening] = useState(false);

  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  const windowSize = useWindowSize();

  const onScrollUpdate = () => {
    scrollY = window.pageYOffset;

    // Only process when user at top
    if (scrollY > window.innerHeight * 2 || mainTangleOpacityRef.current < 0.9)
      return;

    const percentScale = d3
      .scaleLinear()
      .domain([0, window.innerHeight])
      .range([
        openingCentered
          ? BOTTOM_DOCK_POSITION
          : BOTTOM_DOCK_SIDE_BY_SIDE_POSITION,
        TOP_DOCK_POSITION
      ])
      .clamp(true);

    setMainTangleYPos(percentScale(scrollY));
  };

  const applySkipAhead = async (
    questionSkipped: string,
    convincedState: string = "hopeful"
  ) => {
    if (!questionSkipped) return;

    // When a user skips down the page,
    // that means they are probably "convinced"
    // So out of the possible options "certain" "hopeful" "doubtful" "impossible"
    // Let's set "hopeful" (possibly "certain")
    // It should come out binary in the end anyway
    // UPDATE: WE ARE GOING BINARY FOR SUBQUESTIONS NOW
    // SO LET'S DO THIS!!!
    setUserInputState(prevState => {
      return { ...prevState, [questionSkipped]: convincedState };
    });

    const result = await pollIncrement({
      question: questionSkipped,
      answer: convincedState
    });
  };

  // onMount
  useEffect(() => {
    pollGet().then((result: any) => {
      const values = result.value;

      if (!values) return;

      const pollTotals: any = {};

      // If more people are convinced than unconvinced then remove string
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

      setAustraliaStrings(pollTotals);

      // Count how many areas Australia is convinced of
      // For later comparison in interactive panels
      let localAusConvinced = 0;

      for (const area in pollTotals) {
        if (pollTotals[area] === 0) localAusConvinced++;
      }

      setAustraliaConvincedOf(localAusConvinced);

      // Get percentages of people convinced
      const getPercentageConvinced = (keyString: string, values: any) => {
        const certainOn: number = values[keyString].certain || 0;
        const hopefulOn: number = values[keyString].hopeful || 0;
        const doubtfulOn: number = values[keyString].doubtful || 0;
        const impossibleOn: number = values[keyString].impossible || 0;

        // Get number convinced
        const convincedCount: number = certainOn + hopefulOn;
        const unconvincedCount: number = doubtfulOn + impossibleOn;

        // Calculate percentages

        const total: number = convincedCount + unconvincedCount;
        const percentConvinced: number = (convincedCount / total) * 100;

        return Math.round(percentConvinced);
      };

      setEnergyConvinced(
        getPercentageConvinced("SUBQ1-renewables-zero-carbon", values)
      );
      setLiveStockConvinced(
        getPercentageConvinced("SUBQ2-livestock-emissions", values)
      );
      setTransportConvinced(
        getPercentageConvinced("SUBQ3-transportation-off-fossil", values)
      );
      setIndustryConvinced(
        getPercentageConvinced("SUBQ4-industry-emissions", values)
      );
    });

    document.addEventListener("scroll", onScrollUpdate);
    // subscribe(onScrollUpdate);

    // Set up interactive panel elements
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

    (async () => {
      // Get number of engaged users from Firebase
      const [err, pollGetResponse]: [any, any] = await to(
        pollGet({
          question: "USERINFO",
          answer: "engagement-count"
        })
      );

      if (!err) {
        setNumberOfEngagedUsers(pollGetResponse.value);
      }
    })();

    // Unhide the app when loaded
    const content = document.querySelector("#content");
    if (content) {
      content.classList.add("visible");
    }

    // This was just a test to try to fix a Chrome bug.
    // But may as well stagger loading of MainTangle anyway?
    // setTimeout(() => {
    setRenderMainTangle(true);
    // }, 5000);

    return () => {
      // unsubscribe(onScrollUpdate);
      document.removeEventListener("scroll", onScrollUpdate);
    };
  }, []);

  // USED TO START TANGLE AT BOTTOM OF SCREEN AT FIRST
  // WE ARE TRYING TO MOVE THIS FUNCTIONALITY INTO THE MAIN TANGLE
  // COMPONENT
  useEffect(() => {
    if (!backgroundIsRendered) return;

    setTimeout(() => {
      // Wait a while before we bring in the tangle
      setTimeout(() => {
        if (markerRef.current === "initial")
          setMainTangleYPos(
            openingCentered
              ? BOTTOM_DOCK_POSITION
              : BOTTOM_DOCK_SIDE_BY_SIDE_POSITION
          );
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

    setUserStrings(nextUserStrings);

    // Count up number user convinced by
    // I DON'T THINK THIS IS WORKING
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
        state["SUBQ4-industry-emissions"]
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

    if (marker === 19) {
      // Hide main tangle for performance sake
      // after a certain point
      setEndTangleOpacity(0.0);
      setMainTangleOpacity(1.0);
    }

    // Primarily for scrolling back up. We un-hide the main tangle
    // And hide the end tangle.
    if (marker === 20) {
      setMainTangleOpacity(1.0);
      setEndStrings({
        renewables: 0,
        transportation: 0,
        industry: 0,
        livestock: 0
      });
    }

    // Make end strings visible if needed
    if (endStringsMarkers.includes(marker)) setEndTangleOpacity(1.0);
    else setEndTangleOpacity(0.0);

    // mechanism for bringing in appropriate strings
    if (marker === "endstrings") {
      // setMainTangleOpacity(0.0);

      setEndStrings({
        renewables: 0,
        transportation: 0,
        industry: 0,
        livestock: 0
      });
    }

    if (marker === "endallstrings") {
      setMainTangleOpacity(0.0);
      setEndStrings({
        renewables: 1,
        transportation: 1,
        industry: 1,
        livestock: 1
      });
    }

    if (marker === "userstrings") {
      setMainTangleOpacity(0.0);
      setEndStrings(userStrings);
    }

    if (marker === "endaustralia") {
      setMainTangleOpacity(0.0);
      setEndStrings(australiaStrings);
    }

    // TODO: work out if we want to hide strings at the end
    // Don't hide for now
    // if (marker === "endstorycomplete") {
    //   setEndStrings({
    //     renewables: 0,
    //     transportation: 0,
    //     carboncapture: 0,
    //     industry: 0,
    //     livestock: 0
    //   });
    // }

    // If user has scrolled enough, set them as has engaged
    if (marker === 2) {
      setUserHasEngaged(true);
    }

    console.log("Current marker", marker);
  }, [marker]);

  useEffect(() => {
    if (!windowSize) return;

    const { width, height } = windowSize;

    // On Desktop
    if (width >= 1200) {
      if (openingCentered) {
        if (isPastOpening) setMainTangleXPos(-0.25);
        if (!isPastOpening) setMainTangleXPos(0.0);
      } else {
        setMainTangleXPos(-0.25);
      }
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
      setMainTangleXPos(0.0);
    }
  }, [windowSize.width, windowSize.height, isPastOpening]);

  const subq1ShowAfterPanel = userInputState => {
    const showState: any = { show: false, optimistic: null };
    if (userInputState["SUBQ1-renewables-zero-carbon"] === "hopeful") {
      showState.show = true;
      showState.optimistic = true;
    }

    if (userInputState["SUBQ1-renewables-zero-carbon"] === "doubtful") {
      showState.show = true;
      showState.optimistic = false;
    }

    return showState;
  };

  const subq2ShowAfterPanel = userInputState => {
    const showState: any = { show: false, optimistic: null };

    if (userInputState["SUBQ2-livestock-emissions"] === "hopeful") {
      showState.show = true;
      showState.optimistic = true;
    }

    if (userInputState["SUBQ2-livestock-emissions"] === "doubtful") {
      showState.show = true;
      showState.optimistic = false;
    }

    return showState;
  };

  const subq3ShowAfterPanel = userInputState => {
    const showState: any = { show: false, optimistic: null };

    if (userInputState["SUBQ3-transportation-off-fossil"] === "hopeful") {
      showState.show = true;
      showState.optimistic = true;
    }

    if (userInputState["SUBQ3-transportation-off-fossil"] === "doubtful") {
      showState.show = true;
      showState.optimistic = false;
    }

    return showState;
  };

  const subq4ShowAfterPanel = userInputState => {
    const showState: any = { show: false, optimistic: null };

    if (userInputState["SUBQ4-industry-emissions"] === "hopeful") {
      showState.show = true;
      showState.optimistic = true;
    }

    if (userInputState["SUBQ4-industry-emissions"] === "doubtful") {
      showState.show = true;
      showState.optimistic = false;
    }

    return showState;
  };

  return (
    <AppContext.Provider value={{ topAbove, setTopAbove }}>
      {/* Just a line down the center of the screen for testing */}
      {/* <div className={styles.centerHint}></div> */}

      {document?.querySelector(".delayed-header") && (
        <Portal node={document && document.querySelector(".delayed-header")}>
          <DelayedHeader
            setTransformsComplete={setTransformsComplete}
            openingCentered={openingCentered}
            isDesktop={isDesktop}
            setIsPastOpening={setIsPastOpening}
          />
        </Portal>
      )}

      <Portal node={document && document.getElementById("inputtier1")}>
        <UserInputBox
          color={"#2A4059"}
          questionKey="MAINQ1-can-we-still-save-the-world"
          preTitle={<DynText>{dynamicText["MAINQ1-pre-title"]}</DynText>}
          title={<DynText>{dynamicText["MAINQ1-title"]}</DynText>}
          /* Can we still save the world? */
          buttons={[
            {
              label: "Of course we can",
              value: "certain",
              response: <DynText>{dynamicText["MAINQ1-optimistic"]}</DynText>
            },
            {
              label: "Yes I think we can",
              value: "hopeful",
              response: <DynText>{dynamicText["MAINQ1-optimistic"]}</DynText>
            },
            {
              label: "Probably not",
              value: "doubtful",
              response: <DynText>{dynamicText["MAINQ1-pessimistic"]}</DynText>
            },
            {
              label: "We've got no chance",
              value: "impossible",
              response: <DynText>{dynamicText["MAINQ1-pessimistic"]}</DynText>
            }
          ]}
          userInputState={userInputState}
          setUserInputState={setUserInputState}
          pollClient={pollClient}
          windowWidth={windowSize.width}
        />
      </Portal>

      {/* Energy questions */}

      <Portal node={document && document.getElementById("inputzerocarbon")}>
        <UserInputBox
          color={"#F65C1B"}
          questionKey="SUBQ1-renewables-zero-carbon"
          preTitle={<DynText>{dynamicText["SUBQ1-pre-title"]}</DynText>}
          title={<DynText>{dynamicText["SUBQ1-title"]}</DynText>}
          /* So - what do you reckon our chances of doing this are? */
          buttons={[
            {
              label: "It can be done",
              value: "hopeful",
              response: <DynText>{dynamicText["SUBQ1-optimistic"]}</DynText>
            },
            {
              label: "This sounds like a stretch",
              value: "doubtful",
              response: <DynText>{dynamicText["SUBQ1-pessimistic"]}</DynText>
            }
          ]}
          userInputState={userInputState}
          setUserInputState={setUserInputState}
          pollClient={pollClient}
          windowWidth={windowSize.width}
        />
      </Portal>

      {/* Livestock user input here */}
      {/* inputlivestockemissions */}

      <Portal
        node={document && document.getElementById("inputlivestockemissions")}
      >
        <UserInputBox
          color={"#007B52"}
          questionKey="SUBQ2-livestock-emissions"
          preTitle={<DynText>{dynamicText["SUBQ2-pre-title"]}</DynText>}
          title={<DynText>{dynamicText["SUBQ2-title"]}</DynText>}
          /* Can we reach reach zero livestock emissions? */
          buttons={[
            // {
            //   label: "That's a piece of cake",
            //   value: "certain",
            //   response: <DynText>{dynamicText["SUBQ2-optimistic"]}</DynText>
            // },
            {
              label: "It can be done",
              value: "hopeful",
              response: <DynText>{dynamicText["SUBQ2-optimistic"]}</DynText>
            },
            {
              label: "This sounds like a stretch",
              value: "doubtful",
              response: <DynText>{dynamicText["SUBQ2-pessimistic"]}</DynText>
            }
            // {
            //   label: "You're dreaming",
            //   value: "impossible",
            //   response: <DynText>{dynamicText["SUBQ2-pessimistic"]}</DynText>
            // }
          ]}
          userInputState={userInputState}
          setUserInputState={setUserInputState}
          pollClient={pollClient}
          windowWidth={windowSize.width}
        />
      </Portal>

      <Portal
        node={document && document.getElementById("inputfossiltransport")}
      >
        <UserInputBox
          color={"#007cbf"}
          questionKey="SUBQ3-transportation-off-fossil"
          preTitle={<DynText>{dynamicText["SUBQ3-pre-title"]}</DynText>}
          title={<DynText>{dynamicText["SUBQ3-title"]}</DynText>}
          /* So now you know how we quit fossil fuels in our transport system, can we do it? */
          buttons={[
            // {
            //   label: "That's a piece of cake",
            //   value: "certain",
            //   response: <DynText>{dynamicText["SUBQ3-optimistic"]}</DynText>
            // },
            {
              label: "It can be done",
              value: "hopeful",
              response: <DynText>{dynamicText["SUBQ3-optimistic"]}</DynText>
            },
            {
              label: "This sounds like a stretch",
              value: "doubtful",
              response: <DynText>{dynamicText["SUBQ3-pessimistic"]}</DynText>
            }
            // {
            //   label: "You're dreaming",
            //   value: "impossible",
            //   response: <DynText>{dynamicText["SUBQ3-pessimistic"]}</DynText>
            // }
          ]}
          userInputState={userInputState}
          setUserInputState={setUserInputState}
          pollClient={pollClient}
          windowWidth={windowSize.width}
        />
      </Portal>

      {/* Industry input buttons go here */}
      {/* inputindustryemissions */}
      <Portal
        node={document && document.getElementById("inputindustryemissions")}
      >
        <UserInputBox
          color={"#2A4059"}
          questionKey="SUBQ4-industry-emissions"
          preTitle={<DynText>{dynamicText["SUBQ4-pre-title"]}</DynText>}
          title={<DynText>{dynamicText["SUBQ4-title"]}</DynText>}
          buttons={[
            // {
            //   label: "That's a piece of cake",
            //   value: "certain",
            //   response: <DynText>{dynamicText["SUBQ4-optimistic"]}</DynText>
            // },
            {
              label: "It can be done",
              value: "hopeful",
              response: <DynText>{dynamicText["SUBQ4-optimistic"]}</DynText>
            },
            {
              label: "This sounds like a stretch",
              value: "doubtful",
              response: <DynText>{dynamicText["SUBQ4-pessimistic"]}</DynText>
            }
            // {
            //   label: "You're dreaming",
            //   value: "impossible",
            //   response: <DynText>{dynamicText["SUBQ4-pessimistic"]}</DynText>
            // }
          ]}
          userInputState={userInputState}
          setUserInputState={setUserInputState}
          pollClient={pollClient}
          windowWidth={windowSize.width}
        />
      </Portal>

      {document.getElementById("chartproportions") && (
        <Portal node={document && document.getElementById("chartproportions")}>
          <BarChart
            bars={[
              {
                title: "Electricity",
                percent: 33,
                color: "#F65C1B", // Orange
                textColor: "#C42F05" // Text orange
              },
              {
                title: "Agriculture",
                percent: 10,
                color: "#007B52", // Green
                textColor: "#007B52"
              },
              {
                title: "Transport",
                percent: 20,
                color: "#007CBF", // Light blue
                textColor: "#007CBF"
              },
              {
                title: "Industry",
                percent: 40,
                color: "#2A4059", // Dark blue
                textColor: "#2A4059"
              }
            ]}
          />
        </Portal>
      )}

      <Portal node={document && document.getElementById("chartconvinced")}>
        <AudienceChart
          bars={[
            {
              title: "Electricity",
              percent: energyConvinced,
              color: "#F65C1B", // Orange
              textColor: "#C42F05" // Text orange
            },
            {
              title: "Agriculture",
              percent: livestockConvinced,
              color: "#007B52", // Green
              textColor: "#007B52"
            },
            {
              title: "Transport",
              percent: transportConvinced,
              color: "#007CBF", // Light blue
              textColor: "#007CBF"
            },
            {
              title: "Industry",
              percent: industryConvinced,
              color: "#2A4059", // Dark blue
              textColor: "#2A4059"
            }
          ]}
          windowWidth={windowSize.width}
        ></AudienceChart>
      </Portal>

      {/* Background visual */}
      <Portal node={document && document.getElementById("portalmount")}>
        {/* Don't unmount this because elements are being observed by ParagraphObserver
        and they get lost otherwise.
          Maybe try visibility hidden or display none instead */}
        {renderMainTangle && (
          <MainTangle
            scrollMarker={marker}
            setBackgroundIsRendered={setBackgroundIsRendered}
            opacity={mainTangleOpacity}
            xPos={mainTangleXPos}
            yPos={mainTangleYPos}
            scale={mainTangleScale}
            windowSize={windowSize}
          />
        )}

        <EndStrings
          opacity={endTangleOpacity}
          stringsNew={endStrings}
          windowSize={windowSize}
          xPos={mainTangleXPos}
          yPos={0.18}
        />
        <BackgroundTexture />
      </Portal>

      {/* Sets paragraph text where we break out of 
        scrolly panels (and hide background animations on mobile) */}

      {/* Note: rewriting the paragraph panels */}
      {backgroundIsRendered && (
        <>
          {/* A panel that goes over the top with paragraph text on it #paragraphpanel */}
          {/* <ParagraphPanel setMaskPosition={setMainTangleMaskPos} /> */}
          {/* <ParagraphObserver /> */}
          {/* <ParagraphFade setMainTangleOpacity={setMainTangleOpacity} /> */}
          {/* <ParagraphPull
            setMainTangleOpacity={setMainTangleOpacity}
            setMainTangleYPos={setMainTangleYPos}
            mainTangleYPos={mainTangleYPos}
            setMainTangleHidden={setMainTangleHidden}
          /> */}
          <ResponsiveParagraphPanel />
        </>
      )}

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
              dynamicText={dynamicText}
              dynamicTextLoading={dynamicTextLoading}
              userInputState={userInputState}
            />
          </Portal>
        );
      })}

      <AnchorTransform>{numberOfEngagedUsers.toLocaleString()}</AnchorTransform>

      {/* Optimistic downpage panel */}
      {subq1ShowAfterPanel(userInputState).show &&
        document.querySelector("#subq1responsepanel") &&
        dynamicText["SUBQ1-optimistic-downpage"] &&
        subq1ShowAfterPanel(userInputState).optimistic && (
          <Portal node={document.querySelector("#subq1responsepanel")}>
            <DynText>{dynamicText["SUBQ1-optimistic-downpage"]}</DynText>
          </Portal>
        )}

      {/* Pessimistic downpage panel */}
      {subq1ShowAfterPanel(userInputState).show &&
        document.querySelector("#subq1responsepanel") &&
        dynamicText["SUBQ1-pessimistic-downpage"] &&
        !subq1ShowAfterPanel(userInputState).optimistic && (
          <Portal node={document.querySelector("#subq1responsepanel")}>
            <DynText>{dynamicText["SUBQ1-pessimistic-downpage"]}</DynText>
          </Portal>
        )}

      {/*  */}

      {/* Optimistic downpage panel */}
      {subq2ShowAfterPanel(userInputState).show &&
        document.querySelector("#subq2responsepanel") &&
        dynamicText["SUBQ2-optimistic-downpage"] &&
        subq2ShowAfterPanel(userInputState).optimistic && (
          <Portal node={document.querySelector("#subq2responsepanel")}>
            <DynText>{dynamicText["SUBQ2-optimistic-downpage"]}</DynText>
          </Portal>
        )}

      {/* Pessimistic downpage panel */}
      {subq2ShowAfterPanel(userInputState).show &&
        document.querySelector("#subq2responsepanel") &&
        dynamicText["SUBQ2-pessimistic-downpage"] &&
        !subq2ShowAfterPanel(userInputState).optimistic && (
          <Portal node={document.querySelector("#subq2responsepanel")}>
            <DynText>{dynamicText["SUBQ2-pessimistic-downpage"]}</DynText>
          </Portal>
        )}

      {/*  */}

      {/* Optimistic downpage panel */}
      {subq3ShowAfterPanel(userInputState).show &&
        document.querySelector("#subq3responsepanel") &&
        dynamicText["SUBQ3-optimistic-downpage"] &&
        subq3ShowAfterPanel(userInputState).optimistic && (
          <Portal node={document.querySelector("#subq3responsepanel")}>
            <DynText>{dynamicText["SUBQ3-optimistic-downpage"]}</DynText>
          </Portal>
        )}
      {/* Pessimistic downpage panel */}
      {subq3ShowAfterPanel(userInputState).show &&
        document.querySelector("#subq3responsepanel") &&
        dynamicText["SUBQ3-pessimistic-downpage"] &&
        !subq3ShowAfterPanel(userInputState).optimistic && (
          <Portal node={document.querySelector("#subq3responsepanel")}>
            <DynText>{dynamicText["SUBQ3-pessimistic-downpage"]}</DynText>
          </Portal>
        )}

      {/*  */}

      {/* Optimistic downpage panel */}
      {subq4ShowAfterPanel(userInputState).show &&
        document.querySelector("#subq4responsepanel") &&
        dynamicText["SUBQ4-optimistic-downpage"] &&
        subq4ShowAfterPanel(userInputState).optimistic && (
          <Portal node={document.querySelector("#subq4responsepanel")}>
            <DynText>{dynamicText["SUBQ4-optimistic-downpage"]}</DynText>
          </Portal>
        )}

      {/* Pessimistic downpage panel */}
      {subq4ShowAfterPanel(userInputState).show &&
        document.querySelector("#subq4responsepanel") &&
        dynamicText["SUBQ4-pessimistic-downpage"] &&
        !subq4ShowAfterPanel(userInputState).optimistic && (
          <Portal node={document.querySelector("#subq4responsepanel")}>
            <DynText>{dynamicText["SUBQ4-pessimistic-downpage"]}</DynText>
          </Portal>
        )}

      <ScrollObserver
        setMarker={setMarker}
        setMainTangleYPos={setMainTangleYPos}
        setMainTangleXPos={setMainTangleXPos}
        waypoint={80}
        transformsComplete={transformsComplete}
        isDesktop={isDesktop}
      />

      {mounts.map((mount, index) => {
        return (
          <Portal key={index} node={mount}>
            <SkipAhead
              mount={mount}
              scroll={scroll}
              applySkipAhead={applySkipAhead}
              windowWidth={windowSize.width}
            />
          </Portal>
        );
      })}
    </AppContext.Provider>
  );
};

export default App;
