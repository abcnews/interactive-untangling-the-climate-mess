import React, { useEffect, useRef } from "react";
import styles from "./styles.scss";

// Some constants
const GREYED_OUT_COLOR = "#C6C8CE";
const OUTLINE_COLOR = "#808093";

const BarDesktop = ({
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
            width="396"
            height="17"
            viewBox="0 0 396 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`audience_chart_fill_gradient_${index}`}>
                <stop offset={`${percent}%`} stopColor={color} />
                <stop
                  offset={`${percent}%`}
                  stopColor="transparent"
                  stopOpacity="1"
                />
              </linearGradient>
              <linearGradient id={`audience_chart_stroke_gradient_${index}`}>
                <stop offset={`${percent}%`} stopColor={color} />
                <stop
                  offset={`${percent}%`}
                  stopColor={OUTLINE_COLOR}
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>
            <path
              d="M394.144 7.82133L394.143 7.8123L394.142 7.80326C394.129 7.6898 394.051 7.42274 393.847 7.03236C393.652 6.66054 393.373 6.23581 393.023 5.81667C392.312 4.96426 391.386 4.22641 390.391 3.92961C389.841 3.76544 388.676 3.5902 386.879 3.42185C385.114 3.25643 382.819 3.10398 380.066 2.9639C374.562 2.68383 367.26 2.45485 358.767 2.26827C341.784 1.89515 320.068 1.69215 298.512 1.58737C261.156 1.4058 224.298 1.51923 213.403 1.55276C211.724 1.55792 210.661 1.56119 210.308 1.56119C209.728 1.56119 206.904 1.55419 202.326 1.54283C186.131 1.50265 147.996 1.40803 109.74 1.37686C85.2036 1.35687 60.6141 1.36296 41.7222 1.42623C32.2759 1.45786 24.2561 1.50378 18.3803 1.56785C12.4601 1.6324 8.80212 1.71556 7.99719 1.81161C5.68466 2.08757 4.20883 3.25401 3.28818 4.62646C2.34549 6.03179 1.98846 7.65553 1.98846 8.73475C1.98846 10.0737 2.6853 11.3116 4.02496 12.3286C5.37357 13.3523 7.32428 14.1038 9.62811 14.4016C9.8205 14.4265 10.6435 14.4584 12.1344 14.4889C13.587 14.5187 15.6028 14.5467 18.111 14.5729C23.1267 14.6254 30.1013 14.6709 38.4557 14.7104C55.1641 14.7893 77.3849 14.8439 100.477 14.8816C146.661 14.9571 196.325 14.9652 212.335 14.9652C220.312 14.9652 231.799 15.0326 245.18 15.1111C266.2 15.2344 291.893 15.3851 315.994 15.3451C335.701 15.3123 354.309 15.1519 368.367 14.7446C375.398 14.5409 381.278 14.2758 385.583 13.9354C387.738 13.765 389.481 13.5771 390.77 13.3717C391.415 13.2688 391.929 13.1643 392.316 13.0603C392.728 12.9495 392.909 12.8612 392.956 12.8299C394.033 12.1061 394.342 11.3729 394.42 10.6491C394.488 10.0102 394.389 9.39092 394.27 8.64942C394.228 8.39033 394.184 8.11632 394.144 7.82133Z"
              stroke={`url(#audience_chart_stroke_gradient_${index})`}
              strokeWidth="2"
              fill={`url(#audience_chart_fill_gradient_${index})`}
            />
          </svg>
        </div>
      )}
      {index % NUMBER_OF_VARIATIONS === 1 && (
        <svg
          className={styles.outline}
          width="396"
          height="17"
          viewBox="0 0 396 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`audience_chart_fill_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor="transparent"
                stopOpacity="1"
              />
            </linearGradient>
            <linearGradient id={`audience_chart_stroke_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor={OUTLINE_COLOR}
                stopOpacity="1"
              />
            </linearGradient>
          </defs>

          <path
            d="M394.63 6.66865L394.629 6.65962L394.628 6.65058C394.615 6.53712 394.537 6.27006 394.333 5.87968C394.138 5.50786 393.859 5.08313 393.509 4.66399C392.798 3.81158 391.872 3.07373 390.877 2.77692C390.329 2.61358 389.165 2.44245 387.365 2.28255C385.596 2.12552 383.297 1.98538 380.537 1.86103C375.02 1.6124 367.699 1.42839 359.184 1.29582C342.155 1.03071 320.378 0.971747 298.761 1.01104C264.882 1.07262 231.338 1.37604 217.186 1.50405C213.295 1.53925 210.87 1.56119 210.307 1.56119C209.727 1.56119 206.903 1.55418 202.326 1.54282C186.13 1.50264 147.995 1.40803 109.74 1.37685C85.2032 1.35686 60.6139 1.36295 41.722 1.42622C32.2758 1.45785 24.256 1.50377 18.3802 1.56784C12.46 1.63239 8.80209 1.71555 7.99716 1.81161C5.68463 2.08756 4.2088 3.254 3.28815 4.62645C2.34546 6.03178 1.98843 7.65552 1.98843 8.73475C1.98843 10.0737 2.68527 11.3116 4.02493 12.3285C5.37354 13.3523 7.32425 14.1038 9.62808 14.4016C9.82047 14.4265 10.6435 14.4584 12.1344 14.4889C13.5869 14.5187 15.6028 14.5467 18.111 14.5729C23.1266 14.6254 30.1012 14.6709 38.4556 14.7104C55.1638 14.7892 77.3846 14.8439 100.477 14.8816C146.66 14.9571 196.324 14.9652 212.334 14.9652C216.464 14.9652 221.548 14.9716 227.356 14.9789C250.338 15.0078 284.671 15.051 316.229 14.7688C335.997 14.5919 354.666 14.2875 368.77 13.7722C375.824 13.5146 381.723 13.2046 386.042 12.8328C388.203 12.6467 389.952 12.4466 391.244 12.2329C391.892 12.1259 392.408 12.0182 392.796 11.912C393.21 11.7989 393.394 11.7097 393.442 11.6772C394.519 10.9534 394.828 10.2203 394.906 9.49643C394.974 8.85751 394.875 8.23824 394.756 7.49673C394.714 7.23765 394.67 6.96363 394.63 6.66865Z"
            stroke={`url(#audience_chart_stroke_gradient_${index})`}
            strokeWidth="2"
            fill={`url(#audience_chart_fill_gradient_${index})`}
          />
        </svg>
      )}
      {index % NUMBER_OF_VARIATIONS === 2 && (
        <svg
          className={styles.outline}
          width="396"
          height="17"
          viewBox="0 0 396 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`audience_chart_fill_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor="transparent"
                stopOpacity="1"
              />
            </linearGradient>
            <linearGradient id={`audience_chart_stroke_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor={OUTLINE_COLOR}
                stopOpacity="1"
              />
            </linearGradient>
          </defs>
          <path
            d="M394.13 6.66865L394.129 6.65962L394.128 6.65058C394.115 6.53712 394.037 6.27006 393.833 5.87968C393.638 5.50786 393.359 5.08313 393.009 4.66399C392.298 3.81158 391.372 3.07373 390.377 2.77692C389.829 2.61353 388.667 2.44242 386.87 2.28254C385.105 2.12551 382.811 1.98537 380.059 1.86103C374.555 1.6124 367.254 1.42839 358.762 1.29582C341.78 1.03071 320.066 0.971747 298.511 1.01104C264.741 1.0726 231.305 1.37585 217.184 1.50393C213.295 1.5392 210.871 1.56119 210.307 1.56119C209.728 1.56119 206.903 1.55418 202.326 1.54282C186.13 1.50264 147.995 1.40803 109.74 1.37685C85.2033 1.35686 60.614 1.36295 41.7221 1.42622C32.2758 1.45785 24.2561 1.50377 18.3802 1.56784C12.4601 1.63239 8.80215 1.71555 7.99722 1.81161C5.68469 2.08756 4.20886 3.254 3.28821 4.62645C2.34552 6.03178 1.98849 7.65552 1.98849 8.73475C1.98849 10.0737 2.68533 11.3116 4.02499 12.3285C5.3736 13.3523 7.32431 14.1038 9.62814 14.4016C9.82053 14.4265 10.6436 14.4584 12.1344 14.4889C13.587 14.5187 15.6028 14.5467 18.111 14.5729C23.1267 14.6254 30.1013 14.6709 38.4557 14.7104C55.1639 14.7892 77.3847 14.8439 100.477 14.8816C146.66 14.9571 196.325 14.9652 212.334 14.9652C216.467 14.9652 221.55 14.9716 227.354 14.9789C250.3 15.0078 284.527 15.051 315.979 14.7688C335.684 14.5919 354.291 14.2875 368.348 13.7722C375.378 13.5146 381.258 13.2046 385.563 12.8328C387.717 12.6467 389.461 12.4466 390.75 12.2329C391.395 12.126 391.91 12.0183 392.297 11.9121C392.71 11.7991 392.893 11.7099 392.942 11.6772C394.019 10.9534 394.328 10.2203 394.406 9.49643C394.474 8.85751 394.375 8.23824 394.256 7.49673C394.214 7.23765 394.17 6.96363 394.13 6.66865Z"
            stroke={`url(#audience_chart_stroke_gradient_${index})`}
            strokeWidth="2"
            fill={`url(#audience_chart_fill_gradient_${index})`}
          />
        </svg>
      )}
      {index % NUMBER_OF_VARIATIONS === 3 && (
        <svg
          className={styles.outline}
          width="396"
          height="17"
          viewBox="0 0 396 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`audience_chart_fill_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor="transparent"
                stopOpacity="1"
              />
            </linearGradient>
            <linearGradient id={`audience_chart_stroke_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor={OUTLINE_COLOR}
                stopOpacity="1"
              />
            </linearGradient>
          </defs>
          <path
            d="M393.13 6.66865L393.129 6.65962L393.128 6.65058C393.115 6.53712 393.037 6.27006 392.833 5.87968C392.638 5.50786 392.359 5.08313 392.009 4.66399C391.298 3.81158 390.372 3.07373 389.377 2.77692C388.829 2.61344 387.67 2.44236 385.881 2.2825C384.124 2.12549 381.84 1.98536 379.101 1.86102C373.625 1.6124 366.363 1.42838 357.918 1.29581C341.03 1.03071 319.441 0.971747 298.011 1.01104C264.458 1.07256 231.24 1.37547 217.178 1.50369C213.295 1.5391 210.872 1.56119 210.308 1.56119C209.728 1.56119 206.903 1.55418 202.326 1.54282C186.13 1.50264 147.995 1.40803 109.74 1.37685C85.2033 1.35686 60.614 1.36295 41.7221 1.42622C32.2759 1.45785 24.2561 1.50377 18.3803 1.56784C12.4601 1.63239 8.80219 1.71555 7.99725 1.81161C5.68472 2.08756 4.20889 3.254 3.28824 4.62645C2.34555 6.03178 1.98853 7.65553 1.98853 8.73475C1.98853 10.0737 2.68536 11.3116 4.02502 12.3285C5.37363 13.3523 7.32434 14.1038 9.62817 14.4016C9.82056 14.4265 10.6436 14.4584 12.1345 14.4889C13.5871 14.5187 15.6028 14.5467 18.1111 14.5729C23.1267 14.6254 30.1013 14.6709 38.4557 14.7104C55.1639 14.7892 77.3847 14.8439 100.477 14.8816C146.66 14.9571 196.325 14.9652 212.334 14.9652C216.473 14.9652 221.554 14.9716 227.35 14.9789C250.224 15.0079 284.237 15.0509 315.479 14.7688C335.059 14.5919 353.541 14.2875 367.504 13.7723C374.487 13.5146 380.328 13.2046 384.605 12.8328C386.746 12.6468 388.478 12.4467 389.76 12.2331C390.402 12.1261 390.913 12.0185 391.299 11.9124C391.709 11.7996 391.893 11.7104 391.942 11.6772C393.019 10.9534 393.328 10.2203 393.406 9.49643C393.474 8.85751 393.375 8.23824 393.256 7.49673C393.214 7.23765 393.17 6.96363 393.13 6.66865Z"
            stroke={`url(#audience_chart_stroke_gradient_${index})`}
            strokeWidth="2"
            fill={`url(#audience_chart_fill_gradient_${index})`}
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
              <linearGradient id={`audience_chart_fill_gradient_${index}`}>
                <stop offset={`${percent}%`} stopColor={color} />
                <stop
                  offset={`${percent}%`}
                  stopColor="transparent"
                  stopOpacity="1"
                />
              </linearGradient>
              <linearGradient id={`audience_chart_stroke_gradient_${index}`}>
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
              stroke={`url(#audience_chart_stroke_gradient_${index})`}
              strokeWidth="2"
              fill={`url(#audience_chart_fill_gradient_${index})`}
            />
          </svg>
        </div>
      )}
      {index % NUMBER_OF_VARIATIONS === 1 && (
        <svg
          className={styles.outline}
          width="286"
          height="16"
          viewBox="0 0 286 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`audience_chart_fill_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor="transparent"
                stopOpacity="1"
              />
            </linearGradient>
            <linearGradient id={`audience_chart_stroke_gradient_${index}`}>
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
            stroke={`url(#audience_chart_stroke_gradient_${index})`}
            strokeWidth="2"
            fill={`url(#audience_chart_fill_gradient_${index})`}
          />
        </svg>
      )}
      {index % NUMBER_OF_VARIATIONS === 2 && (
        <svg
          className={styles.outline}
          width="286"
          height="16"
          viewBox="0 0 286 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`audience_chart_fill_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor="transparent"
                stopOpacity="1"
              />
            </linearGradient>
            <linearGradient id={`audience_chart_stroke_gradient_${index}`}>
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
            stroke={`url(#audience_chart_stroke_gradient_${index})`}
            strokeWidth="2"
            fill={`url(#audience_chart_fill_gradient_${index})`}
          />
        </svg>
      )}
      {index % NUMBER_OF_VARIATIONS === 3 && (
        <svg
          className={styles.outline}
          width="286"
          height="16"
          viewBox="0 0 286 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`audience_chart_fill_gradient_${index}`}>
              <stop offset={`${percent}%`} stopColor={color} />
              <stop
                offset={`${percent}%`}
                stopColor="transparent"
                stopOpacity="1"
              />
            </linearGradient>
            <linearGradient id={`audience_chart_stroke_gradient_${index}`}>
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
            stroke={`url(#audience_chart_stroke_gradient_${index})`}
            strokeWidth="2"
            fill={`url(#audience_chart_fill_gradient_${index})`}
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
  windowWidth?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  heading = undefined,
  bars = [{ title: "Enery", percent: 33 }],
  greyedOutBars = [],
  windowWidth,
  ...props
}) => {
  const rootEl = useRef(null);
  const [useWideBars, setUseWideBars] = React.useState(false);

  useEffect(() => {
    const el: any = rootEl.current;
    const panelWidth: number = el.getBoundingClientRect().width;

    if (panelWidth > 400) setUseWideBars(true);
    else setUseWideBars(false);
  }, [windowWidth]);

  return (
    <div ref={rootEl} className={styles.root}>
      {heading && <h3 className={styles.heading}>{heading}</h3>}
      {bars?.map((bar, index: number) => {
        return useWideBars ? (
          <BarDesktop
            key={index}
            percent={bar.percent}
            color={bar.color}
            title={bar.title}
            textColor={bar.textColor}
            index={index}
            greyedOut={greyedOutBars.includes(index)}
          />
        ) : (
          <Bar
            key={index}
            percent={bar.percent}
            color={bar.color}
            title={bar.title}
            textColor={bar.textColor}
            index={index}
            greyedOut={greyedOutBars.includes(index)}
          />
        );
      })}
    </div>
  );
};

export default BarChart;
