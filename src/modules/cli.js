// cli.js
const yargs = require("yargs");

class CLI {
  constructor() {
    this.argv = yargs
      .option("url", {
        describe: "Initial URL to start crawling from",
        demandOption: true,
        type: "string",
      })
      .option("maxdist", {
        describe: "Maximum distance from the initial website",
        demandOption: true,
        type: "number",
      })
      .option("db", {
        describe: "Database file to save results",
        demandOption: true,
        type: "string",
      }).argv;
  }

  getArguments() {
    return this.argv;
  }
}

module.exports = CLI;
