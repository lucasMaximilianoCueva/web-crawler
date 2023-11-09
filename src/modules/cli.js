const yargs = require("yargs");

class CommandLineInterface {
  constructor() {
    this.commandLineArguments = yargs
      .option("url", {
        describe: "Initial URL to start crawling from",
        demandOption: true,
        type: "string",
      })
      .option("maxDepth", {
        describe: "Maximum distance from the initial website",
        demandOption: true,
        type: "number",
      })
      .option("databaseFile", {
        describe: "Database file to save results",
        demandOption: true,
        type: "string",
      }).argv;
  }

  getArguments() {
    return this.commandLineArguments;
  }
}

module.exports = CommandLineInterface;
