import fetch from "node-fetch";
import { load } from "cheerio";
import express from "express";
import path from "path";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let url;
let contentString;
const errorMessage =
  "Oops! Something went wrong.. Probably you input wrong link, please return and try again";

const app = express();

let port = 3777;
port = process.env.port || port;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

app.use(express.urlencoded()); /// decoding form data into JSON
app.use(express.json()); //  converting form data into object

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "top20words.html"));
});

const showHTML = async (URL) => {
  try {
    const response = await fetch(URL);

    const rawData = await response.text(); //html tags

    const parsedData = load(rawData);

    let $ = load(rawData);

    let contArr = [];

    $("p").each((_, e) => {
      let row = $(e).text().replace(/(\s+)/g, " "); // string
      contArr.push(row);
    });

    let wordsArr = createArrOfSmallWords(contArr);

    contentString = getTopWords(wordsArr, 20);
   
  } catch (err) {
    contentString = errorMessage;  
  }
  return contentString;
};

app.post("/submit", (req, res) => {

  url = req.body.url;
  if (!url) contentString = errorMessage;

  showHTML(url).then(respon => {
    res.send(respon);
  });

});

const garbage = [
  "and",
  "am",
  "abaft",
  "aboard",
  "about",
  "above",
  "absent",
  "across",
  "afore",
  "after",
  "against",
  "along",
  "alongside",
  "also",
  "amid",
  "amidst",
  "among",
  "amongst",
  "an",
  "anenst",
  "apropos",
  "apud",
  "around",
  "are",
  "as",
  "aside",
  "astride",
  "at",
  "athwart",
  "atop",
  "barring",
  "be",
  "before",
  "behind",
  "below",
  "beneath",
  "beside",
  "besides",
  "between",
  "beyond",
  "but",
  "by",
  "circa",
  "can",
  "could",
  "concerning",
  "despite",
  "down",
  "during",
  "except",
  "excluding",
  "failing",
  "following",
  "for",
  "forenenst",
  "from",
  "given",
  "have",
  "has",
  "had","here",
  "in",
  "if",
  "including",
  "inside",
  "is",
  "into",
  "it",
  "its",
  "lest",
  "like",
  "mid",
  "midst",
  "minus",
  "near",
  "not",
  "next",
  "notwithstanding",
  "of",
  "off",
  "on",
  "only",
  "onto",
  "opposite",
  "or",
  "out",
  "outside",
  "over",
  "pace",
  "past",
  "per",
  "plus",
  "qua",
  "regarding",
  "round",
  "sans",
  "since",
  "than",
  "through",
  "throughout",
  "till",
  "times",
  "than",
  "that",
  "to",
  "toward",
  "towards",
  "the",
  "then",
  "therefore",
  "this",
  "these",
  "under",
  "underneath",
  "unlike",
  " ",
  "",
  "until",
  "unto",
  "up",
  "upon",
  "versus",
  "via",
  "vice",
  "was",
  "were",
  "will",
  "which",
  "while",
  "with",
  "within",
  "without",
  "would",
  "worth",
  "his",
  "her",
  "him",
  "theirs","there",
  "they",
  "he",
  "she",
  "you",
  "all",
  "no",
  "one",
  "what",
  "their", 
  "been",  
];

//function for search top words
function getTopWords(words, number) {
  // making object with key = word, value = number of repeating
  let count = {};

  words.forEach((word) => {
    count[word] ? count[word]++ : (count[word] = 1);
  });

  // deleting bad words from the object
  for (let key in count) {
    if (garbage.includes(key) || key.length > 35 || key.length === 1) {
      delete count[`${key}`];
    }
  }

  // sort object by descending
  let sortable = Object.entries(count) //
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  // cut object by 'number' argument
  let sliced = Object.keys(sortable)
    .slice(0, number)
    .reduce((result, key) => {
      result[key] = sortable[key];
      return result;
    }, {});

  //making array with strings like 'word: qty times'
  let topWords = [];

  for (let key in sliced) {
    topWords.push(`${key}: ${sliced[key]} times`);
  }
  // return string with answer
  return `<h2 style = "text-align: center; ">Top-${number} words and how many times they occur on this WEB page:</h2>
<p style = "text-align: center;">${topWords.join(", <br>")}</p>`;
}

function createArrOfSmallWords(arr) {

  let newArr = [];
  arr.forEach((string, index) => {
    let xx = string.split(" ");

    for (let word of xx) {
      newArr.push(word.toLowerCase().replace(/[^\sa-z]/gi, ""));
    }
  });

  return newArr;
  
}
