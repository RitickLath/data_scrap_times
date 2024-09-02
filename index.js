const https = require("https");
const http = require("http");

const url = "https://time.com";

// Function to fetch HTML data
function fetchStories(callback) {
  https
    .get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      // all data received
      response.on("end", () => {
        const regex =
          /<a href="(.*?)">\s*<h3 class="latest-stories__item-headline">(.*?)<\/h3>\s*<\/a>/g;

        let match;
        const stories = [];

        while ((match = regex.exec(data)) !== null) {
          const story = {
            link: "https://time.com" + match[1],
            title: match[2].trim(),
          };
          stories.push(story);
        }

        callback(stories);
      });
    })
    .on("error", (err) => {
      console.error("oops, error occured:", err.message);
    });
}

// server for api endpoint
const server = http.createServer((req, res) => {
  if (req.url === "/getTimeStories" && req.method === "GET") {
    fetchStories((stories) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(stories));
    });
  } else {
    res.end("404 Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
