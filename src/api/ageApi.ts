import { request } from "./requestMemo";

export const estimateAgeFromName = (name: string): Promise<string> => {
  const firstName = name.split(" ")[0];
  if (firstName.length === 0) {
    return Promise.resolve("");
  }
  const requestUrl = `https://api.agify.io/?name=${firstName}`;
  return request(requestUrl).then(({ json }) => json.age?.toString() || "");
};
