import { getHTML } from "./crawl";
import crawlPage from "./crawl";

function main() {
	console.log("Hello, World! Let's crawl some websites.");
	const testURL = "https://wagslane.dev";
	console.log("Base URL: ", testURL);
	const args = process.argv.slice(2);
	console.log("Args in main: ", args);
	if (args.length < 1) {
		console.error("Args must be a length of 1, not enough args");
		process.exit(1);
	} else if (args.length > 1) {
		console.error("Args must have a length of 1, too many args");
		process.exit(1);
	}

	if (args.length === 1) {
		const baseURL = args[0];
		console.log("starting to crawl: ", baseURL);
		getHTML(baseURL);
		crawlPage(baseURL);
	}
}

main();
