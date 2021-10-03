type MemoedResponse = { linkHeader: string; json: any };

export const request = async (requestUrl: string): Promise<MemoedResponse> => {
  if (!localStorage.getItem(requestUrl)) {
    const response = await fetch(requestUrl);
    localStorage.setItem(
      requestUrl,
      JSON.stringify({
        linkHeader: response.headers.get("link"),
        json: await response.json(),
      })
    );
  }

  return JSON.parse(localStorage.getItem(requestUrl));
};
