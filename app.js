require("dotenv").config();
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (request, response) => {
  const apiKey = process.env.GOOGLEAPIKEY;
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.city}&key=${apiKey}`)
    .then(res => res.json()) // pesquisar depois por que precisa desse primeiro "then"
    .then((locationResponse) => {
      if (locationResponse.status === 'ZERO_RESULTS') {
        response.status(404).json({ error: 'City not found' })
      } else {
        const {
          lat,
          lng
        } = locationResponse.results[0].geometry.location;
        response.json({ latitude: lat, longitude: lng });
      }
    })
    .catch(function (error) {
      console.log({ error });
      response.status(500).json({ error });
    });
});
