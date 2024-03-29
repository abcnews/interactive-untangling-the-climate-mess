import useSWR from "swr";
import { getTier } from "@abcnews/env-utils";

const fetcher = async id => {
  // If article is LIVE on the site then access data directly from FTP.
  // Otherwise get from Vercel <- Airtable
  const result = await fetch(
    getTier() === "preview" ? id : `${__webpack_public_path__}dynamic-text.json`
  );
  const json = await result.json();
  return json;
};

export function useDynamicText(
  identifier: string = "https://data-bridge.vercel.app/climate-tangle"
) {
  const { data, error } = useSWR(identifier, fetcher);

  const dynamicTextLookup = {};

  if (data) {
    for (const record of data) {
      const { fields } = record;
      const { name, text } = fields;

      const isBlank =
        text === "\n" ||
        text === "" ||
        text === " " ||
        text === null ||
        text === undefined;

      dynamicTextLookup[name] = isBlank ? undefined : text;
    }
  }

  return {
    dynamicText: dynamicTextLookup,
    dynamicTextLoading: !error && !data,
    dynamicTextError: error
  };
}
