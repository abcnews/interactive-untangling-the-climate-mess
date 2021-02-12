import React, { useEffect, useState } from "react";
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
const GROUP = "__example__";
const QUESTION = "x";
const ANSWER = "y";

const pollClient = new Client(GROUP);

const endStringsMarkers = ["endstrings"];

interface AppProps {
  projectName: string;
}

const App: React.FC<AppProps> = ({ projectName }) => {
  const [backdropOffset, setBackdropOffset] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(200);
  const [marker, setMarker] = useState<any>();
  const [paragraphTextVisible, setParagraphTextVisible] = useState(false);
  const [userInputState, setUserInputState] = useState({});
  const [topAbove, setTopAbove] = useState();
  const [backgroundIsRendered, setBackgroundIsRendered] = useState();
  const [mainTangleOpacity, setMainTangleOpacity] = useState(1.0);
  const [endTangleOpacity, setEndTangleOpacity] = useState(0.0);
  const [stringsNew, setStringsNew] = useState({});

  useEffect(() => {
    console.log("App mounted...");

    // setTimeout(() => {
    //   setStringsNew({ one: 1, two: 0, three: 1, four: 0, five: 0 });
    // }, 3000);

    // setTimeout(() => {
    //   setStringsNew({ one: 0, two: 0, three: 0, four: 0, five: 1 });
    // }, 5000);

    // setTimeout(() => {
    //   setStringsNew({ one: 0, two: 0, three: 0, four: 0, five: 0 });
    // }, 8000);
  }, []);

  useEffect(() => {
    if (!userInputState) return;

    console.log(userInputState);
  }, [userInputState]);

  useEffect(() => {
    if (!marker) return;

    console.log(marker);

    if (marker === "endstrings") {
      setEndTangleOpacity(1.0);
      setTimeout(() => {
        setStringsNew({ one: 1, two: 1, three: 1, four: 1, five: 1 });
      }, 100);
    } else {
      setEndTangleOpacity(0.0);
      setStringsNew({ one: 0, two: 0, three: 0, four: 0, five: 0 });
    }
  }, [marker]);

  return (
    <AppContext.Provider value={{ topAbove, setTopAbove }}>
      <>
        <Portal node={document && document.querySelector(".delayed-header")}>
          <DelayedHeader />
        </Portal>

        <Portal node={document && document.getElementById("inputtier1")}>
          <UserInputBox
            questionKey="tier1"
            title={"Can we still save the world?"}
            buttons={[
              { label: "Of course we can", value: "1" },
              { label: "Yes I think we can", value: "2" },
              { label: "Probably not", value: "3" },
              { label: "No way we're screwed", value: "4" },
            ]}
            poll={pollClient}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputradelaide")}>
          <UserInputBox
            questionKey="radelaide"
            title={"Still laughing at South Australia?"}
            buttons={[
              { label: "No, good one Radelaide", value: "1" },
              { label: "Yes, they speak funny", value: "2" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputtoast")}>
          <UserInputBox
            questionKey="toast"
            title={
              "So what do you reckon, can you have your toast in a zero carbon world and eat it too?"
            }
            buttons={[
              { label: "Yeah", value: "1" },
              { label: "Nah", value: "2" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputzerocarbon")}>
          <UserInputBox
            questionKey="zerocarbon"
            title={"So - what do you reckon our chances of doing this are?"}
            buttons={[
              { label: "That's a piece of cake", value: "1" },
              { label: "It can be done", value: "2" },
              { label: "This sounds like a stretch", value: "3" },
              { label: "You're dreaming", value: "4" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputcarscansaveus")}>
          <UserInputBox
            questionKey="carscansaveus"
            title={"So how are you feeling about EVs now?"}
            buttons={[
              { label: "CARS CAN SAVE US", value: "1" },
              { label: "UTEPOCALYPSE IS NIGH", value: "2" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputfossiltransport")}>
          <UserInputBox
            questionKey="fossiltransport"
            title={
              "So now you know how we quit fossil fuels in our transport system, can we do it?"
            }
            buttons={[
              { label: "That's a piece of cake", value: "1" },
              { label: "It can be done", value: "2" },
              { label: "This sounds like a stretch", value: "3" },
              { label: "You're dreaming", value: "4" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputbigseaweed")}>
          <UserInputBox
            questionKey="bigseaweed"
            title={"Where are you splashing your cash?"}
            buttons={[
              { label: "BIG SEAWEED", value: "1" },
              { label: "BIG FOSSIL", value: "2" },
            ]}
            setUserInputState={setUserInputState}
          />
        </Portal>

        <Portal node={document && document.getElementById("inputmosquito")}>
          <UserInputBox
            questionKey="mosquito"
            title={"What should we be?"}
            buttons={[
              { label: "MOSQUITO", value: "1" },
              { label: "DUNG BEETLE", value: "2" },
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
          {marker && !endStringsMarkers.includes(marker) && (
            <MainTangle
              animationFrame={animationFrame}
              scrollMarker={marker}
              yOffset={backdropOffset}
              setBackgroundIsRendered={setBackgroundIsRendered}
              opacity={mainTangleOpacity}
            />
          )}

          {endTangleOpacity > 0.0 && (
            <EndStrings opacity={endTangleOpacity} stringsNew={stringsNew} />
          )}
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
