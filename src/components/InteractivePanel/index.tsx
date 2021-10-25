import React, { useState, useEffect, useRef } from "react";
import DynText from "../DynText";
import styles from "./styles.scss";
import BarChart from "../BarChart";

// NOTE: Now that these aren't standalone panels, the backgrounds probably
// aren't needed here.
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
  dynamicText: Record<string, string>;
  dynamicTextLoading: boolean;
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
    dynamicText,
    dynamicTextLoading,
    userInputState
  } = props;

  const [hidden, setHidden] = useState(false);
  const [panelText, setPanelText] = useState(<p>...</p>);

  function getLevel2Text(convincedState, userInputState) {
    if (convincedState === "green")
      return <DynText>{dynamicText["LEVEL2-green"]}</DynText>;
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
        return <DynText>{dynamicText["LEVEL2-orange-optimistic"]}</DynText>;
      } else {
        return <DynText>{dynamicText["LEVEL2-orange-pessimistic"]}</DynText>;
      }
    }

    if (convincedState === "red")
      return <DynText>{dynamicText["LEVEL2-red"]}</DynText>;
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
    // questionCompleteness === "yesMAIN1someSUBnoMAIN2" // 9a
    // questionCompleteness === "yesMAIN1allSUByesMAIN2" // 10

    let shouldShow;

    // Were they initially positive?

    const main1Positive =
      userInputState["MAINQ1-can-we-still-save-the-world"] === "certain" ||
      userInputState["MAINQ1-can-we-still-save-the-world"] === "hopeful";

    const getMain1State = key => {
      if (typeof key === "undefined") return "noanswer";
      if (key === "certain" || key === "hopeful") return "optimistic";
      if (key === "doubtful" || key === "impossible") return "pessimistic";
    };

    const main1State = getMain1State(
      userInputState["MAINQ1-can-we-still-save-the-world"]
    );

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
          setPanelText(<DynText>{dynamicText["NOANSWER-nothing"]}</DynText>);
          /* You didn’t answer any of the questions but here’s how
          the rest of the audience felt about the piece. */
        } else {
          // They didn't answer MAIN questions
          setPanelText(<DynText>{dynamicText["NOANSWER-some-subq"]}</DynText>);
          /* You didn’t tell us whether you thought Australia could get to net
          zero, but here is the impact the things you were convinced by
          would have on our emissions. */
        }

        break;
      case "incompletefallback":
        shouldShow = questionCompleteness === "yesMAIN1noSUBnoMAIN2"; // 2

        if (main1State === "optimistic") {
          setPanelText(
            <DynText>{dynamicText["INCOMPLETE-optimistic"]}</DynText>
          );
          /* We don’t know if you’re still convinced, as you didn’t answer, but
          here’s how the rest of the audience feel about the piece. */
        } else if (main1State === "pessimistic") {
          setPanelText(
            <DynText>{dynamicText["INCOMPLETE-pessimistic"]}</DynText>
          );
          /* We don’t know if you’re still not convinced, as you didn’t answer,
          but here’s how the rest of the audience feel about the piece. */
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
          <DynText>{dynamicText["INCOMPLETE-no-challenges"]}</DynText>
        );
        /* While we don’t know if you’re convinced by any of the challenges,
        here’s what the audience thought. */

        if (
          questionCompleteness === "noMAIN1noSUByesMAIN2" || // 3
          questionCompleteness === "yesMAIN1noSUByesMAIN2"
        ) {
          // 4
          // NOTE: PROBABLY NOT NEEDED
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
          questionCompleteness === "yesMAIN1someSUBnoMAIN2" || // 9a
          questionCompleteness === "yesMAIN1allSUByesMAIN2"; // 10

        //

        if (subQuestionsConvinvedOf === 4) {
          if (main1State === "optimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-4-optimistic"]}</DynText>
            );
            // Let’s look at what the impact of doing the things you’re
            // convinced of would be. If we can pull it off then Australia not
            // only gets to net zero, we’ve set the country for a future in
            // this zero carbon world.
          } else if (main1State === "pessimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-4-pessimistic"]}</DynText>
            );
            /* Look even if you don’t think we can pull this off, if we just do
                the things you’re convinced by then that puts Australia on track
                to be part of a world that keeps temperatures at or below 1.5
                degrees. */
          } else if (main1State === "noanswer") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-4-noanswer"]}</DynText>
            );
          }
        }

        //

        if (subQuestionsConvinvedOf === 3) {
          if (main1State === "optimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-3-optimistic"]}</DynText>
            );
            /* Let’s look at what the impact of doing the things you’re
                convinced of would be. If we can just accomplish them by 2030,
                then that would keep Australia on track to be part of a world
                that keeps temperatures at or below 1.5 degrees. */
          } else if (main1State === "pessimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-3-pessimistic"]}</DynText>
            );
            /* Look even if you don’t think we can pull this off, if we can
                just accomplish the things you’re convinced of by 2030, then
                that would keep Australia on track to be part of a world that
                keeps temperatures at or below 1.5 degrees. */
          } else if (main1State === "noanswer") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-3-noanswer"]}</DynText>
            );
          }
        }

        //

        if (subQuestionsConvinvedOf === 2) {
          if (main1State === "optimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-2-optimistic"]}</DynText>
            );
            /* Let’s look at what the impact of doing the things you’re
                convinced of would be. Just reducing emissions in this one area
                over the next 5 years would put us on track for the most
                ambitious Paris agreement targets, and give us a chance of
                keeping temperature increases at or below 1.5 degrees. */
          } else if (main1State === "pessimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-2-pessimistic"]}</DynText>
            );

            /* We get it, it’s a big problem, but we don’t have to solve it all
            now. Let’s look at what the impact of doing the things you’re
            convinced of would be. Just reducing emissions in this one area
            over the next 5 years would put us on track for the most
            ambitious Paris agreement targets, and give us a chance of
            keeping temperature increases at or below 1.5 degrees. */
          } else if (main1State === "noanswer") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-2-noanswer"]}</DynText>
            );
          }
        }

        //

        if (subQuestionsConvinvedOf === 1) {
          if (main1State === "optimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-1-optimistic"]}</DynText>
            );
            /* It’s good that you’re optimistic about Australia getting to net
                zero, even if you’re not sure how we can get there. */
          } else if (main1State === "pessimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-1-pessimistic"]}</DynText>
            );

            /* Well, I dunno what to tell ya???? */
          } else if (main1State === "noanswer") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-yes-1-noanswer"]}</DynText>
            );
          }
        }

        if (subQuestionsConvinvedOf === 0) {
          if (main1State === "optimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-none-optimistic"]}</DynText>
            );
          } else if (main1State === "pessimistic") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-none-pessimistic"]}</DynText>
            );
          } else if (main1State === "noanswer") {
            setPanelText(
              <DynText>{dynamicText["LEVEL3-none-noanswer"]}</DynText>
            );
          }
        }

        break;
      case "personalresults":
        shouldShow =
          questionCompleteness === "noMAIN1someSUBnoMAIN2" || // 5
          questionCompleteness === "noMAIN1allSUBnoMAIN2" || // 6
          questionCompleteness === "noMAIN1someSUByesMAIN2" || // 7
          questionCompleteness === "noMAIN1allSUByesMAIN2" || // 8
          questionCompleteness === "yesMAIN1someSUByesMAIN2" || // 9
          questionCompleteness === "yesMAIN1allSUByesMAIN2" || // 10
          questionCompleteness === "yesMAIN1someSUBnoMAIN2" ||
          questionCompleteness === "yesMAIN1allSUBnoMAIN2";

        // Hide if all nope
        if (subQuestionsConvinvedOf === 0) shouldShow = false;

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

        const tickState = (userInputState: string | undefined) => {
          if (userInputState === "hopeful") return "tick";
          if (userInputState === "doubtful") return "cross";
          return "none";
        };

        setPanelText(
          <>
            <p>Personal results.</p>
            <BarChart
              bars={[
                {
                  title: "Electricity",
                  percent: 33,
                  color: "#F65C1B", // Orange
                  textColor: "#C42F05", // Text orange
                  // greyedOut: isGreyedOut("SUBQ1-renewables-zero-carbon"),
                  tickState: tickState(
                    userInputState["SUBQ1-renewables-zero-carbon"]
                  )
                },
                {
                  title: "Agriculture",
                  percent: 10,
                  color: "#007B52", // Green
                  textColor: "#007B52",
                  // greyedOut: isGreyedOut("SUBQ2-livestock-emissions"),
                  tickState: tickState(
                    userInputState["SUBQ2-livestock-emissions"]
                  )
                },
                {
                  title: "Transport",
                  percent: 20,
                  color: "#007CBF", // Light blue
                  textColor: "#007CBF",
                  // greyedOut: isGreyedOut("SUBQ3-transportation-off-fossil"),
                  tickState: tickState(
                    userInputState["SUBQ3-transportation-off-fossil"]
                  )
                },
                {
                  title: "Industry",
                  percent: 40,
                  color: "#2A4059", // Dark blue
                  textColor: "#2A4059",
                  // greyedOut: isGreyedOut("SUBQ4-industry-emissions"),
                  tickState: tickState(
                    userInputState["SUBQ4-industry-emissions"]
                  )
                }
                // {
                //   title: "Carbon capture",
                //   percent: 60,
                //   color: "#2A4059",
                //   textColor: "#2A4059",
                //   label: "All the rest",
                //   greyedOut: isGreyedOut("SUBQ5-carbon-capture")
                // }
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
          questionCompleteness === "yesMAIN1allSUByesMAIN2" || // 10
          questionCompleteness === "yesMAIN1someSUBnoMAIN2" ||
          questionCompleteness === "yesMAIN1allSUBnoMAIN2";
        // console.log(
        //   "You convinced:",
        //   subQuestionsConvinvedOf,
        //   "Aus convinced:",
        //   australiaConvincedOf,
        //   "Convinced state:",
        //   convincedState
        // );

        if (subQuestionsConvinvedOf > australiaConvincedOf)
          setPanelText(<DynText>{dynamicText["SELFVAUS-more"]}</DynText>);
        /* You’re more optimistic we can solve these challenges than most of
              our readers, but even if we just reduce emissions in the areas
              they’re convinced by, we’d still be on track for the most
              ambitious Paris agreements. */ else if (
          subQuestionsConvinvedOf === australiaConvincedOf
        )
          setPanelText(<DynText>{dynamicText["SELFVAUS-same"]}</DynText>);
        /* The good news is that most people who read this story agree with
              you. */ else if (
          subQuestionsConvinvedOf < australiaConvincedOf
        )
          setPanelText(<DynText>{dynamicText["SELFVAUS-less"]}</DynText>);
        /* Your fellow Australians are more optimistic than you. They’re
              convinced we can do X, which would keep us on track for the most
              ambitious Paris agreement B. */

        break;
    }
    // console.log("Subquestions convinced of", subQuestionsConvinvedOf);

    // Show if incomplete
    if (shouldShow) setHidden(false);
    // Otherwise hide
    else setHidden(true);
  }, [
    userInputState,
    questionCompleteness,
    subQuestionsConvinvedOf,
    australiaConvincedOf,
    convincedState,
    dynamicTextLoading
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
      {panelText}
    </div>
  );
};

export default InteractivePanel;
