import {
	ExtractedPageData,
	extractPageData,
	getURLsFromHTML,
} from "./extractHtml";
import pLimit from "p-limit";

export default function normalizeURL(url: string) {
	const urlObj = new URL(url);
	let fullPath = `${urlObj.host}${urlObj.pathname}`;
	if (fullPath.slice(-1) === "/") {
		fullPath = fullPath.slice(0, -1);
	}
	return fullPath.toLowerCase();
}

export async function getHTML(url: string) {
	// Use fetch to get the webpage for the url
	try {
		// Set a User-Agent header e.g BootCrawler/1.0
		const response = await fetch(url, {
			headers: {
				"User-Agent": "BootCrawler/1.0",
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
			return;
		}

		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("text/html")) {
			throw new Error(`Expected text/html but got ${contentType}`);
			return;
		}

		const data = await response.text();
		return data;
	} catch (error) {
		console.error("Error getting data: ", error);
	}
}

export class ConcurrentCrawler {
	private baseURL: string;
	private pages: Record<string, number>;
	private pageData: Record<string, ExtractedPageData>;
	private limit: <T>(fn: () => Promise<T>) => Promise<T>;
	private maxPages: number;
	private shouldStop: boolean;
	private allTasks: Set<Promise<void>>;
	private abortController: AbortController;

	constructor(baseURL: string, maxConcurrency: number, maxPages: number) {
		((this.baseURL = baseURL),
			(this.pages = {}),
			(this.pageData = {}),
			(this.limit = pLimit(maxConcurrency)));
		this.maxPages = maxPages;
		this.shouldStop = false;
		this.allTasks = new Set();
		this.abortController = new AbortController();
	}

	private addPageVisit(normalizedURL: string): boolean {
		if (Object.keys(this.pages).length >= this.maxPages) {
			this.shouldStop = true;
			console.log("Reached maximum number of pages to crawl.");
			this.abortController.abort();
			return false;
		}

		if (this.pages[normalizedURL]) {
			this.pages[normalizedURL]++;
			return false;
		}
		// return true if first time visiting page
		this.pages[normalizedURL] = 1;

		return true;
	}

	public getPage(): Record<string, number> {
		return this.pages;
	}

	private async getHTML(currentURL: string): Promise<string> {
		return await this.limit(async () => {
			let res;
			try {
				res = await fetch(currentURL, {
					headers: {
						"User-Agent": "BootCrawler/1.0",
					},
				});
			} catch (error) {
				throw new Error(`Network error: ${(error as Error).message}`);
			}

			if (res.status > 399) {
				throw new Error(`Got Network error: ${res.status} - ${res.statusText}`);
			}

			const contentType = res.headers.get("content-type");
			if (!contentType || !contentType.includes("text/html")) {
				throw new Error(`Got non-HTML response`);
			}
			return res.text();
		});
	}

	private async crawlPage(currentURL: string): Promise<void> {
		if (this.shouldStop) return;

		const baseDomain = new URL(this.baseURL).hostname;
		const currentDomain = new URL(currentURL).hostname;
		if (baseDomain !== currentDomain) return;

		// call addPageVist method, if it's not a new page return early
		const normalizedCurrentURL = normalizeURL(currentURL);

		if (!this.addPageVisit(normalizedCurrentURL)) return;

		let html = "";

		try {
			html = await this.getHTML(currentURL);
		} catch (error) {
			console.log(`${(error as Error).message}`);
			return;
		}

		if (this.shouldStop) return;
		this.pageData[currentURL] = extractPageData(html, currentURL);

		const nextURLs = getURLsFromHTML(html, this.baseURL);

		for (const nextURL of nextURLs) {
			if (this.shouldStop) break;
			const task = this.crawlPage(nextURL).finally(() => {
				this.allTasks.delete(task);
			});
			this.allTasks.add(task);
		}

		await Promise.all(Array.from(this.allTasks));
	}

	public async crawl(): Promise<{
		pages: Record<string, number>;
		pageData: Record<string, ExtractedPageData>;
	}> {
		await this.crawlPage(this.baseURL);
		await Promise.all(Array.from(this.allTasks));

		return {
			pages: this.pages,
			pageData: this.pageData,
		};
	}
}

export async function crawlSiteAsync(
	baseURL: string,
	maxConcurrency: number = 5,
	maxPages: number = 100,
): Promise<{
	pages: Record<string, number>;
	pageData: Record<string, ExtractedPageData>;
}> {
	const newCrawler = new ConcurrentCrawler(baseURL, maxConcurrency, maxPages);
	return await newCrawler.crawl();
}
