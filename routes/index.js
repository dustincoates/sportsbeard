var express = require('express');
var router = express.Router();
var Player = require('../models/player');

function findPlayer(callback){
  var player = Player.find({
    facialHairType: {$exists: false},
    image: {$exists: true}
  }, {
    image: 1, _id: 1, league: 1
  }).limit(1).lean().exec(callback);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  findPlayer(function(err, players){
    if(err){
      throw new Error(err);
    }

    var player = players[0];

    return res.render('index', {
      title: 'SportsBeard',
      _id: player._id,
      image: player.image,
      league: player.league.toLowerCase()
    });
  })
});

router.get('/players', function(req, res, next){
  findPlayer(function(err, players){
    if(err){
      throw new Error(err);
    }

    return res.json(players[0]);
  })
});

router.post

module.exports = router;
