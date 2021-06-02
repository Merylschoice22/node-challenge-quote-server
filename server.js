const { response } = require("express");
// server.js
// This is where your node app starts

//load the 'express' module which makes writing webservers easy
const express = require("express");
const app = express();
const lodash = require("lodash");
const cors = require("cors");

//load the quotes JSON
const quotes = require("./quotes.json");

// Now register handlers for some routes:
//   /                  - Return some helpful welcome info (text)
//   /quotes            - Should return all quotes (json)
//   /quotes/random     - Should return ONE quote (json)

app.use(cors());

app.get("/", function (request, response) {
  response.send("Neill's Quote Server!  Ask me for /quotes/random, or /quotes");
});

//START OF YOUR CODE...
////GET - Read all quotes
app.get("/quotes", (req, res) => {
  res.send(quotes);
  //Testing code//
  // let print = [];
  // quotes.forEach((q) => {
  //   print.push(q.author);
  // });
  // res.send(print);
});

////GET - Read a single quote object (by its position in the array)
//Hard coded example
// app.get("/quotes/5", (req, res) => {
//   res.send(quotes[4]);
// });

app.get("/quotes/:id", (req, res) => {
  const index = parseInt(req.params.id) - 1;
  const quoteObj = quotes[index];
  if (quoteObj) {
    res.send(quoteObj);
  }
  res.status(404).send();
});

////POST - Create a new quotes (add it to the end of the array)

app.post("/quotes", (req, res) => {
  //get the new quote object
  const quoteObj = {
    quote: req.query.quote,
    author: req.query.author,
  };
  //add it to the quotes array
  quotes.push(quoteObj);
  // return the ID for the new quote object
  res.status(201).send({ id: quotes.length });
});

////PUT - Update an existing quote
app.put("/quotes/:id", (req, res) => {
  //get the new quote object
  const quoteObj = {
    quote: req.query.quote,
    author: req.query.author,
  };
  //get the ID of the existing quote object
  const index = parseInt(req.params.id) - 1;
  //replace existing quote object at specified index with new one
  const result = quotes.splice(index, 1, quoteObj);
  console.log("Removed quote: ", result);

  //return new quote object
  res.send(quoteObj);
});

////DELETE - Delete an existing quote from the array

app.delete("/quotes/:id", (req, res) => {
  //get the index of existing quote object
  const index = parseInt(req.params.id) - 1;
  // remove quote object at index from array, replace it with 'undefined' so that we don't shift the index of every other item in the array
  const result = quotes.splice(index, 1, undefined);
  // return status 200 - okay
  res.stats(204).send();
});

app.get("/quotes/random", (req, res) => {
  res.send(lodash.sample(quotes));
  // res.send(pickFromArray(quotes));
});

// app.get("/quotes/search", (req, res) => {
//   const term = req.query.term.toLowerCase();
//   // res.send(quotes[0].quote);
//   let searchQuote = [];
//   quotes.forEach((q) => {
//     if (q.quote.toLowerCase().includes(term)) {
//       searchQuote.push(q);
//     }
//   });

//   res.send(searchQuote);
// });

/** FILTER **/
app.get("/quotes/search", (req, res) => {
  const term = req.query.term.toLowerCase();
  // res.send(quotes[0].quote);
  const filteredQuotes = (quoteArray, term) => {
    const newArray = quoteArray.filter((q) => {
      if (q.quote.toLowerCase().includes(term)) {
        return q.quote;
      }
    });
    return newArray;
  };

  res.send(filteredQuotes(quotes, term));
});

//...END OF YOUR CODE

//You can use this function to pick one element at random from a given array
//example: pickFromArray([1,2,3,4]), or
//example: pickFromArray(myContactsArray)
//
function pickFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//Start our server so that it listens for HTTP requests!
let port = 5000;

app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
