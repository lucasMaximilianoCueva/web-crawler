const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const unfluff = require("unfluff");
const yargs = require("yargs");

// Configurar yargs para manejar los argumentos de la línea de comandos
const argv = yargs
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

// Función principal de crawling
async function crawl(url, maxdist, currentDist, visitedUrls) {
  try {
    if (currentDist > maxdist || visitedUrls.has(url)) {
      return;
    }

    visitedUrls.add(url);

    // Obtener el contenido HTML de la página
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch ${url}. Status code: ${response.status}`);
    }

    const html = response.data;

    // Utilizar unfluff para extraer el título, texto y enlaces de la página
    const data = unfluff(html);

    const $ = cheerio.load(html);

    // Obtener el contenido del elemento h1
    const h1 = $("h1").text();

    // Guardar los resultados en el archivo especificado
    const result = {
      title: data.title,
      h1: h1,
      url: url,
    };

    fs.appendFileSync(argv.db, JSON.stringify(result) + "\n");

    console.log(`Title: ${data.title}`);
    console.log(`H1: ${h1}`);
    console.log(`URL: ${url}`);

    // Recorrer los enlaces y seguir crawleando
    const promises = [];

    // Buscar enlaces en la etiqueta 'a' y obtener el atributo 'href'
    $("a").each((index, element) => {
      const link = $(element).attr("href");
      if (link && (link.startsWith("http") || link.startsWith("/"))) {
        // Si el enlace comienza con 'http' o '/', considerarlo válido y agregar a las promesas
        const absoluteLink = link.startsWith("/")
          ? new URL(link, url).href
          : link;

        // Agregar condición para excluir enlaces que no contienen la palabra 'foodsubs'
        if (absoluteLink.includes('foodsubs') && !visitedUrls.has(absoluteLink)) {
          promises.push(
            crawl(absoluteLink, maxdist, currentDist + 1, visitedUrls)
          );
        }
      }
    });

    // Esperar a que todas las promesas de crawling se completen antes de continuar
    await Promise.all(promises);
  } catch (error) {
    console.error(`Error crawling ${url}: ${error.message}`);
  }
}

// Inicializar el conjunto de URLs visitadas
const visitedUrls = new Set();

// Llamar a la función de crawling con los argumentos de la línea de comandos
crawl(argv.url, argv.maxdist, 0, visitedUrls);
