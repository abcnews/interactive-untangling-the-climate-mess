import React, { useState, SyntheticEvent, useEffect } from "react";
import styles from "./styles.scss";

interface Button {
  label: string; value: string
}

interface UserInputBoxProps {
  title: string;
  buttons?: Button[];
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
        { label: "Of course we can", value: "1" },
        { label: "Yes I think we can", value: "2" },
        { label: "Probably not", value: "3" },
        { label: "No way we're screwed", value: "4" },
      ]);
    } else {
      setButtons(props.buttons);
    }
  }, []); // Init

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
