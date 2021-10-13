import React from "react";
import Portal from "react-portal";
import a2o from "@abcnews/alternating-case-to-object";

import styles from "./styles.scss";

const BackgroundShape = ({ color = "#2A4059" }) => {
  return (
    <div className={styles.svgContainer}>
      <svg
        width="284"
        height="46"
        viewBox="0 0 284 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1" fill="white">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M254.694 25.6358L254.694 25.6408C254.691 25.6646 254.679 25.7751 254.626 25.9928C254.56 26.2671 254.448 26.6293 254.279 27.0832C253.94 27.9937 253.425 29.1288 252.754 30.4352C251.414 33.0423 249.555 36.1312 247.539 39.1263C246.919 40.0473 246.289 40.9516 245.661 41.8234C244.795 43.0254 243.589 43.7122 242.305 43.7786C203.091 45.8035 145.901 46 138.771 46C128.564 46 31.4023 44.8203 17.8486 42.4898C7.64084 40.7347 4.5 30.2041 4.5 23.1837C4.5 13.5306 11.5669 9.14284 20.9895 7.38774C29.0758 5.88153 80.6655 3 142.697 3C156.121 3.51032 173.142 3.86848 187.302 4.16645L187.302 4.16645C193.012 4.28662 198.258 4.397 202.614 4.50361C219.083 4.90666 227.923 5.25601 239.428 5.87755C240.574 5.93947 241.672 6.49634 242.521 7.4721C244.384 9.61314 246.345 11.9826 248.151 14.3483C250.093 16.8923 251.799 19.3604 253.003 21.4896C254.295 23.7719 254.689 25.1239 254.694 25.6358ZM61.7133 8.42107C83.3334 7.51418 111.689 6.79481 142.652 6.79412C156.091 7.30434 173.127 7.66285 187.278 7.96063L187.278 7.96063C192.981 8.08064 198.215 8.19079 202.556 8.29702C219.007 8.69962 227.823 9.04818 239.3 9.66821C239.764 9.69331 240.189 9.918 240.503 10.2799C242.33 12.3791 244.242 14.6903 245.993 16.9833C247.888 19.4662 249.481 21.7833 250.564 23.6973C251.03 24.5218 251.331 25.1509 251.517 25.5941C251.252 26.2817 250.831 27.2145 250.238 28.3676C248.987 30.8032 247.211 33.7599 245.254 36.667C244.656 37.5563 244.049 38.4285 243.444 39.2679C243.138 39.6929 242.696 39.961 242.182 39.9876C203.036 42.009 145.901 42.2059 138.771 42.2059C133.692 42.2059 106.87 41.9114 79.6157 41.3253C65.991 41.0323 52.2722 40.6667 41.1183 40.2291C29.8786 39.7883 21.4495 39.2799 18.2528 38.7303C13.9911 37.9975 11.3938 35.5119 9.8053 32.6376C8.15559 29.6526 7.5 26.0583 7.5 23.1837C7.5 19.7853 8.65566 17.3829 10.8939 15.4651C13.2894 13.4126 16.8889 11.9866 21.4266 11.1414C25.2623 10.4269 39.9816 9.33265 61.7133 8.42107ZM260.579 20.2754C259.996 18.7172 259.243 17.2493 258.531 15.9912C257.588 14.3247 256.464 12.5934 255.256 10.8751C255.92 10.9192 256.539 10.9641 257.08 11.0098C257.082 11.0116 257.084 11.0137 257.087 11.0162C257.09 11.0189 257.093 11.022 257.096 11.0256C257.647 11.6132 258.207 12.1974 258.764 12.7777C260.358 14.4389 261.921 16.0683 263.133 17.6527C264.834 19.8767 265.608 21.208 266.679 23.2132C267.12 24.039 267.423 24.8603 267.611 25.5336C267.749 26.0285 267.797 26.343 267.814 26.4619C267.797 26.5489 267.756 26.7367 267.659 27.0398C267.481 27.5939 267.165 28.3749 266.647 29.3846C265.646 31.3397 264.168 33.6211 262.405 35.9897C261.84 36.7485 261.257 37.5007 260.666 38.2379C260.377 38.5986 259.984 38.8197 259.554 38.8459C258.66 38.9004 257.645 38.9537 256.594 39.0063C257.278 37.8259 257.915 36.6665 258.486 35.5556C259.27 34.0295 259.988 32.4809 260.53 31.0255C260.989 29.7928 261.651 27.791 261.651 25.6458C261.651 23.6625 261.151 21.8053 260.579 20.2754ZM264.589 38.5907C266.421 36.1294 268.03 33.6638 269.165 31.4477C270.348 29.1387 270.823 27.4689 270.823 26.4872C270.823 25.5503 270.356 23.3184 269.165 21.0893C268.023 18.9507 267.141 17.4357 265.289 15.0147C263.948 13.262 262.188 11.4278 260.559 9.72967C260.029 9.17829 259.514 8.64125 259.031 8.12599C258.546 7.60767 257.949 7.28113 257.315 7.22712C255.955 7.11122 254.102 7.00111 252.308 6.89631L252.21 6.89058L251.987 6.87759L251.496 6.84894C251.17 6.82989 250.85 6.81102 250.537 6.79232C249.607 6.73672 249.102 8.19319 249.758 9.02919C249.98 9.3135 250.202 9.59837 250.421 9.88346C250.524 10.0167 250.626 10.15 250.728 10.2833C250.792 10.3667 250.855 10.4502 250.918 10.5337L250.982 10.617C252.922 13.1783 254.733 15.7973 256.091 18.1989C257.414 20.5368 258.651 23.2416 258.651 25.6458C258.651 26.901 258.245 28.2571 257.816 29.4093C257.353 30.6525 256.713 32.0427 255.97 33.488C255.051 35.2764 253.936 37.2246 252.717 39.198L252.698 39.2293C252.595 39.3947 252.492 39.5602 252.389 39.7259C252.149 40.1086 251.906 40.4917 251.66 40.8744C251.105 41.7372 251.617 43.0523 252.495 43.0067C252.624 43 252.754 42.9933 252.886 42.9866C253.144 42.9734 253.407 42.9602 253.675 42.947L254.175 42.9223L254.21 42.9205L254.999 42.8819L255 42.8819C256.638 42.8018 258.318 42.7198 259.698 42.6356C260.854 42.5652 261.949 41.9666 262.773 40.9392C263.388 40.1716 263.997 39.3859 264.589 38.5907ZM274.889 20.7727C274.371 19.3036 273.701 17.9196 273.068 16.7334C272.229 15.1621 271.229 13.5298 270.155 11.9097C270.745 11.9513 271.296 11.9936 271.777 12.0367C271.781 12.0402 271.786 12.0451 271.791 12.0516C272.281 12.6051 272.779 13.1554 273.273 13.7021L273.275 13.7036C274.692 15.2698 276.082 16.806 277.16 18.2999C278.673 20.3968 279.362 21.6521 280.314 23.5426C280.707 24.3212 280.976 25.0956 281.143 25.7304C281.266 26.197 281.309 26.4935 281.324 26.6056C281.309 26.6876 281.272 26.8647 281.186 27.1505C281.027 27.6729 280.746 28.4093 280.286 29.3613C279.395 31.2046 278.081 33.3556 276.513 35.5889C276.01 36.3043 275.492 37.0135 274.966 37.7085C274.709 38.0486 274.36 38.2571 273.977 38.2818C273.182 38.3332 272.279 38.3835 271.345 38.4331C271.953 37.3201 272.519 36.227 273.027 35.1796C273.724 33.7407 274.364 32.2806 274.845 30.9084C275.254 29.7461 275.842 27.8588 275.842 25.8362C275.842 23.9663 275.398 22.2152 274.889 20.7727ZM278.455 38.0412C280.085 35.7206 281.516 33.3959 282.525 31.3065C283.577 29.1295 284 27.5551 284 26.6294C284 25.7461 283.584 23.6418 282.525 21.5401C281.509 19.5238 280.725 18.0953 279.078 15.8127C277.886 14.1602 276.32 12.4309 274.871 10.8297C274.4 10.3099 273.942 9.80353 273.512 9.31772C273.08 8.82903 272.55 8.52115 271.986 8.47022C270.776 8.36095 269.128 8.25713 267.532 8.15833L267.445 8.15293L267.247 8.14067L266.81 8.11366C266.521 8.0957 266.235 8.07791 265.957 8.06028C265.13 8.00785 264.681 9.38108 265.264 10.1693C265.462 10.4374 265.659 10.7059 265.855 10.9747C265.901 11.0393 265.948 11.1039 265.995 11.1685C266.039 11.2296 266.083 11.2907 266.127 11.3518C266.184 11.4304 266.24 11.5091 266.297 11.5878L266.353 11.6663C268.078 14.0813 269.689 16.5505 270.898 18.8149C272.074 21.0192 273.174 23.5694 273.174 25.8362C273.174 27.0196 272.813 28.2982 272.431 29.3846C272.02 30.5567 271.45 31.8675 270.79 33.2301C269.972 34.9163 268.981 36.7532 267.896 38.6138L267.879 38.6433C267.788 38.7992 267.697 38.9553 267.604 39.1115C267.391 39.4723 267.175 39.8336 266.956 40.1944C266.463 41.0078 266.918 42.2478 267.699 42.2048C268.038 42.1861 268.389 42.1674 268.748 42.1485L269.193 42.1252L269.224 42.1236L269.926 42.0871L269.927 42.0871C271.384 42.0116 272.878 41.9343 274.106 41.8549C275.133 41.7885 276.107 41.2242 276.84 40.2554C277.387 39.5318 277.929 38.791 278.455 38.0412Z"
          />
        </mask>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M250.694 22.6358L250.694 22.6408C250.691 22.6646 250.679 22.7751 250.626 22.9928C250.56 23.2671 250.448 23.6293 250.279 24.0832C249.94 24.9937 249.425 26.1288 248.754 27.4352C247.414 30.0423 245.555 33.1312 243.539 36.1263C242.919 37.0473 242.289 37.9516 241.661 38.8234C240.795 40.0254 239.589 40.7122 238.305 40.7786C199.091 42.8035 141.901 43 134.771 43C124.564 43 27.4023 41.8203 13.8486 39.4898C3.64084 37.7347 0.5 27.2041 0.5 20.1837C0.5 10.5306 7.56693 6.14284 16.9895 4.38774C25.0758 2.88153 76.6655 0 138.697 0C152.121 0.510323 169.142 0.868483 183.302 1.16645L183.302 1.16645C189.012 1.28662 194.258 1.397 198.614 1.50361C215.083 1.90666 223.923 2.25601 235.428 2.87755C236.574 2.93947 237.672 3.49634 238.521 4.4721C240.384 6.61314 242.345 8.98264 244.151 11.3483C246.093 13.8923 247.799 16.3604 249.003 18.4896C250.295 20.7719 250.689 22.1239 250.694 22.6358ZM57.7133 5.42107C79.3334 4.51418 107.689 3.79481 138.652 3.79412C152.091 4.30434 169.127 4.66285 183.278 4.96063L183.278 4.96063C188.981 5.08064 194.215 5.19079 198.556 5.29702C215.007 5.69962 223.823 6.04818 235.3 6.66821C235.764 6.69331 236.189 6.918 236.503 7.27988C238.33 9.37908 240.242 11.6903 241.993 13.9833C243.888 16.4662 245.481 18.7833 246.564 20.6973C247.03 21.5218 247.331 22.1509 247.517 22.5941C247.252 23.2817 246.831 24.2145 246.238 25.3676C244.987 27.8032 243.211 30.7599 241.254 33.667C240.656 34.5563 240.049 35.4285 239.444 36.2679C239.138 36.6929 238.696 36.961 238.182 36.9876C199.036 39.009 141.901 39.2059 134.771 39.2059C129.692 39.2059 102.87 38.9114 75.6157 38.3253C61.991 38.0323 48.2722 37.6667 37.1183 37.2291C25.8786 36.7883 17.4495 36.2799 14.2528 35.7303C9.99105 34.9975 7.39377 32.5119 5.8053 29.6376C4.15559 26.6526 3.5 23.0583 3.5 20.1837C3.5 16.7853 4.65566 14.3829 6.89395 12.4651C9.28938 10.4126 12.8889 8.98658 17.4266 8.14136C21.2623 7.42691 35.9816 6.33265 57.7133 5.42107ZM256.579 17.2754C255.996 15.7172 255.243 14.2493 254.531 12.9912C253.588 11.3247 252.464 9.59341 251.256 7.87508C251.92 7.91919 252.539 7.96405 253.08 8.00981C253.082 8.01159 253.084 8.0137 253.087 8.01618C253.09 8.01888 253.093 8.02201 253.096 8.02563C253.647 8.61316 254.207 9.19737 254.764 9.77769C256.358 11.4389 257.921 13.0683 259.133 14.6527C260.834 16.8767 261.608 18.208 262.679 20.2132C263.12 21.039 263.423 21.8603 263.611 22.5336C263.749 23.0285 263.797 23.343 263.814 23.4619C263.797 23.5489 263.756 23.7367 263.659 24.0398C263.481 24.5939 263.165 25.3749 262.647 26.3846C261.646 28.3397 260.168 30.6211 258.405 32.9897C257.84 33.7485 257.257 34.5007 256.666 35.2379C256.377 35.5986 255.984 35.8197 255.554 35.8459C254.66 35.9004 253.645 35.9537 252.594 36.0063C253.278 34.8259 253.915 33.6665 254.486 32.5556C255.27 31.0295 255.988 29.4809 256.53 28.0255C256.989 26.7928 257.651 24.791 257.651 22.6458C257.651 20.6625 257.151 18.8053 256.579 17.2754ZM260.589 35.5907C262.421 33.1294 264.03 30.6638 265.165 28.4477C266.348 26.1387 266.823 24.4689 266.823 23.4872C266.823 22.5503 266.356 20.3184 265.165 18.0893C264.023 15.9507 263.141 14.4357 261.289 12.0147C259.948 10.262 258.188 8.42784 256.559 6.72967C256.029 6.17829 255.514 5.64125 255.031 5.12599C254.546 4.60767 253.949 4.28113 253.315 4.22712C251.955 4.11122 250.102 4.00111 248.308 3.89631L248.21 3.89058L247.987 3.87759L247.496 3.84894C247.17 3.82989 246.85 3.81102 246.537 3.79232C245.607 3.73672 245.102 5.19319 245.758 6.02919C245.98 6.3135 246.202 6.59837 246.421 6.88346C246.524 7.01671 246.626 7.15002 246.728 7.28333C246.792 7.36671 246.855 7.45016 246.918 7.53368L246.982 7.61697C248.922 10.1783 250.733 12.7973 252.091 15.1989C253.414 17.5368 254.651 20.2416 254.651 22.6458C254.651 23.901 254.245 25.2571 253.816 26.4093C253.353 27.6525 252.713 29.0427 251.97 30.488C251.051 32.2764 249.936 34.2246 248.717 36.198L248.698 36.2293C248.595 36.3947 248.492 36.5602 248.389 36.7259C248.149 37.1086 247.906 37.4917 247.66 37.8744C247.105 38.7372 247.617 40.0523 248.495 40.0067C248.624 40 248.754 39.9933 248.886 39.9866C249.144 39.9734 249.407 39.9602 249.675 39.947L250.175 39.9223L250.21 39.9205L250.999 39.8819L251 39.8819C252.638 39.8018 254.318 39.7198 255.698 39.6356C256.854 39.5652 257.949 38.9666 258.773 37.9392C259.388 37.1716 259.997 36.3859 260.589 35.5907ZM270.889 17.7727C270.371 16.3036 269.701 14.9196 269.068 13.7334C268.229 12.1621 267.229 10.5298 266.155 8.90969C266.745 8.95128 267.296 8.99358 267.777 9.03671C267.781 9.04021 267.786 9.04507 267.791 9.05163C268.281 9.60508 268.779 10.1554 269.273 10.7021L269.275 10.7036C270.692 12.2698 272.082 13.806 273.16 15.2999C274.673 17.3968 275.362 18.6521 276.314 20.5426C276.707 21.3212 276.976 22.0956 277.143 22.7304C277.266 23.197 277.309 23.4935 277.324 23.6056C277.309 23.6876 277.272 23.8647 277.186 24.1505C277.027 24.6729 276.746 25.4093 276.286 26.3613C275.395 28.2046 274.081 30.3556 272.513 32.5889C272.01 33.3043 271.492 34.0135 270.966 34.7085C270.709 35.0486 270.36 35.2571 269.977 35.2818C269.182 35.3332 268.279 35.3835 267.345 35.4331C267.953 34.3201 268.519 33.227 269.027 32.1796C269.724 30.7407 270.364 29.2806 270.845 27.9084C271.254 26.7461 271.842 24.8588 271.842 22.8362C271.842 20.9663 271.398 19.2152 270.889 17.7727ZM274.455 35.0412C276.085 32.7206 277.516 30.3959 278.525 28.3065C279.577 26.1295 280 24.5551 280 23.6294C280 22.7461 279.584 20.6418 278.525 18.5401C277.509 16.5238 276.725 15.0953 275.078 12.8127C273.886 11.1602 272.32 9.43085 270.871 7.82974C270.4 7.30988 269.942 6.80353 269.512 6.31772C269.08 5.82903 268.55 5.52115 267.986 5.47022C266.776 5.36095 265.128 5.25713 263.532 5.15833L263.445 5.15293L263.247 5.14067L262.81 5.11366C262.521 5.0957 262.235 5.07791 261.957 5.06028C261.13 5.00785 260.681 6.38108 261.264 7.1693C261.462 7.43736 261.659 7.70595 261.855 7.97474C261.901 8.03932 261.948 8.10391 261.995 8.1685C262.039 8.22958 262.083 8.29067 262.127 8.35176C262.184 8.43037 262.24 8.50905 262.297 8.5878L262.353 8.66633C264.078 11.0813 265.689 13.5505 266.898 15.8149C268.074 18.0192 269.174 20.5694 269.174 22.8362C269.174 24.0196 268.813 25.2982 268.431 26.3846C268.02 27.5567 267.45 28.8675 266.79 30.2301C265.972 31.9163 264.981 33.7532 263.896 35.6138L263.879 35.6433C263.788 35.7992 263.697 35.9553 263.604 36.1115C263.391 36.4723 263.175 36.8336 262.956 37.1944C262.463 38.0078 262.918 39.2478 263.699 39.2048C264.038 39.1861 264.389 39.1674 264.748 39.1485L265.193 39.1252L265.224 39.1236L265.926 39.0871L265.927 39.0871C267.384 39.0116 268.878 38.9343 270.106 38.8549C271.133 38.7885 272.107 38.2242 272.84 37.2554C273.387 36.5318 273.929 35.791 274.455 35.0412Z"
          fill={color}
        />
      </svg>
      {/* <svg
        width="283"
        height="34"
        viewBox="0 0 283 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M248.979 17.4325C249.071 17.6258 249.125 17.7628 249.156 17.8502C249.109 17.9813 249.034 18.1644 248.922 18.4037C248.622 19.0395 248.147 19.8744 247.496 20.8756C246.2 22.8692 244.383 25.2593 242.397 27.5927C241.787 28.3084 241.169 29.0107 240.553 29.6873C239.966 30.3305 239.143 30.708 238.243 30.7448C199.063 32.3445 141.901 32.5 134.771 32.5C129.68 32.5 102.847 32.267 75.5902 31.8035C61.9627 31.5718 48.2359 31.2825 37.0718 30.9363C25.8648 30.5887 17.3433 30.1858 14.0507 29.7382C9.36789 29.1015 6.40067 26.9045 4.57585 24.2937C2.7204 21.6391 2 18.4834 2 15.9592C2 12.7075 3.4612 10.3699 6.05261 8.61427C8.72261 6.80539 12.5836 5.63446 17.208 4.95337C21.1474 4.37317 35.9666 3.50688 57.6636 2.78726C79.3047 2.06948 107.685 1.50028 138.675 1.5C152.106 1.90347 169.135 2.18681 183.29 2.42233C188.997 2.51729 194.236 2.60447 198.585 2.68862C215.045 3.00714 223.873 3.28305 235.364 3.7739C236.169 3.80831 236.93 4.1173 237.512 4.64613C239.357 6.32251 241.294 8.17302 243.072 10.0148C244.99 12.0022 246.64 13.894 247.783 15.4925C248.392 16.3436 248.765 16.9866 248.979 17.4325ZM249.212 17.6683C249.213 17.6676 249.213 17.6672 249.213 17.6674L249.212 17.6683ZM275.31 9.5422L275.31 9.54271L275.396 9.63901C277.107 11.5712 278.558 13.4403 279.56 15.084C280.557 16.7192 280.861 17.7344 280.898 18.1955C280.895 18.2073 280.892 18.221 280.887 18.2366C280.849 18.3778 280.775 18.5991 280.646 18.9085C280.386 19.5307 279.975 20.3389 279.413 21.3007C278.319 23.1752 276.788 25.4031 275.097 27.5818C275.057 27.5977 275.004 27.6166 274.938 27.6369C274.826 27.6714 274.703 27.7013 274.588 27.7242C274.47 27.7477 274.384 27.7591 274.345 27.7625C271.37 28.0275 269.422 28.2796 267.61 28.5142C267.5 28.5284 267.392 28.5425 267.283 28.5565C268.051 27.5912 268.761 26.6192 269.383 25.6598C270.72 23.5961 272 21.0639 272 18.5712C272 16.0511 270.674 13.5502 269.319 11.5445C268.065 9.68909 266.83 8.38143 265.283 6.78506C266.287 6.97138 267.289 7.16458 268.348 7.36897C269.73 7.63549 271.21 7.92103 272.923 8.23518C273.867 8.40811 274.708 8.86537 275.31 9.5422ZM249.467 30.093C250.875 28.3211 252.172 26.5486 253.228 24.9242C253.991 23.7495 254.671 22.5876 255.173 21.5207C255.617 20.5779 256.151 19.2503 256.151 17.906C256.151 16.6467 255.746 15.4074 255.223 14.3009C254.694 13.1832 253.998 12.1044 253.311 11.1449C251.833 9.07839 249.866 6.85009 247.807 4.71715C247.754 4.66207 247.701 4.607 247.647 4.55194C247.741 4.55625 247.834 4.56057 247.928 4.5649C249.819 4.65211 251.79 4.74305 253.214 4.83898C253.503 4.85845 253.802 4.97812 254.064 5.19947C254.58 5.63474 255.117 6.07784 255.66 6.5254C257.274 7.85497 258.935 9.22382 260.211 10.5429C261.987 12.3793 262.815 13.5046 263.922 15.1428C264.44 15.91 264.799 16.6756 265.026 17.3188C265.263 17.9928 265.323 18.4386 265.323 18.5712C265.323 18.8865 265.062 19.8932 263.906 21.6779C262.838 23.327 261.295 25.2037 259.497 27.1132C258.918 27.7275 258.323 28.3356 257.719 28.9304C257.163 29.4793 256.419 29.8033 255.626 29.8415C254.252 29.9078 252.586 29.9721 250.953 30.0352C250.452 30.0546 249.953 30.0738 249.467 30.093Z"
          stroke={color}
          strokeWidth="3"
        />
      </svg> */}
    </div>
  );
};

type SkipAheadProps = { mount?: any; scroll: any; applySkipAhead: any };

const SkipAhead: React.FC<SkipAheadProps> = ({
  mount,
  scroll,
  applySkipAhead,
  ...props
}) => {
  const { id } = mount;
  const config = a2o(id || "TOundefined");
  const { from, to } = config;
  const target = document.getElementById(to);

  function getQuestionKey(shortId: string) {
    switch (shortId) {
      case "renewables":
        return "SUBQ1-renewables-zero-carbon";
      case "agriculture":
        return "SUBQ2-livestock-emissions";
      case "transport":
        return "SUBQ3-transportation-off-fossil";
      case "industry":
        return "SUBQ4-industry-emissions";
    }

    return null;
  }

  function getColour(shortId: string) {
    switch (shortId) {
      case "renewables":
        return "#a3297c";
      case "agriculture":
        return "#f95a18";
      case "transport":
        return "#007cbf";
      case "industry":
        return "#007b52";
    }

    return undefined;
  }

  return (
    <div className={styles.root}>
      <div className={styles.backgroundContainer}>
        <button
          className={styles.button}
          onClick={() => {
            scroll.animateScroll(target);
            applySkipAhead(getQuestionKey(from));
          }}
          style={{
            color: getColour(from)
          }}
        >
          {"Skip ahead"}
        </button>
        <div className={styles.organicBackground}>
          <BackgroundShape color={getColour(from)} />
        </div>
      </div>
    </div>
  );
};

export default SkipAhead;
