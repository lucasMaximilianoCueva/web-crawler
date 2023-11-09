// index.js
const Crawler = require("./src/modules/crawler");
const CLI = require("./src/modules/cli");

console.log("Starting Crawler..");

const cli = new CLI();
const crawler = new Crawler(`src/database/${cli.getArguments().db}`);

const visitedUrls = new Set();
crawler.crawl(cli.getArguments().url, cli.getArguments().maxdist, 0, visitedUrls);
