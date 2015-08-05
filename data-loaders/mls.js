var fs = require('fs'),
    path = require('path'),
    Player = require('../models/player');

fs.readFile(path.join(__dirname, '../data/mls.json'), function(err, data){
  if(err){
    console.log(err);
  } else {
    var players = JSON.parse(data);

    Player.collection.insert(players, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("Players have been created for MLS.");
      }

      process.exit();
    });
  }
});
