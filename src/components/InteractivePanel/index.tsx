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
  const [panelText, setPanelText] = useState(<p>Test</p>);

  // TODO: Maybe make these functions return React components?

  function getLevel2Text(convincedState, userInputState) {
    if (convincedState === "green")
      return (
        <p>So you’re more positive than at the start, that’s something.</p>
      );
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
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 9

        if (
          // They didn't answer MAIN questions
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" // 6
        ) {
          setPanelText(
            <p>
              You didn’t tell us whether you thought Australia could get to net
              zero, but here is the impact the things you were convinced by
              would have on our emissions.
            </p>
          );
        } else {
          // Check how many convinced of
          console.log(subQuestionsConvinvedOf);
          console.log(main2Positive)

          if (subQuestionsConvinvedOf >= 4) {
            // Check if positive outloon on main2 question
            if (main2Positive)
              setPanelText(
                <p>
                  Let’s look at what the impact of doing the things you’re
                  convinced of would be. If we can pull it off then Australia
                  not only gets to net zero, we’ve set the country for a future
                  in this zero carbon world.
                </p>
              );
            else
              setPanelText(
                <p>
                  Look even if you don’t think we can pull this off, if we just
                  do the things you’re convinced by then Australia not only gets
                  to net zero, we’ve set the country for a future in this zero
                  carbon world.
                </p>
              );
          }
          setPanelText(<p>Level 3 answer</p>);
        }

        break;
      case "personalresults":
        shouldShow =
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 9

        setPanelText(<p>Personal results (PUT CHART HERE)</p>);
        break;
      case "ausvself":
        shouldShow =
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 9

        setPanelText(<p>Australia V Self</p>);
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
  }, [
    userInputState,
    questionCompleteness,
    subQuestionsConvinvedOf,
    australiaConvincedOf
  ]);

  return (
    <div
      className={`${styles.root} ${hidden ? styles.hidden : ""} nopullright`}>
      <div className={styles.panelContentContainer}>{panelText}</div>
    </div>
  );
};

export default InteractivePanel;
