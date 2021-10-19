import "regenerator-runtime/runtime.js";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import DYNAMIC_TEXT_DATA from "../public/dynamic-text.json";
import { initAppleNews } from "./lib/apple-news";
// import { useDynamicText } from "./lib/react-apple-news";
import DynText from "./components/DynText";
import Embed from "./components/Embed";
import InteractivePanel from "./components/InteractivePanel";
import UserInputBox from "./components/UserInputBox";

const rIC =
  window["requestIdleCallback"] ||
  function (handler: Function) {
    const startTime = Date.now();

    setTimeout(
      () =>
        handler({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50.0 - (Date.now() - startTime))
        }),
      1
    );
  };

const QUESTION_USER_INPUT_BOX_CONFIGS = {
  tier1: {
    color: "#2A4059",
    key: "MAINQ1",
    slug: "can-we-still-save-the-world"
  },
  zerocarbon: {
    color: "#F65C1B",
    key: "SUBQ1",
    slug: "renewables-zero-carbon"
  },
  livestockemissions: {
    color: "#007B52",
    key: "SUBQ2",
    slug: "livestock-emissions"
  },
  fossiltransport: {
    color: "#007cbf",
    key: "SUBQ3",
    slug: "transportation-off-fossil"
  },
  industryemissions: {
    color: "#2A4059",
    key: "SUBQ4",
    slug: "industry-emissions"
  }
};
const PROJECT_NAME = "interactive-untangling-the-climate-mess";
const USER_INPUT_STATE_LOCAL_STORAGE_KEY = `${PROJECT_NAME}__user-input-state`;
const INTERACTIVE_PANEL_KEYS = [
  "didntanswer",
  "incompletefallback",
  "level3answer",
  "personalresults"
];

const dynamicText = {};

for (const record of DYNAMIC_TEXT_DATA) {
  const { fields } = record;
  const { name, text } = fields;

  const isBlank =
    text === "\n" ||
    text === "" ||
    text === " " ||
    text === null ||
    text === undefined;

  dynamicText[name] = isBlank ? undefined : text;
}

interface EmbedSwitcherProps {
  id?: string;
}

const EmbedSwitcher: React.FC<EmbedSwitcherProps> = ({ id }) => {
  const [userInputSerializedState, setUserInputSerializedState] = useState(
    () => {
      const initialState = "{}";

      if (id === "results") {
        localStorage.setItem(USER_INPUT_STATE_LOCAL_STORAGE_KEY, initialState);
      }

      return initialState;

      // const _userInputSerializedState =
      //   localStorage.getItem(USER_INPUT_STATE_LOCAL_STORAGE_KEY) || "{}";

      // localStorage.setItem(
      //   USER_INPUT_STATE_LOCAL_STORAGE_KEY,
      //   _userInputSerializedState
      // );

      // return _userInputSerializedState;
    }
  );
  const userInputState = JSON.parse(userInputSerializedState);

  useEffect(() => {
    let hasEnded = false;

    rIC(function poll() {
      const _userInputSerializedState = localStorage.getItem(
        USER_INPUT_STATE_LOCAL_STORAGE_KEY
      );

      if (userInputSerializedState !== _userInputSerializedState) {
        setUserInputSerializedState(_userInputSerializedState || "{}");
      }

      if (!hasEnded) {
        rIC(poll);
      }
    });

    return () => {
      hasEnded = true;
    };
  }, [userInputState]);

  const updateSerializePersistAndSetUserInputState = fn => {
    const nextUserInputState = fn(userInputState);
    const nextUserInputSerializedState = JSON.stringify(nextUserInputState);

    localStorage.setItem(
      USER_INPUT_STATE_LOCAL_STORAGE_KEY,
      nextUserInputSerializedState
    );
    setUserInputSerializedState(nextUserInputSerializedState);
  };

  useEffect(() => {
    // Always clear localStorage when the results component first mounts
    if (id === "results") {
      setTimeout(() => {
        updateSerializePersistAndSetUserInputState(() => ({}));
      }, 500);
    }
  }, []);

  // const {
  //   dynamicText,
  //   dynamicTextLoading,
  //   dynamicTextError
  // } = useDynamicText();

  const userInputBoxCommonProps = {
    userInputState,
    setUserInputState: updateSerializePersistAndSetUserInputState,
    pollClient: {
      get: () => Promise.reject(),
      increment: () => {}
    },
    windowWidth: 0
  };

  let component: JSX.Element | null = null;

  switch (id) {
    case "tier1":
    case "zerocarbon":
    case "livestockemissions":
    case "fossiltransport":
    case "industryemissions":
      const { color, key, slug } = QUESTION_USER_INPUT_BOX_CONFIGS[id];
      component = (
        <UserInputBox
          color={color}
          questionKey={`${key}-${slug}`}
          preTitle={<DynText>{dynamicText[`${key}-pre-title`]}</DynText>}
          title={<DynText>{dynamicText[`${key}-title`]}</DynText>}
          buttons={
            key.indexOf("MAIN") === 0
              ? [
                  {
                    label: "Of course we can",
                    value: "certain",
                    response: (
                      <DynText>{dynamicText[`${key}-optimistic`]}</DynText>
                    )
                  },
                  {
                    label: "Yes I think we can",
                    value: "hopeful",
                    response: (
                      <DynText>{dynamicText[`${key}-optimistic`]}</DynText>
                    )
                  },
                  {
                    label: "Probably not",
                    value: "doubtful",
                    response: (
                      <DynText>{dynamicText[`${key}-pessimistic`]}</DynText>
                    )
                  },
                  {
                    label: "No way we're screwed",
                    value: "impossible",
                    response: (
                      <DynText>{dynamicText[`${key}-pessimistic`]}</DynText>
                    )
                  }
                ]
              : [
                  {
                    label: "It can be done",
                    value: "hopeful",
                    response: (
                      <DynText>{dynamicText[`${key}-optimistic`]}</DynText>
                    )
                  },
                  {
                    label: "This sounds like a stretch",
                    value: "doubtful",
                    response: (
                      <DynText>{dynamicText[`${key}-pessimistic`]}</DynText>
                    )
                  }
                ]
          }
          {...userInputBoxCommonProps}
        />
      );
      break;
    case "results":
      component = <UserResultsBox userInputState={{ ...userInputState }} />;
      break;
    default:
      break;
  }

  return <Embed>{component}</Embed>;
};

interface UserResultsBoxProps {
  userInputState: Record<string, string>;
}

const UserResultsBox: React.FC<UserResultsBoxProps> = ({ userInputState }) => {
  const [userStrings, setUserStrings] = useState({
    renewables: 1,
    transportation: 1,
    carboncapture: 1,
    industry: 1,
    livestock: 1
  });
  const [questionCompleteness, setQuestionCompleteness] = useState("nothing");
  const [convincedState, setConvincedState] = useState("orange");
  const [subQuestionsConvinvedOf, setSubQuestionsConvinvedOf] = useState(0);

  useEffect(() => {
    if (!userInputState) return;

    const nextUserStrings = userStrings;

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

    let localConvincedCount = 0;

    for (const area in nextUserStrings) {
      if (nextUserStrings[area] === 0) localConvincedCount++;
    }

    setSubQuestionsConvinvedOf(localConvincedCount);

    function getMAIN1string(state): string {
      if (state["MAINQ1-can-we-still-save-the-world"]) return "yesMAIN1";
      else return "noMAIN1";
    }

    function getSUBstring(state): string {
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

  return (
    <div>
      {INTERACTIVE_PANEL_KEYS.map(panelKey => (
        <InteractivePanel
          key={panelKey}
          panelKey={panelKey}
          questionCompleteness={questionCompleteness}
          convincedState={convincedState}
          subQuestionsConvinvedOf={subQuestionsConvinvedOf}
          australiaConvincedOf={0}
          userInputState={userInputState}
        />
      ))}
    </div>
  );
};

function renderEmbed(embedEl: HTMLElement) {
  const { id } = embedEl.dataset;

  render(<EmbedSwitcher id={id} />, embedEl);
}

window.addEventListener("load", () => {
  const embedEl = document.getElementById("embed") as HTMLElement;

  if (window.applenews) {
    initAppleNews(embedEl, renderEmbed);
  } else {
    renderEmbed(embedEl);
  }
});
