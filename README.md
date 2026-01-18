# Web Scraper

A concurrent web crawler built with Typescript and node.js to exctract page data and generate CSV reports.

## Features

- Concurrent page crawling with configurable concurrency limits
- Extracts h1 titles, first paragraphs, outgoing links, images
- Exports data to csv format
- Respects same domain restirctions

## Dependencies

1. Node (this version uses v.22.15.0)
2. jsdom
3. p-limit

## Installation:

1. Clone the repository `git clone https://github.com/TokiLoshi/webscraper.git`
2. Enter the directory `cd <folder_name>`
3. Install the dependencies using ``npm install`

## Usage

Run the webscraper from your command line with the baseURL (required starting URL to crawl), your choice for max concurrency (default is set to 5) and the max number of pages you would like (default is set to 100).

Example usage: `npm run start "https://blog.boot.dev/" 3 25`

The project has gitignored the report.csv so yours will be generated from scratch.
