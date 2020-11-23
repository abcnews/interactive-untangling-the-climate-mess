import React from "react";
import { Portal } from "react-portal";

// Import stylsheets
import styles from "./styles.scss";

// Import components
import UserInputBox from "../UserInputBox/index";

interface AppProps {
  projectName: string;
}

const App: React.FC<AppProps> = ({ projectName }) => {
  return (
    <>
      {/* <div className={styles.root}>
        <h1>{projectName}</h1>
      </div> */}

      <Portal node={document && document.getElementById("inputtier1")}>
        <UserInputBox title={"Can we still save the world?"} />
      </Portal>

      <Portal node={document && document.getElementById("inputradelaide")}>
        <UserInputBox
          title={"Still laughing at South Australia?"}
          buttons={[
            { label: "No, good one Radelaide", value: "1" },
            { label: "Yes, they speak funny", value: "2" },
          ]}
        />
      </Portal>

      <Portal node={document && document.getElementById("inputtoast")}>
        <UserInputBox
          title={
            "So what do you reckon, can you have your toast in a zero carbon world and eat it too?"
          }
          buttons={[
            { label: "Yeah", value: "1" },
            { label: "Nah", value: "2" },
          ]}
        />
      </Portal>

      <Portal node={document && document.getElementById("inputzerocarbon")}>
        <UserInputBox
          title={"So - what do you reckon our chances of doing this are?"}
          buttons={[
            { label: "That's a piece of cake", value: "1" },
            { label: "It can be done", value: "2" },
            { label: "This sounds like a stretch", value: "3" },
            { label: "You're dreaming", value: "4" },
          ]}
        />
      </Portal>

      {/* So - what do you reckon our chances of doing this are? */}
    </>
  );
};

export default App;
