const request = require("request");

module.exports = makeRequest;

function prepareOptionsForRequest(body, api) {
  return {
    url: process.env.link_api + api,
    method: "POST",
    body: body,
    json: true,
    rejectUnauthorized: false,
  };
}

function makeRequest(body, api, res) {
  var options = prepareOptionsForRequest(body, api);

  request(options, function (error, response, body) {
    console.log('usao sam!');
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
}
