// crawler.js
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const unfluff = require("unfluff");

class Crawler {
  constructor(dbFilePath, cli_url) {
    this.dbFilePath = dbFilePath;
    this.cli_url = cli_url
  }

  async crawl(url, maxdist, currentDist, visitedUrls) {
    try {
      if (currentDist > maxdist || visitedUrls.has(url)) {
        return;
      }

      visitedUrls.add(url);

      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${url}. Status code: ${response.status}`);
      }

      const html = response.data || '';
      const data = unfluff(html);

      const $ = cheerio.load(html);
      const h1 = $("h1").text();

      const result = {
        title: data.title,
        h1: h1,
        url: url,
      };

      fs.appendFileSync(this.dbFilePath, JSON.stringify(result) + "\n");

      console.log(`Title: ${data.title} \nH1: ${h1}  \nURL: ${url}`);

      const promises = [];

      $("a").each((index, element) => {
        const link = $(element).attr("href");
        if (link && (link.startsWith("http") || link.startsWith("/"))) {
          const absoluteLink = link.startsWith("/") ? new URL(link, url).href : link;
          if (absoluteLink.includes(this.cli_url) && !visitedUrls.has(absoluteLink)) {
            promises.push(
              this.crawl(absoluteLink, maxdist, currentDist + 1, visitedUrls)
            );
          }
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(`Error crawling '${url}': ${error.message}`);
    }
  }
}

module.exports = Crawler;
