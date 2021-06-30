import React, { useState, SyntheticEvent, useEffect, useRef } from "react";
import styles from "./styles.scss";
import { Client } from "@abcnews/poll-counters-client";
import debounce from "debounce-promise";
import to from "await-to-js";

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

interface Button {
  label: string;
  value: string;
}

interface UserInputBoxProps {
  title: string;
  buttons?: Button[];
  poll?: any;
  setUserInputState?: any;
  questionKey: string;
  handleUserInput?: any;
  padding?: boolean;
}

const BackgroundSvg = () => {
  return (
    <svg
      width="284"
      height="43"
      viewBox="0 0 284 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2.09126 17.7082L2.09225 17.6982L2.0931 17.6882C2.19805 16.4595 3.03643 14.0196 4.51259 11.5921C5.98997 9.1625 7.89604 7.09574 9.89904 6.27584C12.294 5.29549 16.0807 4.46985 21.004 3.80318C25.8966 3.14068 31.8034 2.64841 38.3746 2.29314C51.5152 1.5827 67.2331 1.42411 82.6516 1.52964C98.0661 1.63514 113.161 2.00442 125.052 2.34752C129.383 2.47248 133.297 2.59429 136.648 2.69858C142.473 2.87985 146.597 3.00819 148.253 3.00819C153.398 3.00819 180.524 3.29191 208.08 3.85623C221.856 4.13836 235.733 4.49048 247.017 4.91201C258.354 5.33546 266.951 5.82576 270.262 6.36791C274.91 7.12883 277.928 9.76462 279.825 13.0331C281.747 16.3457 282.5 20.296 282.5 23.4746C282.5 27.6731 280.915 30.625 278.289 32.7676C275.595 34.9654 271.715 36.3808 267.067 37.2052C263.104 37.9083 248.14 38.9628 226.199 39.8393C204.317 40.7133 175.62 41.4065 144.284 41.4065C134.338 41.4065 124.886 41.4324 115.935 41.4569C88.7719 41.5314 66.2209 41.5933 48.4879 40.8796C36.7015 40.4053 27.1114 39.5901 19.751 38.2238C12.3273 36.8458 7.43587 34.9499 4.79102 32.5104C0.829098 28.856 1.32076 24.548 1.87732 19.6714C1.95087 19.0269 2.02557 18.3724 2.09126 17.7082Z"
        stroke="#A3297C"
        stroke-width="3"
      />
    </svg>
  );
};

const UserInputBox: React.FC<UserInputBoxProps> = props => {
  const [buttons, setButtons] = useState([{ label: "", value: "" }]);
  const [selected, setSelected] = useState("");

  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

  const { questionKey } = props;

  const handleClick = (e: SyntheticEvent) => {
    const selectedId = (e.target as Element).id;
    setSelected(selectedId);
  };

  async function handleUserInput(questionId, answerCode) {
    const [err, result] = await to(
      component.debouncedPollIncrement({
        question: questionId,
        answer: answerCode
      })
    );

    // TODO: handle multiple calls... they all await and then continue
    // returning the same thing multiple times........
    if (err) console.error(err);
    // if (result) console.log(result);
  }

  useEffect(() => {
    component.debouncedPollIncrement = debounce(pollIncrement, 5000);

    // Set some default buttons (in case they're not set in App — but they will be)
    if (!props.buttons) {
      setButtons([
        { label: "Of course we can", value: "certain" },
        { label: "Yes I think we can", value: "hopeful" },
        { label: "Probably not", value: "doubtful" },
        { label: "No way we're screwed", value: "impossible" }
      ]);
    } else {
      setButtons(props.buttons);
    }
  }, []); // Init effect

  useEffect(() => {
    if (selected === "") return;

    handleUserInput(questionKey, selected);

    if (props.setUserInputState) {
      props.setUserInputState(prevState => {
        return { ...prevState, [props.questionKey]: selected };
      });
    }
  }, [selected]);

  return (
    <div
      className={`${styles.root} ${
        props.padding ? styles.paddingLeftRight : ""
      }`}
    >
      <h3>{props.title}</h3>
      <div className={styles.buttonContainer}>
        {buttons.map(button => (
          <div key={button.value} className={styles.backgroundContainer}>
            <button
              id={button.value}
              className={selected === button.value ? styles.selected : ""}
              onClick={handleClick}
            >
              {button.label}
            </button>
            <div className={styles.organicBackground}><BackgroundSvg /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInputBox;
