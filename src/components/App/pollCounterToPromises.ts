// CURRENTLY UNUSED (moved to main App)

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

export default {};
