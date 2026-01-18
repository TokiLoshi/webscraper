import { JSDOM } from "jsdom";

export function getH1FromHTML(html: string) {
	const htmlBody = new JSDOM(html);
	const titles = htmlBody.window.document.querySelector("h1");
	return titles?.textContent ?? "";
}

export function getFirstParagraphFromHTML(html: string) {
	const htmlBody = new JSDOM(html);
	const paragraphs = htmlBody.window.document.querySelectorAll("p");
	if (paragraphs.length === 0) return "";
	return paragraphs[0].textContent;
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
	const htmlBody = new JSDOM(html);
	const links = htmlBody.window.document.querySelectorAll("a");
	const allLinks = Array.from(links)
		.map((link) => {
			const href = link.getAttribute("href");
			if (!href) return "";
			const fullURL = new URL(href, baseURL).href;
			if (!href.endsWith("/") && fullURL.endsWith("/")) {
				return fullURL.slice(0, -1);
			}
			return fullURL;
		})
		.filter((href): href is string => href !== null);
	return allLinks;
}

export function getImagesFromHTML(html: string, baseURL: string): string[] {
	const htmlBody = new JSDOM(html);
	const images = htmlBody.window.document.querySelectorAll("img");
	const allImages = Array.from(images)
		.map((image) => {
			const src = image.getAttribute("src");
			if (!src) return "";
			const fullURL = new URL(src, baseURL).href;
			return fullURL;
		})
		.filter((src): src is string => src !== null);
	return allImages;
}

export type ExtractedPageData = {
	url: string;
	h1: string;
	first_paragraph: string;
	outgoing_links: string[];
	image_urls: string[];
};

export function extractPageData(
	html: string,
	pageURL: string,
): ExtractedPageData {
	return {
		url: pageURL,
		h1: getH1FromHTML(html),
		first_paragraph: getFirstParagraphFromHTML(html),
		outgoing_links: getURLsFromHTML(html, pageURL),
		image_urls: getImagesFromHTML(html, pageURL),
	};
}
