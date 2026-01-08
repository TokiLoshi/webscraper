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
