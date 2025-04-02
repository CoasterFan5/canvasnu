import parse from "parse-link-header";
import { type ZodTypeAny } from "zod";

/* Pass in a url, accesstoken, and zod shcema to get all pages of data
Zod schema represents response from a single page
Array represents each page
*/
export async function getDataFromUrl<Z extends ZodTypeAny>(
  url: string,
  accessToken: string,
  zodObject: Z,
): Promise<Z["_output"][]> {
  console.warn(`Pre Fetch: ${url}`);

  const req = await fetch(url, {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
  });
  const linkParsed = parse(req.headers.get("link"));
  if (!linkParsed?.next?.url) {
    const parsed = zodObject.safeParse(await req.json());
    if (parsed.data) {
      return [parsed.data];
    } else {
      console.warn(JSON.stringify(parsed.error));
    }
    return [];
  } else {
    const childPromise = getDataFromUrl(
      linkParsed.next.url,
      accessToken,
      zodObject,
    );
    const parsed = zodObject.safeParse(await req.json());
    const child = await childPromise;
    if (!parsed.data || child == undefined) {
      return [];
    }
    return [...[parsed], ...child];
  }
}

/**
 * Take a url, accessToken, and object
 * @param url - The url of the route
 * @param accessToken - The Canvas LMS access token
 * @param zodObject - Any zod type, should be what a single pge will have on it
 * @returns The result of the zod object parse, or undefined if something went wrong.
 */
export async function getPaginatedDataFromUrl<Z extends ZodTypeAny>(
  url: URL,
  accessToken: string,
  zodObject: Z,
): Promise<Z["_output"]> {
  return (await getDataFromUrl(url.toString(), accessToken, zodObject))?.flat(
    1,
  );
}
