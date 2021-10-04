import useSWR from "swr";

const fetcher = async id => {
  const result = await fetch("https://data-bridge.vercel.app/climate-tangle");
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
      dynamicTextLookup[name] = text;
    }
  }

  return {
    dynamicText: dynamicTextLookup,
    dynamicTextLoading: !error && !data,
    dynamicTextError: error
  };
}
