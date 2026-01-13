export default function normalizeURL(url: string) {
	const urlObj = new URL(url);
	let fullPath = `${urlObj.host}${urlObj.pathname}`;
	if (fullPath.slice(-1) === "/") {
		fullPath = fullPath.slice(0, -1);
	}
	return fullPath;
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

		// If http status code is error level 400+ print an error and return
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
		console.log("Data from getHTML ", data);
		return data;
	} catch (error) {
		console.error("Error getting data: ", error);
	}
	// If response content type header is not text/html print error and return
	// else print thml body as a string

	// Use try catch
	// Import getHTML into main and call it with base _url
}
