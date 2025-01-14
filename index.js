// index.js
// where your node app starts

// init project
var express = require('express');
var moment = require('moment');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/:date?", (req, res) => {
  const dateString = req.params.date;

  // Check if the input is blank
  const isDateParameterEmpty = !dateString;

  // Check if the input is a valid UNIX timestam in seconds or milliseconds
  const isUnixTimestampMs = /^\d{13}?$/.test(dateString);

  // Check if the input is a valid ISO8601 string
  const isIso8601 = !isUnixTimestampMs && !isNaN(Date.parse(dateString));

  if (isUnixTimestampMs) {
    unixTimestampMs = dateString;
    unixTimestampInSec = unixTimestampMs/1000;

    // Create a utc string by first creating a moment object from the unixTimeStamp, switching to UTC, then formatting it.
    utcString = moment.unix(unixTimestampInSec).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
  } else if (isIso8601) {
    date = moment.utc(dateString);
    unixTimestampMs = date.valueOf();
    utcString = date.utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
  } else if (isDateParameterEmpty) {
    unixTimestampMs = moment().utc().valueOf();
    utcString = moment.utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
  } else {
    return res.json({ error: "Invalid Date" });
  }

  const responseString = `{ "unix": ${unixTimestampMs}, "utc": "${utcString}" }`;
  res.setHeader('Content-Type', 'application/json');
  // res.json({ unix: unixTimestampMs, utc: utcString });
  res.send(responseString);
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
