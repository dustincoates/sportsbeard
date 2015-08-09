var fs = require('fs'),
    path = require('path'),
    Player = require('../models/player');

function insertPlayers(players, i, length){
  var upperBound = i + 1000,
      slice = players.slice(i, upperBound);

  Player.collection.insert(slice, function(err){
    if(err){
      console.log(err);
    } else {
      if(upperBound > length){
        console.log("Players from " + i + " to " + length + " have been created for MLB.");
        process.exit();
      } else {
        console.log("Players from " + i + " to " + upperBound + " have been created for MLB.");
        insertPlayers(players, upperBound, length);
      }
    }
  });

}

fs.readFile(path.join(__dirname, '../data/mlb.json'), function(err, data){
  if(err){
    console.log(err);
  } else {
    var players = JSON.parse(data),
        i = 0,
        length = players.length;

    insertPlayers(players, i, length);
  }
});
