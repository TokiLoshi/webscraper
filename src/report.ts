import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtractedPageData } from "./extractHtml";

export default function writeCSVReport(
	pageData: Record<string, ExtractedPageData>,
	filename = "report.csv",
): void {
	const filePath = path.resolve(process.cwd(), filename);
	const headers = [
		"page_url",
		"h1",
		"first_paragraph",
		"outgoing_link_urls",
		"image_urls ",
	];
	const rows: string[] = [headers.join(",")];
	for (const page of Object.values(pageData)) {
		const outgoingLinks = page.outgoing_links?.join("; ") ?? "";
		const imageUrls = page.image_urls?.join("; ") ?? "";
		const row = [
			csvEscape(page.url),
			csvEscape(page.h1 ?? ""),
			csvEscape(page.first_paragraph ?? ""),
			csvEscape(outgoingLinks),
			csvEscape(imageUrls),
		].join(",");
		rows.push(row);
	}
	const csvData = rows.join("\n");

	try {
		fs.writeFileSync(filePath, csvData, "utf-8");
		console.log("Report written to: ", filePath);
	} catch (error) {
		console.error(`Error writing file: ${(error as Error).message}`);
		throw error;
	}
	// escape quotes and commas with cv output
	// write the file to disc using fs.writeFileSync
}

function csvEscape(field: string) {
	const str = field ?? "";
	const needsQuoting = /[",\n]/.test(str);
	const escaped = str.replace(/"/g, '""');
	return needsQuoting ? `"${escaped}"` : escaped;
}
