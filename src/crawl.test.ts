// take a single url string and return normalized version as string
import { expect, test } from "vitest";
import normalizeURL from "./crawl";

test("normalize URL protocol", () => {
	const input = "https://blog.boot.dev/path";
	const actual = normalizeURL(input);
	const expected = "blog.boot.dev/path";
	expect(actual).toEqual(expected);
});

test("normalize URL slash", () => {
	const input = "https://blog.boot.dev/path/";
	const actual = normalizeURL(input);
	const expected = "blog.boot.dev/path";
	expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
	const input = "https://BLOG.boot.dev/path";
	const actual = normalizeURL(input);
	const expected = "blog.boot.dev/path";
	expect(actual).toEqual(expected);
});

test("normalizedURL http", () => {
	const input = "http://BLOG.boot.dev/path";
	const actual = normalizeURL(input);
	const expected = "blog.boot.dev/path";
	expect(actual).toEqual(expected);
});
