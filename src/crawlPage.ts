import normalizeURL, { getHTML } from "./crawl";
import { getURLsFromHTML } from "./extractHtml";

export async function crawlPage(
	baseURL: string,
	currentURL: string,
	pages: Record<string, number> = {}
) {
	console.log("crawling:", currentURL);
	// Make sure current UL is on the same baseURL
	const baseDomain = new URL(baseURL).hostname;
	const currentDomain = new URL(currentURL).hostname;

	// If current !== baser return pages
	if (baseDomain !== currentDomain) {
		return pages;
	}

	const normalizedCurrent = normalizeURL(currentURL);

	// Get normalized currentURL
	if (pages[normalizedCurrent]) {
		// If pages has entry for normalized currentURL increment pages
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
