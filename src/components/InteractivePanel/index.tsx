import React, { useState, useEffect, useRef } from "react";
import { useDynamicText } from "../../lib/fetchDynamicText";
import Markdown from "markdown-to-jsx";

import styles from "./styles.scss";

import BarChart from "../BarChart";

import background from "../OrganicPanel/organic-panel-background-variation-1.svg";
import background2 from "../OrganicPanel/organic-panel-background-variation-2.svg";
import background3 from "../OrganicPanel/organic-panel-background-variation-3.svg";

const backgrounds = [background, background2, background3];

type InteractivePanelProps = {
  panelKey;
  questionCompleteness;
  convincedState;
  subQuestionsConvinvedOf: number;
  australiaConvincedOf: number;
  userInputState;
  backgroundVariation?: number;
};

const InteractivePanel: React.FC<InteractivePanelProps> = ({
  backgroundVariation = 0,
  ...props
}) => {
  const rootRef = useRef(null);

  // Deconstruct props
  const {
    panelKey,
    questionCompleteness,
    convincedState,
    subQuestionsConvinvedOf,
    australiaConvincedOf,
    userInputState
  } = props;

  const {
    dynamicText,
    dynamicTextLoading,
    dynamicTextError
  } = useDynamicText();
  // console.log("dt", dynamicText);

  const [hidden, setHidden] = useState(false);
  const [panelText, setPanelText] = useState(
    <p>
      Panel initial state (if you're seeing this text in article, please contact
      byrd.joshua@abc.net.au). Thanks!
    </p>
  );

  // TODO: Maybe make these functions return React components?

  function getLevel2Text(convincedState, userInputState) {
    if (convincedState === "green")
      return <Markdown>{dynamicText["LEVEL2-green"]}</Markdown>;
    if (convincedState === "orange") {
      if (
        userInputState["MAINQ1-can-we-still-save-the-world"] === "certain" ||
        userInputState["MAINQ1-can-we-still-save-the-world"] === "hopeful" ||
        userInputState[
          "MAINQ2-can-we-still-save-the-world-again-after-article"
        ] === "certain" ||
        userInputState[
          "MAINQ2-can-we-still-save-the-world-again-after-article"
        ] === "hopeful"
      ) {
        return <p>So you still think this can be done.</p>;
      } else {
        return <p>It’s OK still not to be convinced, it’s a tricky problem.</p>;
      }
    }

    if (convincedState === "red")
      return <p>So now you’ve read all this you’re less convinced.</p>;
    else return <></>;
  }

  useEffect(() => {
    // KEY
    // questionCompleteness === "noMAIN1noSUBnoMAIN2"  // 1
    // questionCompleteness === "yesMAIN1noSUBnoMAIN2" // 2
    // questionCompleteness === "noMAIN1noSUByesMAIN2" // 3
    // questionCompleteness === "yesMAIN1noSUByesMAIN2" // 4
    // questionCompleteness === "noMAIN1someSUBnoMAIN2" // 5
    // questionCompleteness === "noMAIN1allSUBnoMAIN2" // 6
    // questionCompleteness === "noMAIN1someSUByesMAIN2" // 7
    // questionCompleteness === "noMAIN1allSUByesMAIN2" // 8
    // questionCompleteness === "yesMAIN1someSUByesMAIN2" // 9
    // questionCompleteness === "yesMAIN1allSUByesMAIN2" // 10

    let shouldShow;

    // Were they initially positive?
    let main1Positive =
      userInputState["MAINQ1-can-we-still-save-the-world"] === "certain" ||
      userInputState["MAINQ1-can-we-still-save-the-world"] === "hopeful";

    const main2Positive =
      userInputState[
        "MAINQ2-can-we-still-save-the-world-again-after-article"
      ] === "certain" ||
      userInputState[
        "MAINQ2-can-we-still-save-the-world-again-after-article"
      ] === "hopeful";

    switch (panelKey) {
      case "didntanswer":
        // A panel that displays text and subtly prompts people
        // to maybe go back and answer more
        shouldShow =
          questionCompleteness === "noMAIN1noSUBnoMAIN2" || // 1
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2"; // 6

        if (questionCompleteness === "noMAIN1noSUBnoMAIN2") {
          setPanelText(
            <p>
              You didn’t answer any of the questions but here’s how the rest of
              the audience felt about the piece.
            </p>
          );
        } else {
          // They didn't answer MAIN questions
          setPanelText(
            <p>
              You didn’t tell us whether you thought Australia could get to net
              zero, but here is the impact the things you were convinced by
              would have on our emissions.
            </p>
          );
        }

        break;
      case "incompletefallback":
        shouldShow = questionCompleteness === "yesMAIN1noSUBnoMAIN2"; // 2

        if (main1Positive) {
          setPanelText(
            <p>
              We don’t know if you’re still convinced, as you didn’t answer, but
              here’s how the rest of the audience feel about the piece.
            </p>
          );
        } else if (!main1Positive) {
          setPanelText(
            <p>
              We don’t know if you’re still not convinced, as you didn’t answer,
              but here’s how the rest of the audience feel about the piece.
            </p>
          );
        }

        break;
      case "level2answer":
        shouldShow =
          questionCompleteness === "noMAIN1noSUByesMAIN2" || // 3
          questionCompleteness === "yesMAIN1noSUByesMAIN2" || // 4
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1someSUByesMAIN2" || // 9
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 10

        let level2answer = getLevel2Text(convincedState, userInputState);

        const noSectionText = (
          <p>
            While we don’t know if you’re convinced by any of the challenges,
            here’s what the audience thought.
          </p>
        );

        if (
          questionCompleteness === "noMAIN1noSUByesMAIN2" || // 3
          questionCompleteness === "yesMAIN1noSUByesMAIN2"
        ) {
          //4
          setPanelText(
            <>
              {level2answer} {noSectionText}
            </>
          );
        } else {
          setPanelText(level2answer);
        }

        break;
      case "level3answer":
        shouldShow =
          questionCompleteness === "yesMAIN1noSUByesMAIN2" || // 4
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1someSUByesMAIN2" || // 9
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 10

        // if (
        //   // They didn't answer MAIN questions
        //   questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
        //   questionCompleteness === "noMAIN1allSUBnoMAIN2" // 6
        // ) {
        //   setPanelText(
        //     <p>
        //       You didn’t tell us whether you thought Australia could get to net
        //       zero, but here is the impact the things you were convinced by
        //       would have on our emissions.
        //     </p>
        //   );
        // } else {
        if (subQuestionsConvinvedOf >= 5) {
          // Check if positive outloon on main2 question
          if (main2Positive)
            setPanelText(
              <p>
                Let’s look at what the impact of doing the things you’re
                convinced of would be. If we can pull it off then Australia not
                only gets to net zero, we’ve set the country for a future in
                this zero carbon world.
              </p>
            );
          // Otherwise negative
          else
            setPanelText(
              <p>
                Look even if you don’t think we can pull this off, if we just do
                the things you’re convinced by then Australia not only gets to
                net zero, we’ve set the country for a future in this zero carbon
                world.
              </p>
            );
        }

        //

        if (subQuestionsConvinvedOf == 4) {
          if (main2Positive)
            setPanelText(
              <p>
                Let’s look at what the impact of doing the things you’re
                convinced of would be. If we can pull it off then Australia not
                only gets to net zero, we’ve set the country for a future in
                this zero carbon world.
              </p>
            );
          else
            setPanelText(
              <p>
                Look even if you don’t think we can pull this off, if we just do
                the things you’re convinced by then that puts Australia on track
                to be part of a world that keeps temperatures at or below 1.5
                degrees.
              </p>
            );
        }

        //

        if (subQuestionsConvinvedOf === 3) {
          if (main2Positive)
            setPanelText(
              <p>
                Let’s look at what the impact of doing the things you’re
                convinced of would be. If we can just accomplish them by 2030,
                then that would keep Australia on track to be part of a world
                that keeps temperatures at or below 1.5 degrees.
              </p>
            );
          else
            setPanelText(
              <p>
                Look even if you don’t think we can pull this off, if we can
                just accomplish the things you’re convinced of by 2030, then
                that would keep Australia on track to be part of a world that
                keeps temperatures at or below 1.5 degrees.
              </p>
            );
        }

        //

        if (subQuestionsConvinvedOf === 2) {
          if (main2Positive)
            setPanelText(
              <p>
                Let’s look at what the impact of doing the things you’re
                convinced of would be. Just reducing emissions in this one area
                over the next 5 years would put us on track for the most
                ambitious Paris agreement targets, and give us a chance of
                keeping temperature increases at or below 1.5 degrees.
              </p>
            );
          else
            setPanelText(
              <p>
                We get it, it’s a big problem, but we don’t have to solve it all
                now. Let’s look at what the impact of doing the things you’re
                convinced of would be. Just reducing emissions in this one area
                over the next 5 years would put us on track for the most
                ambitious Paris agreement targets, and give us a chance of
                keeping temperature increases at or below 1.5 degrees.
              </p>
            );
        }

        //

        if (subQuestionsConvinvedOf === 1) {
          if (main2Positive)
            setPanelText(
              <p>
                It’s good that you’re optimistic about Australia getting to net
                zero, even if you’re not sure how we can get there.
              </p>
            );
          else
            setPanelText(
              // TODO: Get Tim to write a proper answer:
              <p>Well, I dunno what to tell ya????</p>
            );
        }

        if (subQuestionsConvinvedOf === 0) {
          setPanelText(
            // TODO: Get Tim to write a proper answer:
            // ALSO BATTLE TEST ALL THE POSSIBLE WAYS OF ANSWERING THE BUTTONS
            <p>You're a tough nut to crack!!!</p>
          );
        }

        // }

        break;
      case "personalresults":
        shouldShow =
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1someSUByesMAIN2" || // 9
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 10

        const isGreyedOut = (key: string) => {
          if (
            userInputState[key] === "certain" ||
            userInputState[key] === "hopeful"
          )
            return true;

          if (
            userInputState[key] === "doubtful" ||
            userInputState[key] === "impossible"
          )
            return false;
        };

        setPanelText(
          <>
            <p>Personal results.</p>
            <BarChart
              bars={[
                {
                  title: "Energy",
                  percent: 33,
                  color: "#A3297C",
                  textColor: "#A3297C",
                  greyedOut: isGreyedOut("SUBQ1-renewables-zero-carbon")
                },
                {
                  title: "Burping cows",
                  percent: 10,
                  color: "#F65C1B",
                  textColor: "#C42F05",
                  greyedOut: isGreyedOut("SUBQ2-livestock-emissions")
                },
                {
                  title: "Transport",
                  percent: 20,
                  color: "#007CBF",
                  textColor: "#007CBF",
                  greyedOut: isGreyedOut("SUBQ3-transportation-off-fossil")
                },
                {
                  title: "Industry",
                  percent: 40,
                  color: "#007B52",
                  textColor: "#007B52",
                  greyedOut: isGreyedOut("SUBQ4-industry-emissions")
                },
                {
                  title: "Carbon capture",
                  percent: 60,
                  color: "#2A4059",
                  textColor: "#2A4059",
                  label: "All the rest",
                  greyedOut: isGreyedOut("SUBQ5-carbon-capture")
                }
              ]}
            />
          </>
        );
        break;
      case "ausvself":
        shouldShow =
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1someSUByesMAIN2" || // 9
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 10

        console.log(
          "You convinced:",
          subQuestionsConvinvedOf,
          "Aus convinced:",
          australiaConvincedOf,
          "Convinced state:",
          convincedState
        );

        if (subQuestionsConvinvedOf > australiaConvincedOf)
          setPanelText(
            <p>
              You’re more optimistic we can solve these challenges than most of
              our readers, but even if we just reduce emissions in the areas
              they’re convinced by, we’d still be on track for the most
              ambitious Paris agreements.
            </p>
          );
        else if (subQuestionsConvinvedOf === australiaConvincedOf)
          setPanelText(
            <p>
              The good news is that most people who read this story agree with
              you.
            </p>
          );
        else if (subQuestionsConvinvedOf < australiaConvincedOf)
          setPanelText(
            <p>
              Your fellow Australians are more optimistic than you. They’re
              convinced we can do X, which would keep us on track for the most
              ambitious Paris agreement B.
            </p>
          );
        break;
    }
    console.log("Subquestions convinced of", subQuestionsConvinvedOf);

    // Show if incomplete
    if (shouldShow) setHidden(false);
    // Otherwise hide
    else setHidden(true);
  }, [
    userInputState,
    questionCompleteness,
    subQuestionsConvinvedOf,
    australiaConvincedOf,
    convincedState
  ]);

  useEffect(() => {
    if (!hidden) return;

    if (rootRef.current) {
      const currentEl: any = rootRef.current;

      currentEl.parentElement.style = {};
    }
  }, [hidden]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${hidden ? styles.hidden : ""}`}
    >
      <div className={styles.panelContentContainer}>
        <div className={styles.background}>
          <img
            src={backgrounds[backgroundVariation]}
            className={styles.stretch}
          />
        </div>
        {panelText}
      </div>
    </div>
  );
};

export default InteractivePanel;
