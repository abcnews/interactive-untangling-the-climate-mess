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

  // onMount
  useEffect(() => {
    if (panelKey === "one") {
      setPanelText(
        "You didn’t answer any of the questions but here’s how the rest of the audience felt about the piece."
      );
    }
  }, []);

  useEffect(() => {
    console.log("Qn completeness:", questionCompleteness);
    console.log("Input state:", userInputState);

    // Abort if no interaction yet
    if (questionCompleteness === "noMAIN1noSUBnoMAIN2") return;

    // Clicked MAINQ1
    if (questionCompleteness === "yesMAIN1noSUBnoMAIN2") {
      // They are hopeful
      if (
        userInputState["MAINQ1-can-we-still-save-the-world"] === "certain" ||
        userInputState["MAINQ1-can-we-still-save-the-world"] === "hopeful"
      ) {
        setPanelText(
          "We don’t know if you’re still convinced, as you didn’t answer, but here’s how the rest of the audience feel about the piece."
        );
      } else
      // They are doubtful 
      {
        setPanelText(
          "We don’t know if you’re still not convinced, as you didn’t answer, but here’s how the rest of the audience feel about the piece."
        );
      }
    }
  }, [questionCompleteness, userInputState]);

  return (
    <div className={`${styles.root} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.panelContentContainer}>{panelText}</div>
    </div>
  );
};

export default InteractivePanel;
