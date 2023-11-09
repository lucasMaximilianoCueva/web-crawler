# Web Crawler Project

This project is a simple web crawler implemented in Node.js. It allows you to crawl a website up to a specified maximum distance from the initial URL, extracting information such as titles and headings from the pages and storing the results in a JSON file.

## Getting Started

These instructions will help you set up and run the web crawler on your local machine.

### Prerequisites

- Node.js installed on your machine.

### Installing

1. Clone the repository to your local machine:

   ```bash
   git clone <repository-url>
2. Install dependencies:

   ```bash
   npm install
### Usage
1. Run the web crawler using the following command:

   ```bash
   node index.js --url <initial-url> --maxDepth <maximum-distance> --databaseFile <database-file-path>
2. Replace "initial-url", "maximum-distance", and "database-file-path" with your desired values.

   Example:

   ```bash
   node index.js --url https://foodsubs.com/ --maxDepth 5 --databaseFile results.json
The crawler will start and print information about each page crawled to the console. The results will also be saved in the specified JSON file.
### Modules
1. crawler.js

    This module contains the Crawler class, responsible for crawling web pages and extracting relevant information.
2. cli.js

    This module contains the CLI class, responsible for handling command-line arguments.
3. index.js

    The main entry point of the application, where instances of Crawler and CLI are created and used.