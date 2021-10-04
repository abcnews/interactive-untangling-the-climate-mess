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
  setUserInputState?: any;
  questionKey: string;
  padding?: boolean;
  color?: string;
  pollClient: any;
  windowWidth: number;
}

const BackgroundSvg = ({
  shapeIndex = 0,
  color = "#2A4059",
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

const BackgroundSvgWide = ({
  shapeIndex = 0,
  color = "#2A4059",
  selected = true,
  greyedOut = false,
  ...props
}) => {
  return (
    <svg
      width="394"
      height="43"
      viewBox="0 0 394 43"
      fill={selected ? color : "none"}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {shapeIndex === 0 ? (
        <path
          d="M2.4925 17.7097L2.49351 17.6997L2.49438 17.6896C2.60016 16.464 3.44619 14.0257 4.93789 11.598C6.42968 9.1701 8.3567 7.10024 10.3867 6.27789C12.7683 5.3131 17.4493 4.48089 24.0426 3.80902C30.5718 3.14367 38.7994 2.65013 48.1468 2.29425C66.8383 1.58261 89.9314 1.42408 112.716 1.52966C135.498 1.63522 157.956 2.00469 175.372 2.34785C183.144 2.50097 189.921 2.64911 195.276 2.76614C201.903 2.91099 206.35 3.00819 207.802 3.00819C213.006 3.00819 252.513 3.29202 292.453 3.8564C312.422 4.13857 332.492 4.49078 348.434 4.91253C364.447 5.33619 376.134 5.82802 379.469 6.36831C384.175 7.13095 387.228 9.77219 389.143 13.039C391.085 16.3504 391.845 20.2985 391.845 23.4746C391.845 27.6672 390.246 30.618 387.59 32.7628C384.865 34.9631 380.94 36.3798 376.241 37.2047C375.312 37.3678 372.926 37.5662 369.219 37.7826C365.554 37.9964 360.691 38.2233 354.881 38.4552C343.263 38.9188 327.881 39.4013 310.773 39.8386C276.557 40.7132 235.459 41.4064 203.792 41.4064C194.404 41.4064 184.678 41.4291 174.798 41.4521C142.02 41.5285 107.551 41.6087 78.1684 40.8789C59.0473 40.4039 42.1197 39.5866 29.2363 38.2071C22.7917 37.5171 17.3976 36.6903 13.2633 35.7064C9.04199 34.7019 6.4109 33.5923 5.21988 32.5051C1.21768 28.8518 1.71388 24.5495 2.2762 19.674C2.35056 19.0292 2.42608 18.3744 2.4925 17.7097Z"
          stroke={color}
          strokeWidth="3"
        />
      ) : shapeIndex === 1 ? (
        <path
          d="M391.507 25.2903L391.506 25.3003L391.506 25.3104C391.4 26.536 390.554 28.9743 389.062 31.402C387.57 33.8299 385.643 35.8998 383.613 36.7221C381.226 37.6893 376.693 38.5205 370.379 39.1917C364.124 39.8567 356.287 40.3501 347.408 40.7059C329.652 41.4174 307.807 41.5759 286.268 41.4703C264.733 41.3648 243.522 40.9953 227.04 40.6522C219.879 40.5031 213.6 40.3587 208.577 40.2431C202.057 40.0932 197.65 39.9918 196.166 39.9918C190.962 39.9918 149.015 39.708 106.635 39.1436C85.4455 38.8614 64.1544 38.5092 47.2976 38.0874C38.8685 37.8765 31.5544 37.6484 25.9187 37.4032C20.2419 37.1562 16.3655 36.8951 14.7399 36.6317C10.0335 35.8691 6.98096 33.2278 5.06528 29.961C3.12341 26.6496 2.36359 22.7015 2.36359 19.5254C2.36359 15.3328 3.96271 12.382 6.6188 10.2372C9.34363 8.03691 13.2685 6.62019 17.9679 5.79525C18.8918 5.63306 21.4233 5.4343 25.403 5.21778C29.3356 5.00383 34.5806 4.77687 40.8483 4.54501C53.3823 4.08134 69.9847 3.5988 88.3127 3.16148C124.97 2.28682 168.509 1.59355 200.177 1.59355C209.666 1.59355 219.365 1.5704 229.114 1.54714C261.007 1.47104 293.436 1.39365 320.813 2.12106C338.687 2.59596 354.365 3.41312 366.309 4.79149C372.283 5.48098 377.285 6.30663 381.142 7.28802C385.071 8.2874 387.572 9.39244 388.78 10.4949C392.782 14.1482 392.286 18.4505 391.724 23.326C391.649 23.9708 391.574 24.6256 391.507 25.2903Z"
          stroke={color}
          strokeWidth="3"
        />
      ) : shapeIndex === 2 ? (
        <path
          d="M390.508 17.7097L390.507 17.6997L390.506 17.6896C390.4 16.464 389.554 14.0257 388.062 11.598C386.57 9.1701 384.643 7.10024 382.613 6.27789C380.226 5.31069 375.693 4.47953 369.379 3.80834C363.124 3.14334 355.287 2.64995 346.408 2.29413C328.652 1.58262 306.807 1.42409 285.268 1.52966C263.733 1.63521 242.522 2.00466 226.04 2.34781C218.879 2.49692 212.6 2.64132 207.577 2.75687C201.057 2.90683 196.65 3.00819 195.166 3.00819C189.962 3.00819 148.049 3.29204 105.703 3.85641C84.5308 4.13859 63.2567 4.49081 46.4128 4.91259C37.99 5.12349 30.6812 5.35163 25.0493 5.59683C19.3763 5.84381 15.5019 6.10489 13.8763 6.36831C9.16995 7.13095 6.11737 9.77219 4.20169 13.039C2.25983 16.3504 1.5 20.2985 1.5 23.4746C1.5 27.6672 3.09912 30.618 5.75522 32.7628C8.48004 34.9631 12.4049 36.3798 17.1043 37.2047C18.0283 37.367 20.5578 37.5657 24.5337 37.7822C28.4625 37.9962 33.7021 38.2231 39.9634 38.455C52.4846 38.9187 69.07 39.4012 87.3809 39.8385C124.004 40.7132 167.509 41.4065 199.177 41.4065C208.666 41.4065 218.365 41.4296 228.114 41.4529C260.007 41.529 292.436 41.6063 319.813 40.8789C337.687 40.404 353.365 39.5869 365.309 38.2085C371.284 37.519 376.285 36.6934 380.143 35.712C384.071 34.7126 386.573 33.6076 387.78 32.5051C391.782 28.8518 391.286 24.5495 390.724 19.674C390.65 19.0292 390.574 18.3744 390.508 17.7097Z"
          stroke={color}
          strokeWidth="3"
        />
      ) : shapeIndex === 3 ? (
        <path
          d="M2.16902 25.2903L2.17003 25.3003L2.1709 25.3104C2.27667 26.536 3.12271 28.9743 4.6144 31.402C6.10619 33.8299 8.03322 35.8998 10.0632 36.7221C12.4446 37.6868 17.1304 38.5191 23.7328 39.191C30.2709 39.8563 38.5111 40.3499 47.8738 40.7058C66.5957 41.4174 89.7293 41.5759 112.555 41.4703C135.377 41.3648 157.875 40.9953 175.322 40.6522C183.113 40.4989 189.907 40.3506 195.272 40.2336C201.903 40.0889 206.351 39.9918 207.802 39.9918C213.006 39.9918 252.301 39.708 292.03 39.1436C311.893 38.8614 331.859 38.5092 347.721 38.0875C363.655 37.6638 375.289 37.172 378.624 36.6317C383.33 35.8691 386.383 33.2278 388.298 29.961C390.24 26.6496 391 22.7015 391 19.5254C391 15.3328 389.401 12.382 386.745 10.2372C384.02 8.03691 380.095 6.6202 375.396 5.79526C374.467 5.63215 372.093 5.43372 368.41 5.21742C364.768 5.00356 359.938 4.77666 354.168 4.54483C342.629 4.08122 327.352 3.59871 310.351 3.16142C276.346 2.2868 235.459 1.59355 203.792 1.59355C194.408 1.59355 184.68 1.57092 174.796 1.54791C141.99 1.47157 107.455 1.3912 78.0067 2.12113C58.845 2.59608 41.8768 3.41343 28.963 4.7929C22.5031 5.48295 17.0963 6.3098 12.953 7.29373C10.8816 7.78564 9.15511 8.31011 7.7846 8.86356C6.39781 9.42358 5.46062 9.97984 4.89639 10.4949C0.894197 14.1482 1.3904 18.4505 1.95271 23.326C2.02707 23.9708 2.10259 24.6256 2.16902 25.2903Z"
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
  windowWidth,
  setUserInputState,
  ...props
}) => {
  const [buttons, setButtons] = useState<Button[]>([{ label: "", value: "" }]);
  const [selected, setSelected] = useState("");
  const [responseBox, setResponseBox] = useState();
  const [useWideButtons, setUseWideButtons] = useState(false);

  // Root element reference
  const rootEl = useRef(null);

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
  }, []); // Init effect

  useEffect(() => {
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
  }, [props.buttons]);

  useEffect(() => {
    if (selected === "") return;

    setResponseBox(undefined);

    handleUserInput(questionKey, selected);

    setTimeout(() => {
      // See if there's response text to show
      const selectedButton = buttons.find(button => {
        return button.value === selected;
      });

      if (selectedButton) setResponseBox(selectedButton.response);

      // Set previous state
      if (setUserInputState) {
        setUserInputState(prevState => {
          return { ...prevState, [questionKey]: selected };
        });
      }
    }, 100);
  }, [selected]);

  useEffect(() => {
    const el: any = rootEl.current;
    const panelWidth: number = el.getBoundingClientRect().width;

    if (panelWidth > 400) setUseWideButtons(true);
    else setUseWideButtons(false);
  }, [windowWidth]);

  return (
    <div
      ref={rootEl}
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
                {useWideButtons ? (
                  <BackgroundSvgWide
                    shapeIndex={iteration}
                    color={
                      somethingSelected && !isSelected
                        ? "rgba(63, 82, 104, 0.5)"
                        : color
                    }
                    selected={isSelected}
                  />
                ) : (
                  <BackgroundSvg
                    shapeIndex={iteration}
                    color={
                      somethingSelected && !isSelected
                        ? "rgba(63, 82, 104, 0.5)"
                        : color
                    }
                    selected={isSelected}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <CSSTransition
        in={typeof responseBox !== "undefined"}
        timeout={500}
        classNames={"response-box-styles"}
      >
        <div className={styles.responseBox} style={{ color: `${color}` }}>
          {responseBox}
        </div>
      </CSSTransition>
    </div>
  );
};

export default UserInputBox;
