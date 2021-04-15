import React, { useState, useEffect } from "react";
import styles from "./styles.scss";

type InteractivePanelProps = {
  panelKey;
  questionCompleteness;
  convincedState;
  subQuestionsConvinvedOf;
  australiaConvincedOf;
  userInputState;
};

const InteractivePanel: React.FC<InteractivePanelProps> = props => {
  // Deconstruct props
  const {
    panelKey,
    questionCompleteness,
    convincedState,
    subQuestionsConvinvedOf,
    australiaConvincedOf,
    userInputState
  } = props;

  const [hidden, setHidden] = useState(false);
  const [panelText, setPanelText] = useState("<DEFAULT PANEL TEXT>");

  // TODO: Maybe make these functions return React components?

  function getLevel2Text(convincedState, userInputState) {
    if (convincedState === "green")
      return "So you’re more positive than at the start, that’s something.";
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
        return "So you still think this can be done.";
      } else {
        return "It’s OK still not to be convinced, it’s a tricky problem.";
      }
    }

    if (convincedState === "red")
      return "So now you’ve read all this you’re less convinced.";
  }

  // onMount
  useEffect(() => {}, []);

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
    // questionCompleteness === "yesMAIN1allSUByesMAIN2" // 9

    let shouldShow;

    switch (panelKey) {
      case "didntanswer":
        // A panel that displays text and subtly prompts people
        // to maybe go back and answer more
        shouldShow = questionCompleteness === "noMAIN1noSUBnoMAIN2"; // 1 ||
        // questionCompleteness === "yesMAIN1noSUBnoMAIN2";

        setPanelText(
          "You didn’t answer any of the questions but here’s how the \
          rest of the audience felt about the piece."
        );

        break;
      case "incompletefallback":
        shouldShow = questionCompleteness === "yesMAIN1noSUBnoMAIN2"; // 2

        // Were they initially positive?
        let werePositive =
          userInputState["MAINQ1-can-we-still-save-the-world"] === "certain" ||
          userInputState["MAINQ1-can-we-still-save-the-world"] === "hopeful";

        if (werePositive) {
          setPanelText(
            "We don’t know if you’re still convinced, as you didn’t answer, \
          but here’s how the rest of the audience feel about the piece."
          );
        } else if (!werePositive) {
          setPanelText(
            "We don’t know if you’re still not convinced, as you didn’t answer, \
          but here’s how the rest of the audience feel about the piece."
          );
        }

        break;
      case "level2answer":
        shouldShow =
          questionCompleteness === "noMAIN1noSUByesMAIN2" || // 3
          questionCompleteness === "yesMAIN1noSUByesMAIN2" || // 4
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2"; // 8

        let level2answer: string | undefined = getLevel2Text(
          convincedState,
          userInputState
        );

        const noSectionText =
          "While we don’t know if you’re convinced by any of \
        the challenges, here’s what the audience thought.";

        // TODO: Set levels that get the no section text
        setPanelText(`${level2answer} ${noSectionText}`);
        break;
      case "level3answer":
        shouldShow =
          questionCompleteness === "noMAIN1noSUByesMAIN2" || // 3
          questionCompleteness === "yesMAIN1noSUByesMAIN2" || // 4
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 9

        setPanelText("Level 3 answer");
        break;
      case "personalresults":
        shouldShow =
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 9

        setPanelText("Personal results (chart)");
        break;
      case "ausvself":
        shouldShow =
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 9

        setPanelText("Australia V Self");
        break;
    }

    // Show if incomplete
    if (shouldShow) setHidden(false);
    // Otherwise hide
    else setHidden(true);

    // if (panelKey === "one") {
    //   console.log("Convinced state:", convincedState);
    //   console.log("Qn completeness:", questionCompleteness);
    //   console.log("Input state:", userInputState);

    //   // Abort if no interaction yet
    //   if (questionCompleteness === "noMAIN1noSUBnoMAIN2") return;

    //   // Clicked MAINQ1
    //   if (questionCompleteness === "yesMAIN1noSUBnoMAIN2") {
    //     // They are hopeful
    //     if (
    //       userInputState["MAINQ1-can-we-still-save-the-world"] === "certain" ||
    //       userInputState["MAINQ1-can-we-still-save-the-world"] === "hopeful"
    //     ) {
    //       setPanelText(
    //         "We don’t know if you’re still convinced, as you didn’t answer, \
    //       but here’s how the rest of the audience feel about the piece."
    //       );
    //     }
    //     // They are doubtful
    //     else {
    //       setPanelText(
    //         "We don’t know if you’re still not convinced, as you didn’t answer, \
    //       but here’s how the rest of the audience feel about the piece."
    //       );
    //     }
    //   }

    //   if (questionCompleteness === "noMAIN1noSUByesMAIN2") {
    //     setPanelText(
    //       `${getLevel2Text(
    //         convincedState,
    //         userInputState
    //       )} While we don’t know if you’re convinced by any of the challenges, here’s what the audience thought.`
    //     );
    //   }
    // }
  }, [userInputState, questionCompleteness]);

  return (
    <div
      className={`${styles.root} ${hidden ? styles.hidden : ""} nopullright`}>
      <div className={styles.panelContentContainer}>{panelText}</div>
    </div>
  );
};

export default InteractivePanel;
