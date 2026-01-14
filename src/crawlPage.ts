import normalizeURL, { getHTML } from "./crawl";
import { getURLsFromHTML } from "./extractHtml";
import pLimit from "p-limit";

export class ConcurrentCrawler {
	public constructor(baseURL: string) {}
}

export async function crawlPage(
	baseURL: string,
	currentURL: string,
	pages: Record<string, number> = {}
) {
	console.log("crawling:", currentURL);
	const baseDomain = new URL(baseURL).hostname;
	const currentDomain = new URL(currentURL).hostname;

	if (baseDomain !== currentDomain) {
		return pages;
	}

	const normalizedCurrent = normalizeURL(currentURL);

	if (pages[normalizedCurrent]) {
		pages[normalizedCurrent]++;
		return pages;
	}

	// First visit
	pages[normalizedCurrent] = 1;

	// Get HTML
	const pageHTML = await getHTML(currentURL);
	if (!pageHTML) {
		console.log("failed to get htlml for: ", currentURL);
		return pages;
	}

	const urls = getURLsFromHTML(pageHTML, baseURL);
	for (const url of urls) {
		pages = await crawlPage(baseURL, url, pages);
	}
	return pages;
}
