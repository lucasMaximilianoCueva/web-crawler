const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const unfluff = require("unfluff");

class Crawler {
  constructor(databaseFilePath, cliUrl) {
    this.databaseFilePath = databaseFilePath;
    this.cliUrl = cliUrl;
  }

  async crawl(url, maxDepth, currentDepth, visitedUrls) {
    try {
      if (currentDepth > maxDepth || visitedUrls.has(url)) {
        return;
      }

      visitedUrls.add(url);

      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${url}. Status code: ${response.status}`);
      }

      const html = response.data || '';
      const parsedData = unfluff(html);

      const $ = cheerio.load(html);
      const h1Content = $("h1").text();

      const result = {
        title: parsedData.title,
        h1: h1Content,
        url: url,
      };

      fs.appendFileSync(this.databaseFilePath, JSON.stringify(result) + "\n");

      console.log(`Title: ${parsedData.title} \nH1: ${h1Content}  \nURL: ${url}`);

      const promises = [];

      $("a").each((index, element) => {
        const link = $(element).attr("href");
        if (link && (link.startsWith("http") || link.startsWith("/"))) {
          const absoluteLink = link.startsWith("/") ? new URL(link, url).href : link;
          if (absoluteLink.includes(this.cliUrl) && !visitedUrls.has(absoluteLink)) {
            promises.push(
              this.crawl(absoluteLink, maxDepth, currentDepth + 1, visitedUrls)
            );
          }
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(`Error requesting '${url}': ${error.message}`);
    }
  }
}

module.exports = Crawler;
