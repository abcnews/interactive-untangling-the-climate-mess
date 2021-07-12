import React, { useState, SyntheticEvent, useEffect, useRef } from "react";
import styles from "./styles.scss";
import { Client } from "@abcnews/poll-counters-client";
import debounce from "debounce-promise";
import to from "await-to-js";
import { CSSTransition } from "react-transition-group";

// Set up our poll counter
// const GROUP = "interactive-untangling-the-climate-mess";
// const pollClient = new Client(GROUP);

interface Button {
  label: string;
  value: string;
  response?: any;
}

interface UserInputBoxProps {
  title: string;
  buttons?: Button[];
  poll?: any;
  setUserInputState?: any;
  questionKey: string;
  handleUserInput?: any;
  padding?: boolean;
  color?: string;
  pollClient: any;
}

const BackgroundSvg = ({
  shapeIndex = 0,
  color = "#A3297C",
  selected = true,
  greyedOut = false,
  ...props
}) => {
  return (
    <svg
      width="284"
      height="43"
      viewBox="0 0 284 43"
      fill={selected ? color : "none"}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {shapeIndex === 0 ? (
        <path
          d="M2.09126 17.7082L2.09225 17.6982L2.0931 17.6882C2.19805 16.4595 3.03643 14.0196 4.51259 11.5921C5.98997 9.1625 7.89604 7.09574 9.89904 6.27584C12.294 5.29549 16.0807 4.46985 21.004 3.80318C25.8966 3.14068 31.8034 2.64841 38.3746 2.29314C51.5152 1.5827 67.2331 1.42411 82.6516 1.52964C98.0661 1.63514 113.161 2.00442 125.052 2.34752C129.383 2.47248 133.297 2.59429 136.648 2.69858C142.473 2.87985 146.597 3.00819 148.253 3.00819C153.398 3.00819 180.524 3.29191 208.08 3.85623C221.856 4.13836 235.733 4.49048 247.017 4.91201C258.354 5.33546 266.951 5.82576 270.262 6.36791C274.91 7.12883 277.928 9.76462 279.825 13.0331C281.747 16.3457 282.5 20.296 282.5 23.4746C282.5 27.6731 280.915 30.625 278.289 32.7676C275.595 34.9654 271.715 36.3808 267.067 37.2052C263.104 37.9083 248.14 38.9628 226.199 39.8393C204.317 40.7133 175.62 41.4065 144.284 41.4065C134.338 41.4065 124.886 41.4324 115.935 41.4569C88.7719 41.5314 66.2209 41.5933 48.4879 40.8796C36.7015 40.4053 27.1114 39.5901 19.751 38.2238C12.3273 36.8458 7.43587 34.9499 4.79102 32.5104C0.829098 28.856 1.32076 24.548 1.87732 19.6714C1.95087 19.0269 2.02557 18.3724 2.09126 17.7082Z"
          stroke={color}
          strokeWidth="3"
        />
      ) : shapeIndex === 1 ? (
        <path
          d="M281.909 25.2918L281.908 25.3018L281.907 25.3118C281.802 26.5405 280.964 28.9804 279.487 31.4079C278.01 33.8375 276.104 35.9043 274.101 36.7242C271.706 37.7045 267.919 38.5302 262.996 39.1968C258.103 39.8593 252.197 40.3516 245.625 40.7069C232.485 41.4173 216.767 41.5759 201.348 41.4704C185.934 41.3649 170.839 40.9956 158.948 40.6525C154.617 40.5275 150.703 40.4057 147.352 40.3014C141.527 40.1201 137.403 39.9918 135.747 39.9918C130.602 39.9918 103.476 39.7081 75.9203 39.1438C62.1436 38.8616 48.2675 38.5095 36.9827 38.088C25.6465 37.6645 17.0488 37.1742 13.7377 36.6321C9.09048 35.8712 6.0719 33.2354 4.17502 29.9669C2.25259 26.6543 1.5 22.704 1.5 19.5254C1.5 15.3269 3.08542 12.375 5.71136 10.2324C8.40491 8.03464 12.2849 6.61921 16.9327 5.79479C20.8964 5.09171 35.8596 4.03718 57.8013 3.16071C79.6826 2.28666 108.38 1.59355 139.716 1.59355C149.662 1.59355 159.114 1.56762 168.065 1.54307C195.228 1.46856 217.779 1.4067 235.512 2.12037C247.299 2.59473 256.889 3.40988 264.249 4.77619C271.673 6.15424 276.564 8.0501 279.209 10.4896C283.171 14.144 282.679 18.452 282.123 23.3286C282.049 23.9731 281.974 24.6276 281.909 25.2918Z"
          stroke={color}
          strokeWidth="3"
        />
      ) : shapeIndex === 2 ? (
        <path
          d="M281.909 17.7082L281.908 17.6982L281.907 17.6882C281.802 16.4595 280.964 14.0196 279.487 11.5921C278.01 9.1625 276.104 7.09574 274.101 6.27584C271.706 5.29549 267.919 4.46985 262.996 3.80318C258.103 3.14068 252.197 2.64841 245.625 2.29314C232.485 1.5827 216.767 1.42411 201.348 1.52964C185.934 1.63514 170.839 2.00442 158.948 2.34752C154.617 2.47248 150.703 2.59429 147.352 2.69858C141.527 2.87985 137.403 3.00819 135.747 3.00819C130.602 3.00819 103.476 3.29191 75.9203 3.85623C62.1436 4.13836 48.2675 4.49048 36.9827 4.91201C25.6465 5.33546 17.0488 5.82576 13.7377 6.36791C9.09048 7.12883 6.0719 9.76462 4.17502 13.0331C2.25259 16.3457 1.5 20.296 1.5 23.4746C1.5 27.6731 3.08542 30.625 5.71136 32.7676C8.40491 34.9654 12.2849 36.3808 16.9327 37.2052C20.8964 37.9083 35.8596 38.9628 57.8013 39.8393C79.6826 40.7133 108.38 41.4065 139.716 41.4065C149.662 41.4065 159.114 41.4324 168.065 41.4569C195.228 41.5314 217.779 41.5933 235.512 40.8796C247.299 40.4053 256.889 39.5901 264.249 38.2238C271.673 36.8458 276.564 34.9499 279.209 32.5104C283.171 28.856 282.679 24.548 282.123 19.6714C282.049 19.0269 281.974 18.3724 281.909 17.7082Z"
          stroke={color}
          strokeWidth="3"
        />
      ) : shapeIndex === 3 ? (
        <path
          d="M2.09126 25.2918L2.09225 25.3018L2.0931 25.3118C2.19805 26.5405 3.03643 28.9804 4.51259 31.4079C5.98997 33.8375 7.89604 35.9043 9.89904 36.7242C12.294 37.7045 16.0807 38.5302 21.004 39.1968C25.8966 39.8593 31.8034 40.3516 38.3746 40.7069C51.5152 41.4173 67.2331 41.5759 82.6516 41.4704C98.0661 41.3649 113.161 40.9956 125.052 40.6525C129.383 40.5275 133.297 40.4057 136.648 40.3014C142.473 40.1201 146.597 39.9918 148.253 39.9918C153.398 39.9918 180.524 39.7081 208.08 39.1438C221.856 38.8616 235.733 38.5095 247.017 38.088C258.354 37.6645 266.951 37.1742 270.262 36.6321C274.91 35.8712 277.928 33.2354 279.825 29.9669C281.747 26.6543 282.5 22.704 282.5 19.5254C282.5 15.3269 280.915 12.375 278.289 10.2324C275.595 8.03464 271.715 6.61921 267.067 5.79479C263.104 5.09171 248.14 4.03718 226.199 3.16071C204.317 2.28666 175.62 1.59355 144.284 1.59355C134.338 1.59355 124.886 1.56762 115.935 1.54307C88.7719 1.46856 66.2209 1.4067 48.4879 2.12037C36.7015 2.59473 27.1114 3.40988 19.751 4.77619C12.3273 6.15424 7.43587 8.0501 4.79102 10.4896C0.829098 14.144 1.32076 18.452 1.87732 23.3286C1.95087 23.9731 2.02557 24.6276 2.09126 25.2918Z"
          stroke={color}
          strokeWidth="3"
        />
      ) : null}
    </svg>
  );
};

const UserInputBox: React.FC<UserInputBoxProps> = ({
  color = "#A3297C",
  pollClient,
  questionKey,
  ...props
}) => {
  const [buttons, setButtons] = useState<Button[]>([{ label: "", value: "" }]);
  const [selected, setSelected] = useState("");
  const [responseBox, setResponseBox] = useState();

  const componentRef = useRef({});
  const { current: component }: { current: any } = componentRef;

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
    // Set up component reference for a debounce
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

    // async test
    // const test = async () => {
    //   const result = await pollGet({ question: questionKey });
    //   console.log(result);
    // };

    // test();
  }, []); // Init effect

  useEffect(() => {
    if (selected === "") return;

    handleUserInput(questionKey, selected);

    // See if there's response text to show
    const selectedButton = buttons.find(button => {
      return button.value === selected;
    });

    if (selectedButton) setResponseBox(selectedButton.response);

    // Set previous state
    if (props.setUserInputState) {
      props.setUserInputState(prevState => {
        return { ...prevState, [questionKey]: selected };
      });
    }
  }, [selected]);

  return (
    <div
      className={`${styles.root} ${
        props.padding ? styles.paddingLeftRight : ""
      }`}
    >
      <h4 className={styles.preTitle}>What do you think?:</h4>
      <h3 style={{ color: color }}>{props.title}</h3>
      <div className={styles.buttonContainer}>
        {buttons.map((button, iteration) => {
          const isSelected = selected === button.value;
          const somethingSelected = selected !== "";
          const calculatedColor =
            somethingSelected && isSelected
              ? "white"
              : somethingSelected
              ? "rgba(63, 82, 104, 0.5)"
              : color;

          return (
            <div key={button.value} className={styles.backgroundContainer}>
              <button
                id={button.value}
                className={isSelected ? styles.selected : ""}
                onClick={handleClick}
                style={{
                  color: calculatedColor
                }}
              >
                {button.label}
              </button>
              <div className={styles.organicBackground}>
                <BackgroundSvg
                  shapeIndex={iteration}
                  color={
                    somethingSelected && !isSelected
                      ? "rgba(63, 82, 104, 0.5)"
                      : color
                  }
                  selected={isSelected}
                />
              </div>
            </div>
          );
        })}
      </div>
      <CSSTransition in={typeof responseBox !== "undefined"} timeout={500} classNames={"response-box-styles"}>
        <div className={styles.responseBox} style={{ color: `${color}` }}>
          {responseBox}
        </div>
      </CSSTransition>
    </div>
  );
};

export default UserInputBox;
