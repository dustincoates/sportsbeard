var mongoose = require('mongoose');

function uri() {
  var environment = process.env.NODE_ENV || "development";
  if (environment === "development") {
    return "mongodb://localhost/sportsBeard";
  } else{
    return process.env.MONGOHQ_URL;
  };
}

var connection = mongoose.connect(uri(), function(err, res) {
  if (err) {
    console.log(err);
  } else{
    console.log("Connected to database");
  };
});

module.exports = connection;
