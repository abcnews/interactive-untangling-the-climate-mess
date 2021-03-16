/** @format */

import React from "react";
import styles from "./styles.scss";

type DynamicTextProps = {
  watchForKey: string;
  userInputState: any;
};

function getFinalText(userResponse) {
  if (!userResponse) return "";

  if (userResponse === "certain" || userResponse === "hopeful") {
    return "Ok, so you’re onboard - but how do we get there? Let’s see if you’re still convinced after reading what it takes.";
  } else
    return "Ok that's fair enough - we'd be skeptical too - but let’s see how you feel after reading what’s involved with cancelling Australia’s emissions.";
}

const DynamicText: React.FC<DynamicTextProps> = props => {
  const { watchForKey, userInputState } = props;

  const userResponse = userInputState[watchForKey];

  // console.log("Dynamic Text Component:", userResponse);

  const finalText: string = getFinalText(userResponse);

  return <p className={styles.root}>{finalText}</p>;
};

export default DynamicText;
