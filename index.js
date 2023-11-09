const WebCrawler = require("./src/modules/crawler");
const CommandLineInterface = require("./src/modules/cli");

console.log("Starting Web Crawler..");

const commandLineInterface = new CommandLineInterface();
const webCrawler = new WebCrawler(`src/database/${commandLineInterface.getArguments().databaseFile}`, commandLineInterface.getArguments().url);

const visitedUrls = new Set();
webCrawler.crawl(commandLineInterface.getArguments().url, commandLineInterface.getArguments().maxDepth, 0, visitedUrls);
