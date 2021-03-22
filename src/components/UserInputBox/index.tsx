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
}

const UserInputBox: React.FC<UserInputBoxProps> = (props) => {
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
        answer: answerCode,
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
        { label: "No way we're screwed", value: "impossible" },
      ]);
    } else {
      setButtons(props.buttons);
    }
  }, []); // Init effect

  useEffect(() => {
    if (selected === "") return;

    handleUserInput(questionKey, selected);

    if (props.setUserInputState) {
      props.setUserInputState((prevState) => {
        return { ...prevState, [props.questionKey]: selected };
      });
    }
  }, [selected]);

  return (
    <div className={styles.root}>
      <h3>{props.title}</h3>
      <div className={styles.buttonContainer}>
        {buttons.map((button) => (
          <button
            id={button.value}
            key={button.value}
            className={selected === button.value ? styles.selected : ""}
            onClick={handleClick}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserInputBox;
