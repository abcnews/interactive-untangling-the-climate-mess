import "regenerator-runtime/runtime.js";
import type { UseStore } from "idb-keyval";
import { createStore, get as idbGet, set as idbSet } from "idb-keyval";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import DYNAMIC_TEXT_DATA from "../public/dynamic-text.json";
import { initAppleNews } from "./lib/apple-news";
import DynText from "./components/DynText";
import Embed from "./components/Embed";
import InteractivePanel from "./components/InteractivePanel";
import ProportionsChart from "./components/ProportionsChart";
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

const QUESTION_CONFIGS = {
  mainq1: {
    color: "#2A4059",
    slug: "can-we-still-save-the-world"
  },
  subq1: {
    color: "#F65C1B",
    slug: "renewables-zero-carbon"
  },
  subq2: {
    color: "#007B52",
    slug: "livestock-emissions"
  },
  subq3: {
    color: "#007cbf",
    slug: "transportation-off-fossil"
  },
  subq4: {
    color: "#2A4059",
    slug: "industry-emissions"
  }
};
const PROJECT_NAME = "interactive-untangling-the-climate-mess";
const USER_INPUT_STATE_PERSISTENCE_KEY = `${PROJECT_NAME}__user-input-state`;
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

let idbKeyvalStore: UseStore;

interface EmbedSwitcherProps {
  id?: string;
}

const EmbedSwitcher: React.FC<EmbedSwitcherProps> = ({ id }) => {
  const [userInputSerializedState, setUserInputSerializedState] =
    useState("{}");
  const userInputState = JSON.parse(userInputSerializedState);

  useEffect(() => {
    let hasEnded = false;

    rIC(async function poll() {
      const _userInputSerializedState = await idbGet<string>(
        USER_INPUT_STATE_PERSISTENCE_KEY,
        idbKeyvalStore
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

  const updateSerializePersistAndSetUserInputState = async fn => {
    const nextUserInputState = fn(userInputState);
    const nextUserInputSerializedState = JSON.stringify(nextUserInputState);

    await idbSet(
      USER_INPUT_STATE_PERSISTENCE_KEY,
      nextUserInputSerializedState,
      idbKeyvalStore
    );
    setUserInputSerializedState(nextUserInputSerializedState);
  };

  const userInputBoxCommonProps = {
    userInputState,
    setUserInputState: updateSerializePersistAndSetUserInputState,
    windowWidth: 0
  };

  let component: JSX.Element | null = null;

  switch (id) {
    case "mainq1":
    case "subq1":
    case "subq2":
    case "subq3":
    case "subq4":
      const key = id.toUpperCase();
      const { color, slug } = QUESTION_CONFIGS[id];
      const optimisticText = dynamicText[`${key}-optimistic`];
      const pessimisticText = dynamicText[`${key}-pessimistic`];

      component = (
        <UserInputBox
          color={color}
          questionKey={`${key}-${slug}`}
          preTitle={<DynText>{dynamicText[`${key}-pre-title`]}</DynText>}
          title={<DynText>{dynamicText[`${key}-title`]}</DynText>}
          buttons={
            id.indexOf("mainq") === 0
              ? [
                  {
                    label: "Of course we can",
                    value: "certain",
                    response: <DynText>{optimisticText}</DynText>
                  },
                  {
                    label: "Yes I think we can",
                    value: "hopeful",
                    response: <DynText>{optimisticText}</DynText>
                  },
                  {
                    label: "Probably not",
                    value: "doubtful",
                    response: <DynText>{pessimisticText}</DynText>
                  },
                  {
                    label: "No way we're screwed",
                    value: "impossible",
                    response: <DynText>{pessimisticText}</DynText>
                  }
                ]
              : [
                  {
                    label: "It can be done",
                    value: "hopeful",
                    response: <DynText>{optimisticText}</DynText>
                  },
                  {
                    label: "This sounds like a stretch",
                    value: "doubtful",
                    response: <DynText>{pessimisticText}</DynText>
                  }
                ]
          }
          {...userInputBoxCommonProps}
        />
      );
      break;
    case "proportions":
      component = <ProportionsChart dynamicText={dynamicText} />;
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
          dynamicText={dynamicText}
          dynamicTextLoading={false}
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
  idbKeyvalStore = createStore(
    `${PROJECT_NAME}-db-${Math.floor(Date.now() / 1e4)}`,
    `${PROJECT_NAME}-store`
  );

  const embedEl = document.getElementById("embed") as HTMLElement;

  if (window.applenews) {
    initAppleNews(embedEl, renderEmbed);
  } else {
    renderEmbed(embedEl);
  }
});
