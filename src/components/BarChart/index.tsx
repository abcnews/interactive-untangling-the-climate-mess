import React from "react";
import styles from "./styles.scss";

// Some constants
const GREYED_OUT_COLOR = "#C6C8CE";

const Bar = ({
  color,
  percent,
  title,
  textColor,
  index = 0,
  greyedOut = false,
  label,
  ...props
}) => {
  const NUMBER_OF_VARIATIONS = 4;
  return (
    <div className={styles.barContainer}>
      <div
        className={styles.text}
        style={{ color: greyedOut ? GREYED_OUT_COLOR : textColor }}
      >
        {title}:{" "}
        {label ? (
          <span style={{ color: greyedOut ? GREYED_OUT_COLOR : textColor }}>
            {label}
          </span>
        ) : (
          <span style={{ color: greyedOut ? GREYED_OUT_COLOR : textColor }}>
            {percent}% of emissions
          </span>
        )}
      </div>
      {/* Because this is not dynamic we can cheat here a bit and have pre-rendered SVGs */}
      {index % NUMBER_OF_VARIATIONS === 0 && (
        <svg
          width={`${percent}%`}
          height="16"
          viewBox="0 0 93 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M89.9445 1.81866C91.5451 2.56314 92.7173 5.38149 92.804 6.53417C92.9773 8.52516 93.4541 10.736 91.7641 12.5072C87.8648 16.5939 72.0075 15.9652 45.7521 15.9652C25.2156 15.9652 8.13615 15.9329 5.45906 15.3934C2.3396 14.7646 0 12.1928 0 8.73475C0 6.21981 1.03983 1.4474 4.41924 0.818651C8.90637 -0.0161895 41.0729 0.561187 44.4523 0.561187C47.8317 0.561187 83.1857 -1.32502 89.9445 1.81866Z"
            fill={greyedOut ? GREYED_OUT_COLOR : color}
          />
        </svg>
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
    </div>
  );
};

interface BarChartProps {
  heading?: string;
  bars?: any[];
}

const BarChart: React.FC<BarChartProps> = ({
  heading = undefined,
  bars = [{ title: "Enery", percent: 33 }],
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
          greyedOut={bar.greyedOut}
          label={bar.label}
        />
      ))}
    </div>
  );
};

export default BarChart;
