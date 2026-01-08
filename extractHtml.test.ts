import { expect, test } from "vitest";
import { getH1FromHTML, getFirstParagraphFromHTML } from "./extractHtml";

test("getH1FromHTML basic", () => {
	const inputBody = `<html><body><h1>Test Title</h1></body></html>`;
	const actual = getH1FromHTML(inputBody);
	const expected = "Test Title";
	expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML main priority", () => {
	const inputBody = `
  <html>
  <body>
  <p>Outside paragraph.</p>
  <main>Main paragraph.</main>
  </body>
  </html>
  `;
	const actual = getFirstParagraphFromHTML(inputBody);
	const expected = "Outside paragraph.";
	expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML empty", () => {
	const inputBody = `
  <html>
  <body>
  <main>Main paragraph.</main>
  </body>
  </html>
  `;
	const actual = getFirstParagraphFromHTML(inputBody);
	const expected = "";
	expect(actual).toEqual(expected);
});
