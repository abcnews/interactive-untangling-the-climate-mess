const fs = require("fs");
const axios = require("axios");

const fetcher = async () => {
  const result = await axios.get(
    "https://data-bridge.vercel.app/climate-tangle"
  );

  return result;
};

const main = async () => {
  const { data } = await fetcher();

  console.log(data);

  fs.writeFileSync("public/dynamic-text.json", JSON.stringify(data));
};

main();
