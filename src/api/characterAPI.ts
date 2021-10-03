import { estimateAgeFromName } from "./ageApi";
import { request } from "./requestMemo";

export type Character = {
  name: string;
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  mother: string;
  spouse: string;
  allegiances: string[];
  books: string[];
  povBooks: string[];
  tvSeries: string[];
  playedBy: string[];
  age: string;
};

type CharacterPage = {
  characters: Character[];
  totalPages: number;
};

const getNameFromUrl = (requestUrl: string): Promise<string> => {
  if (!requestUrl) {
    return Promise.resolve("");
  }

  return request(requestUrl).then(({ json }) => json.name);
};

const getNamesFromUrls = (requestUrls: string[]): Promise<string[]> => {
  if (requestUrls.filter((url) => !!url).length === 0) {
    return Promise.resolve([]);
  }
  return Promise.all(requestUrls.map(getNameFromUrl));
};

const mapJsonToCharacter = async (json: any): Promise<Character> => {
  return {
    name: json.name,
    gender: json.gender,
    culture: json.culture,
    born: json.born,
    died: json.died,
    titles: json.titles,
    aliases: json.aliases,
    father: await getNameFromUrl(json.father),
    mother: await getNameFromUrl(json.mother),
    spouse: await getNameFromUrl(json.spouse),
    allegiances: await getNamesFromUrls(json.allegiances),
    books: await getNamesFromUrls(json.books),
    povBooks: await getNamesFromUrls(json.povBooks),
    tvSeries: json.tvSeries,
    playedBy: json.playedBy,
    age: await estimateAgeFromName(json.name),
  };
};

const mapJsonToCharacters = (json: any): Promise<Character[]> => {
  if (!Array.isArray(json)) {
    throw new Error(`Malformed response: expected array but found: ${json}`);
  }

  return Promise.all(
    json.flatMap((characterJson) => {
      try {
        return mapJsonToCharacter(characterJson);
      } catch (error) {
        console.warn(`Couldn't parse character object: ${characterJson}`);
        return [];
      }
    })
  );
};

/**
 * Parses the total page count from a link header string.
 * @param linkHeader the link header from a fetch response.
 * @returns The total page count integer. In case of any problem returns -1.
 */
const getPageCountFromLink = (linkHeader: string): number => {
  const lastLinkMatches = linkHeader
    .split(",")
    .filter((link) => /rel="last"/.test(link));
  if (lastLinkMatches.length !== 1) {
    return -1;
  }
  const pageNumberMatches = /page=(\d+)/.exec(lastLinkMatches[0]);
  if (pageNumberMatches.length !== 2) {
    return -1;
  }
  const pageNumber = parseInt(pageNumberMatches[1]);
  return Number.isNaN(pageNumber) ? -1 : pageNumber;
};

export const requestCharacterPage = async (
  page = 1,
  filters: Record<string, string> = {}
): Promise<CharacterPage> => {
  const filterQueryParams = Object.entries(filters)
    .filter(([_key, value]) => !!value)
    .map(([key, value]) => `&${key}=${value}`)
    .join("");
  const requestUrl = `https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=10${filterQueryParams}`;

  const { linkHeader, json } = await request(requestUrl);

  return {
    characters: await mapJsonToCharacters(json),
    totalPages: getPageCountFromLink(linkHeader),
  };
};
