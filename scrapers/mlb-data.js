var casper   = require('casper').create({
  verbose: true,
  loadImages: false
});
var fs       = require('fs');
var url      = 'http://mlb.mlb.com/mlb/players/?tcid=nav_mlb_players';

// Select #ps_team
// Options #ps_team option[value*="http"]

function getUrlsFromSelect(){
  var options = document.querySelectorAll('#ps_team option[value*="http"]');

  return Array.prototype.map.call(options, function(option){
    return option.value;
  });
}

function getData(){
  var anchors = document.querySelectorAll('td.playerName a');
  var data = [];

  Array.prototype.forEach.call(anchors, function(anchor){
    var href = anchor.getAttribute('href'),
        playerCode = href.match(/player_id=(\d+)/)[1],
        url = 'http://m.mlb.com/player/' + playerCode;
    data.push({
      playerCode: playerCode,
      url: url,
      name: anchor.innerText,
      sport: 'baseball',
      league: 'MLB'
    });
  });

  return data;
}

function fetchPlayerUrls(players, urls, index){
  if(!urls[index]){
    fs.write('data/mlb.json', JSON.stringify(players), 'w');
    return this.echo('Finished fetching player data.');
  }

  this.thenOpen(urls[index], function(){
    var playerData = this.evaluate(getData);
    this.echo('Adding new players: ' + playerData.length);

    players = players.concat(playerData);

    this.echo('Total players added: ' + players.length);

    fetchPlayerUrls.call(this, players, urls, ++index);
  });
}

function fetchTeamUrls(players){
  var teamUrls = this.evaluate(getUrlsFromSelect);
  fetchPlayerUrls.call(this, players, teamUrls, 0);
}

casper.start(url, function(){});

casper.then(function(){
  fetchTeamUrls.call(this, []);
});

casper.run(function(){
  this.exit();
})
