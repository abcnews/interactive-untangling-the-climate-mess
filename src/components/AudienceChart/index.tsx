import React from "react";
import styles from "./styles.scss";

// Some constants
const GREYED_OUT_COLOR = "#C6C8CE";
const OUTLINE_COLOR = "#808093";

const Bar = ({
  color,
  percent,
  title,
  textColor,
  index = 0,
  greyedOut = false,
  ...props
}) => {
  const NUMBER_OF_VARIATIONS = 4;
  return (
    <div className={styles.barContainer}>
      <div
        className={styles.text}
        style={{ color: greyedOut ? GREYED_OUT_COLOR : textColor }}
      >
        {title}
      </div>
      {index % NUMBER_OF_VARIATIONS === 0 && (
        <div className={styles.bar}>
          <svg
            className={styles.outline}
            width="286"
            height="16"
            viewBox="0 0 286 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="fill_gradient">
                <stop offset={`${percent}%`} stopColor={color} />
                <stop
                  offset={`${percent}%`}
                  stopColor="transparent"
                  stopOpacity="1"
                />
              </linearGradient>
              <linearGradient id="stroke_gradient">
                <stop offset={`${percent}%`} stopColor={color} />
                <stop
                  offset={`${percent}%`}
                  stopColor={OUTLINE_COLOR}
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>
            <path
              d="M284.703 6.66865L284.702 6.65962L284.701 6.65058C284.688 6.53712 284.61 6.27006 284.406 5.87968C284.211 5.50786 283.932 5.08313 283.583 4.66399C282.871 3.81158 281.945 3.07373 280.95 2.77692C278.459 2.03366 273.17 1.56154 266.409 1.29516C259.699 1.03077 251.673 0.971762 243.801 1.01103C235.93 1.05029 228.223 1.1877 222.152 1.31537C219.94 1.36188 217.941 1.40722 216.23 1.44603C213.257 1.51346 211.152 1.56119 210.307 1.56119C209.727 1.56119 206.903 1.55418 202.326 1.54282C186.13 1.50264 147.995 1.40803 109.74 1.37685C85.2033 1.35686 60.614 1.36295 41.7221 1.42622C32.2759 1.45785 24.2561 1.50377 18.3803 1.56784C12.4601 1.63239 8.80222 1.71555 7.99728 1.81161C5.68475 2.08756 4.20892 3.254 3.28827 4.62645C2.34558 6.03178 1.98856 7.65553 1.98856 8.73475C1.98856 10.0737 2.68539 11.3116 4.02505 12.3285C5.37366 13.3523 7.32437 14.1038 9.6282 14.4016C9.82059 14.4265 10.6436 14.4584 12.1345 14.4889C13.5871 14.5187 15.6029 14.5467 18.1111 14.5729C23.1267 14.6254 30.1013 14.6709 38.4557 14.7104C55.1639 14.7892 77.3847 14.8439 100.477 14.8816C146.66 14.9571 196.324 14.9652 212.334 14.9652C217.411 14.9652 222.237 14.9748 226.807 14.984C240.676 15.0117 252.191 15.0347 261.245 14.7691C267.264 14.5926 272.162 14.2892 275.922 13.7806C279.729 13.2655 282.205 12.5579 283.515 11.6772C284.592 10.9534 284.901 10.2203 284.979 9.49643C285.047 8.85751 284.948 8.23824 284.829 7.49673C284.787 7.23765 284.744 6.96363 284.703 6.66865Z"
              stroke="url(#stroke_gradient)"
              strokeWidth="2"
              fill={"url(#fill_gradient)"}
            />
          </svg>
        </div>
      )}
      {index % NUMBER_OF_VARIATIONS === 1 && (
        <svg
          width={`${percent}%`}
          height="16"
          viewBox="0 0 28 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0.919938 1.81866C0.438034 2.56314 0.0850998 5.38149 0.0590111 6.53417C0.00683375 8.52516 -0.136706 10.736 0.372086 12.5072C1.54608 16.5939 6.32031 15.9652 14.2252 15.9652C20.4082 15.9652 25.5504 15.9329 26.3564 15.3934C27.2956 14.7646 28 12.1928 28 8.73475C28 6.21981 27.6869 1.4474 26.6695 0.818651C25.3185 -0.0161895 15.634 0.561187 14.6165 0.561187C13.599 0.561187 2.95485 -1.32502 0.919938 1.81866Z"
            fill={greyedOut ? GREYED_OUT_COLOR : color}
          />
        </svg>
      )}
      {index % NUMBER_OF_VARIATIONS === 2 && (
        <svg
          width={`${percent}%`}
          height="16"
          viewBox="0 0 57 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M1.87273 14.1813C0.891713 13.4369 0.173239 10.6185 0.12013 9.46583C0.0139116 7.47484 -0.278294 5.264 0.757461 3.49285C3.14737 -0.593925 12.8664 0.0348082 28.9584 0.0348082C41.5453 0.0348082 52.0133 0.0670671 53.6541 0.60664C55.5661 1.23537 57 3.80721 57 7.26525C57 9.78019 56.3627 14.5526 54.2914 15.1813C51.5413 16.0162 31.8263 15.4388 29.755 15.4388C27.6838 15.4388 6.01523 17.325 1.87273 14.1813Z"
            fill={greyedOut ? GREYED_OUT_COLOR : color}
          />
        </svg>
      )}
      {index % NUMBER_OF_VARIATIONS === 3 && (
        <svg
          width={`${percent}%`}
          height="16"
          viewBox="0 0 113 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M3.74545 1.81866C1.78341 2.56314 0.346467 5.38149 0.240249 6.53417C0.0278123 8.52516 -0.520965 12.4642 2.00001 13.5C8 15.9652 25.7327 15.9652 57.9168 15.9652C83.0906 15.9652 104.718 16.0396 108 15.5C111.824 14.8713 112.5 12.458 112.5 9C112.5 6.48506 112.725 2.4474 108.583 1.81865C103.083 0.983811 63.6525 0.561187 59.51 0.561187C55.3675 0.561187 12.0305 -1.32502 3.74545 1.81866Z"
            fill={greyedOut ? GREYED_OUT_COLOR : color}
          />
        </svg>
      )}
      <div className={styles.convinced}>
        <span style={{ color: greyedOut ? GREYED_OUT_COLOR : textColor }}>
          {percent}% convinced
        </span>
        <span>XX% not convinced</span>
      </div>
    </div>
  );
};

interface BarChartProps {
  heading?: string;
  bars?: any[];
  greyedOutBars?: any[];
}

const BarChart: React.FC<BarChartProps> = ({
  heading = undefined,
  bars = [{ title: "Enery", percent: 33 }],
  greyedOutBars = [],
  ...props
}) => {
  return (
    <div className={styles.root}>
      {heading && <h3 className={styles.heading}>{heading}</h3>}
      {bars?.map((bar, index: number) => (
        <Bar
          key={index}
          percent={bar.percent}
          color={bar.color}
          title={bar.title}
          textColor={bar.textColor}
          index={index}
          greyedOut={greyedOutBars.includes(index)}
        />
      ))}
    </div>
  );
};

export default BarChart;
