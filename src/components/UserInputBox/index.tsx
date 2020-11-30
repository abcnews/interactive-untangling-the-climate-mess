import React, { useState, SyntheticEvent, useEffect } from "react";
import styles from "./styles.scss";

interface Button {
  label: string;
  value: string;
}

interface UserInputBoxProps {
  title: string;
  buttons?: Button[];
  poll?: any;
}

const UserInputBox: React.FC<UserInputBoxProps> = (props) => {
  const [buttons, setButtons] = useState([{ label: "", value: "" }]);
  const [selected, setSelected] = useState("");

  const handleClick = (e: SyntheticEvent) => {
    const selectedId = (e.target as Element).id;
    setSelected(selectedId);
  };

  useEffect(() => {
    // Set some default buttons
    if (!props.buttons) {
      setButtons([
        { label: "Of course we can", value: "Of course we can" },
        { label: "Yes I think we can", value: "Yes I think we can" },
        { label: "Probably not", value: "Probably not" },
        { label: "No way we're screwed", value: "No way we're screwed" },
      ]);
    } else {
      setButtons(props.buttons);
    }
  }, []); // Init

  useEffect(() => {
    if (selected === "") return;
    
    if (props.poll) {
      props.poll.increment(
        {
          question: props.title,
          answer: selected,
        },
        (err, result) => {
          console.log(result);
        }
      );
    }
  }, [selected]);

  return (
    <div className={styles.root}>
      <h2>{props.title}</h2>
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
