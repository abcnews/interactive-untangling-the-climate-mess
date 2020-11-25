import React, { useEffect } from "react";
import { Portal } from "react-portal";
import SVG from "react-inlinesvg";

// Import stylsheets
import styles from "./styles.scss";

// Import components
import UserInputBox from "../UserInputBox/index";

// Import other stuff
import untangleAnimation from "./untangle-animation.svg";

interface AppProps {
  projectName: string;
}

const App: React.FC<AppProps> = ({ projectName }) => {
  // TESTING SCHEDULER TO HANDLE ONSCROLL AND RESIZE ON BACKGROUND
  // const { subscribe, unsubscribe } = window.__ODYSSEY__.scheduler;

  // const onUpdate = () => {
  //   console.log("updated...");
  // };

  // useEffect(() => {
  //   subscribe(onUpdate);
  //   return () => unsubscribe(onUpdate);
  // }, []);

  return (
    <>
      <Portal node={document && document.getElementById("portalmount")}>
        <div className={styles.svgAnimation}>
          <SVG src={untangleAnimation} />
        </div>
      </Portal>

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

      <Portal node={document && document.getElementById("inputcarscansaveus")}>
        <UserInputBox
          title={"So how are you feeling about EVs now?"}
          buttons={[
            { label: "CARS CAN SAVE US", value: "1" },
            { label: "UTEPOCALYPSE IS NIGH", value: "2" },
          ]}
        />
      </Portal>

      <Portal
        node={document && document.getElementById("inputfossiltransport")}
      >
        <UserInputBox
          title={
            "So now you know how we quit fossil fuels in our transport system, can we do it?"
          }
          buttons={[
            { label: "That's a piece of cake", value: "1" },
            { label: "It can be done", value: "2" },
            { label: "This sounds like a stretch", value: "3" },
            { label: "You're dreaming", value: "4" },
          ]}
        />
      </Portal>

      <Portal node={document && document.getElementById("inputbigseaweed")}>
        <UserInputBox
          title={"Where are you splashing your cash?"}
          buttons={[
            { label: "BIG SEAWEED", value: "1" },
            { label: "BIG FOSSIL", value: "2" },
          ]}
        />
      </Portal>

      <Portal node={document && document.getElementById("inputmosquito")}>
        <UserInputBox
          title={"What should we be?"}
          buttons={[
            { label: "MOSQUITO", value: "1" },
            { label: "DUNG BEETLE", value: "2" },
          ]}
        />
      </Portal>
    </>
  );
};

export default App;
