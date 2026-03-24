const json = require("./data/nfcwall.json");
const fs = require("fs");

// Given raw JSON dump of a wall, extract data representing posts per day.
function extractData(json) {
  const obj = {};
  const out = [];

  json.forEach((post) => {
    if (!post.poster) return;
    const msTimestamp = new Date(post.created).getTime();

    out.push(msTimestamp)
  });



  // Object.entries(obj).forEach((entry) => {
  //   const [msTimestamp, numPosts] = entry;
  //   out.push([msTimestamp, numPosts]);
  // });

  return out;
}

function writeOut(data) {
  fs.writeFile("./rawTimestampsFiltered.json", JSON.stringify(data, null, 2), 'utf8', (err) => {
    if (err) throw err;
    console.log("Data written to rawTimestampsFiltered.json");
  });
}

const data = extractData(json);
writeOut(data);
