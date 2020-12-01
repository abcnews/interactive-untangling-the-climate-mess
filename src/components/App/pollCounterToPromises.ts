import { Client } from "@abcnews/poll-counters-client";

const client = new Client("__example__");

const pollIncrement = (...args) =>
  new Promise((resolve, reject) => {
    client.increment(...args, (err, question) => {
      if (err) return reject(err);
      resolve(question);
    });
  });

const pollGet = (...args) =>
  new Promise((resolve, reject) => {
    client.get(...args, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

// const test = async () => {
//   let result = await pollIncrement({
//     question: "Is this working?",
//     answer: "Yes",
//   });
//   console.log(result);

//   result = await pollGet({ question: QUESTION });
//   console.log(result);
// };

// test();

export default {}