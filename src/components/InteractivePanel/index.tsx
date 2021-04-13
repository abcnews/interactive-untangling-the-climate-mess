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
  
  // function getLevel2Text(convincedState, userInputState) {
  //   if (convincedState === "green")
  //     return "So you’re more positive than at the start, that’s something.";
  //   if (convincedState === "orange") {
  //     if (
  //       userInputState["MAINQ1-can-we-still-save-the-world"] === "certain" ||
  //       userInputState["MAINQ1-can-we-still-save-the-world"] === "hopeful" ||
  //       userInputState[
  //         "MAINQ2-can-we-still-save-the-world-again-after-article"
  //       ] === "certain" ||
  //       userInputState[
  //         "MAINQ2-can-we-still-save-the-world-again-after-article"
  //       ] === "hopeful"
  //     ) {
  //       return "So you still think this can be done.";
  //     } else {
  //       return "It’s OK still not to be convinced, it’s a tricky problem.";
  //     }
  //   }

  //   if (convincedState === "red")
  //     return "So now you’ve read all this you’re less convinced.";
  // }

  // onMount
  useEffect(() => {}, []);

  useEffect(() => {
    if (panelKey === "didntanswer") {
      // A panel that displays text and subtly prompts people
      // to maybe go back and answer more
      const shouldShow =
        questionCompleteness === "noMAIN1noSUBnoMAIN2" ||
        questionCompleteness === "yesMAIN1noSUBnoMAIN2";

      // Show if incomplete
      if (shouldShow) setHidden(false);
      // Otherwise hide
      else setHidden(true);

      // Were they initially positive?
      const werePositive =
        userInputState["MAINQ1-can-we-still-save-the-world"] === "certain" ||
        userInputState["MAINQ1-can-we-still-save-the-world"] === "hopeful";

      // They didn't interact at all
      if (questionCompleteness === "noMAIN1noSUBnoMAIN2") {
        setPanelText(
          "You didn’t answer any of the questions but here’s how the \
          rest of the audience felt about the piece."
        );
      } else if (questionCompleteness === "yesMAIN1noSUBnoMAIN2") {
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
      }
    }

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
    <div className={`${styles.root} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.panelContentContainer}>{panelText}</div>
    </div>
  );
};

export default InteractivePanel;
