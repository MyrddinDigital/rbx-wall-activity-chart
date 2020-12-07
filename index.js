const json = require('./data/nfcwall.json');
const fs = require('fs');
const https = require('https');

// Given raw JSON dump of a wall, extract data representing posts per day.
function extractData(json) {
  const out = {};

  json.data.forEach(post => {
    getUserAge(post, userAge => {
      // Ignore accounts less than 2 days old at time of posting.
      if (userAge < 2) return;
  
      const date = new Date(post.created);
      const day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    
      if (out[day] >= 0) {
        out[day] = out[day] + 1;
      } else {
        out[day] = 1;
      }
    });
  });

  return out;
}

// Given a post object, get the poster's account age at the time of posting.
function getUserAge(post, cb) {
  if (!post.poster) return 0; // banned users

  https.get(`https://users.roblox.com/v1/users/${post.poster.user.userId}`, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk
    });

    res.on('end', () => {
      const joinDate = new Date(JSON.parse(data).created);
      const postDate = new Date(post.created);

      const diffTime = Math.abs(joinDate - postDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      cb(diffDays);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

// Given a data object of posts per day, write out a CSV file that can be consumed by D3.js
function writeOut(data) {
  var stream = fs.createWriteStream("dist/out.csv", {flags:'a'});
  stream.write(`date,value\n`);
  
  Object.entries(data).forEach(entry => {
    const [date, numPosts] = entry;
    stream.write(`${date},${numPosts}\n`);
  });
  
  stream.end();
}

const data = extractData(json);
writeOut(data);