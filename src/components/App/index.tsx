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
import DelayedHeader from "../DelayedHeader/index";

import { Client } from "@abcnews/poll-counters-client";

// Using the React context API for global state
import { AppContext } from "../../AppContext";

// Other imports etc.
import EndStrings from "../EndStrings";
import BarChart from "../BarChart/index";

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

const endStringsMarkers = ["endstrings"];

interface AppProps {
  projectName: string;
}

const App: React.FC<AppProps> = ({ projectName }) => {
  const [backdropOffset, setBackdropOffset] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(200);
  const [marker, setMarker] = useState<any>();
  const [userInputState, setUserInputState] = useState({});
  const [topAbove, setTopAbove] = useState();
  const [backgroundIsRendered, setBackgroundIsRendered] = useState();
  const [mainTangleOpacity, setMainTangleOpacity] = useState(1.0);
  const [endTangleOpacity, setEndTangleOpacity] = useState(0.0);
  const [stringsNew, setStringsNew] = useState({});

  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  // async function registerUserInput(questionId, answerCode) {
  //   const [err, result] = await to(
  //     debouncedPollIncrement({
  //       question: questionId,
  //       answer: answerCode,
  //     })
  //   );

  //   if (err) console.error(err);
  //   if (result) console.log(result);
  // }

  useEffect(() => {
    console.log("App mounted...");
  }, []);

  useEffect(() => {
    if (!userInputState) return;

    console.log("user input:", userInputState);
  }, [userInputState]);

  useEffect(() => {
    if (!marker) return;

    console.log("Marker from App effect:", marker);

    // TODO: make mechanism for bringing in appropriate strings
    // if (marker === "endstrings") {
    //   setEndTangleOpacity(1.0);
    //   setTimeout(() => {
    //     setStringsNew({ one: 1, two: 1, three: 1, four: 1, five: 1 });
    //   }, 100);
    // } else {
    //   setEndTangleOpacity(0.0);
    //   setStringsNew({ one: 0, two: 0, three: 0, four: 0, five: 0 });
    // }
  }, [marker]);

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
              { label: "No way we're screwed", value: "impossible" },
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
              { label: "Yes, they speak funny", value: "negative" },
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
              { label: "Nah", value: "negative" },
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
              { label: "You're dreaming", value: "impossible" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        {/* Livestock user input here */}
        {/* inputlivestockemissions */}

        <Portal node={document && document.getElementById("inputlivestockemissions")}>
          <UserInputBox
            questionKey="SUBQ2-livestock-emissions"
            title={"Can we reach reach zero livestock emissions?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputcarscansaveus")}>
          <UserInputBox
            questionKey="ASIDE3-electric-vehicles"
            title={"So how are you feeling about EVs now?"}
            buttons={[
              { label: "CARS CAN SAVE US", value: "positive" },
              { label: "UTEPOCALYPSE IS NIGH", value: "negative" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputfossiltransport")}>
          <UserInputBox
            questionKey="SUBQ3-transportation-off-fossil"
            title={
              "So now you know how we quit fossil fuels in our transport system, can we do it?"
            }
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        {/* Industry input buttons go here */}
        {/* inputindustryemissions */}
        <Portal node={document && document.getElementById("inputindustryemissions")}>
          <UserInputBox
            questionKey="SUBQ4-industry-emissions"
            title={"Can we elliminate emissions from industry?"}
            buttons={[
              { label: "That's a piece of cake", value: "certain" },
              { label: "It can be done", value: "hopeful" },
              { label: "This sounds like a stretch", value: "doubtful" },
              { label: "You're dreaming", value: "impossible" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputbigseaweed")}>
          <UserInputBox
            questionKey="ASIDE4-seaweed-carbon-capture"
            title={"Where are you splashing your cash?"}
            buttons={[
              { label: "BIG SEAWEED", value: "positive" },
              { label: "BIG FOSSIL", value: "negative" },
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
              { label: "DUNG BEETLE", value: "positive" },
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
              { label: "No way we're screwed", value: "impossible" },
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
              { title: "Industry", percent: 40, color: "#ff4e00" },
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
            yOffset={backdropOffset}
            setBackgroundIsRendered={setBackgroundIsRendered}
            opacity={mainTangleOpacity}
          />
          {/* )} */}

          <EndStrings opacity={endTangleOpacity} stringsNew={stringsNew} />
        </Portal>

        <BackgroundTexture />

        <ScrollObserver setMarker={setMarker} />

        {/* Sets paragraph text where we break out of 
        scrolly panels (and hide background animations on mobile) */}
        {backgroundIsRendered && <ParagraphObserver setYOffset={setBackdropOffset} />}

        {/* Just a line down the center of the screen for testing */}
        {/* <div className={styles.centerHint} /> */}
      </>
    </AppContext.Provider>
  );
};

export default App;
