export default () => {
  return ks
    .animate(
      "#RedStringJank",
      [
        {
          p: "opacity",
          t: [3000, 3500, 4000],
          v: [0, 1, 0],
          e: [[3, 1], [3, 1], [0]]
        }
      ],
      "#RedString1",
      [
        {
          p: "opacity",
          t: [3000, 3500, 4000],
          v: [1, 0, 1],
          e: [[3, 1], [3, 1], [0]]
        },
        {
          p: "strokeDashoffset",
          t: [0, 3000, 4000, 7000],
          v: [4000, -1320, -1320, 4000],
          e: [[1, 0.2, 0.6, 0.4, 1], [0], [1, 0.4, 0.1, 0.6, 0.9], [0]]
        }
      ],
      { autoremove: false, markers: { 1: 0, "1a": 3000, 2: 4000 } }
    )
    .range(0, 7000);
};
