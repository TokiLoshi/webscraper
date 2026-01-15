import normalizeURL, { getHTML } from "./crawl";
import { getURLsFromHTML } from "./extractHtml";
import pLimit, { LimitFunction } from "p-limit";

export class ConcurrentCrawler {
	private baseURL: string;
	public pages: Record<string, number>;
	private limit: LimitFunction;

	constructor(baseURL: string, maxConcurrency: number) {
		(this.baseURL = baseURL),
			(this.pages = {}),
			(this.limit = pLimit(maxConcurrency));
	}

	public getPage(): Record<string, number> {
		return this.pages;
	}

	private addPageVisit(normalizedURL: string): boolean {
		if (this.pages[normalizedURL]) {
			this.pages[normalizedURL]++;
			return false;
		}
		// return true if first time visiting page
		this.pages[normalizedURL] = 1;

		return true;
	}

	private async getHTML(currentURL: string): Promise<string | null> {
		return await this.limit(async () => {
			try {
				// Set a User-Agent header e.g BootCrawler/1.0
				const response = await fetch(currentURL, {
					headers: {
						"User-Agent": "BootCrawler/1.0",
					},
				});

				// If http status code is error level 400+ print an error and return
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
					return null;
				}

				const contentType = response.headers.get("content-type");
				if (!contentType || !contentType.includes("text/html")) {
					throw new Error(`Expected text/html but got ${contentType}`);
					return null;
				}

				const data = await response.text();
				console.log("Data from getHTML ", data);
				return data;
			} catch (error) {
				console.error("Error getting data: ", error);
				return null;
			}
		});
	}

	private async crawlPage(currentURL: string): Promise<void> {
		const baseDomain = new URL(this.baseURL).hostname;
		const currentDomain = new URL(currentURL).hostname;
		if (baseDomain !== currentDomain) return;

		// call addPageVist method, if it's not a new page return early
		const normalizedCurrentURL = normalizeURL(currentURL);
		const newPage = this.addPageVisit(normalizedCurrentURL);
		if (!newPage) return;

		// get HTML from current URL using new getHTML method
		const pageHTML = await this.getHTML(currentURL);
		if (!pageHTML) return;

		// get all URLS from response body html
		const urls = getURLsFromHTML(pageHTML, this.baseURL);

		const promises = urls.map((url) => this.crawlPage(url));

		await Promise.all(promises);
		// Create array of promises for urls by calling this.crawlPage(nextURL)
		// use Promise.all() to await all concurrent crawl promises
	}
	public async crawl() {
		await this.crawlPage(this.baseURL);
	}
}

export async function crawlSiteAsync(baseURL: string, maxConcurrency: number) {
	const newCrawler = new ConcurrentCrawler(baseURL, maxConcurrency);
	await newCrawler.crawl();
	return newCrawler.pages;
}

// export async function crawlPage(
// 	baseURL: string,
// 	currentURL: string,
// 	pages: Record<string, number> = {}
// ) {
// 	console.log("crawling:", currentURL);
// 	const baseDomain = new URL(baseURL).hostname;
// 	const currentDomain = new URL(currentURL).hostname;

// 	if (baseDomain !== currentDomain) {
// 		return pages;
// 	}

// 	const normalizedCurrent = normalizeURL(currentURL);

// 	if (pages[normalizedCurrent]) {
// 		pages[normalizedCurrent]++;
// 		return pages;
// 	}

// 	// First visit
// 	pages[normalizedCurrent] = 1;

// 	// Get HTML
// 	const pageHTML = await getHTML(currentURL);
// 	if (!pageHTML) {
// 		console.log("failed to get htlml for: ", currentURL);
// 		return pages;
// 	}

// 	const urls = getURLsFromHTML(pageHTML, baseURL);
// 	for (const url of urls) {
// 		pages = await crawlPage(baseURL, url, pages);
// 	}
// 	return pages;
// }
