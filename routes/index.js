var express = require('express');
var router = express.Router();
var Player = require('../models/player');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/players', function(req, res, next){
  var player = Player.find({
    facialHairType: {$exists: false},
    image: {$exists: true}
  }, {
    image: 1, _id: 1
  }).limit(1).lean().exec(function(err, player){
    if(err){
      throw new Error(err);
    }

    return res.json(player[0]);
  });
});

module.exports = router;
