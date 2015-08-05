var mongoose = require('./connection');

var Player = mongoose.model('Player', {
  url: String,
  image: String,
  number: Number,
  position: String,
  name: String,
  team: String,
  age: String,
  height: String,
  weight: String,
  birthCountry: String,
  sport: String,
  league: String
});

module.exports = Player;
