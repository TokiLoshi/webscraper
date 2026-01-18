import { getHTML } from "./crawl";
import { crawlSiteAsync } from "./crawlPage";

async function main() {
	console.log("Hello, World! Let's crawl some websites.");

	const args = process.argv.slice(2);
	console.log("Args in main: ", args);

	if (args.length < 1) {
		console.error("Args must be a length of 1, not enough args.");
		console.log("usage: npm run start <URL> <maxConcurrency> <maxPages>");
		process.exit(1);
	} else if (args.length > 3) {
		console.error("Args must have a length of 1, 2 or 3 too many args");
		console.log("usage: npm run start <URL> <maxConcurrency> <maxPages>");
		process.exit(1);
	}

	const baseURL = args[0];
	const maxConcurrency = args[1] ? parseInt(args[1]) : 5;
	const maxPages = args[2] ? parseInt(args[2]) : 100;

	if (
		isNaN(maxConcurrency) ||
		isNaN(maxPages) ||
		maxPages < 1 ||
		maxConcurrency < 1
	) {
		console.error("MaxConcurrency and max pages must be positive numbers");
		process.exit(1);
	}

	console.log("Base URL: ", baseURL);
	console.log("MaxConcurrency: ", maxConcurrency);
	console.log("Max Pages: ", maxPages);

	getHTML(baseURL);

	const pages = await crawlSiteAsync(baseURL, maxConcurrency, maxPages);
	console.log(`Crawl completed! Craweled: ${Object.keys(pages).length}`);
	console.log("Results: ", pages);
}

main();
