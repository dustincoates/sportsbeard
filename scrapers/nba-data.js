var http = require('http');
var fs   = require('fs');
var url  = 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&LeagueID=00&Season=2015-16';

function rearrangeName(name){
  var split = name.split(', ');
  return split[1] + ' ' + split[0];
}

function assembleUrl(playerCode){
  return 'http://www.nba.com/playerfile/' + playerCode + '/';
}

function gatherPlayers(data, callback){
  var players = JSON.parse(data).resultSets[0].rowSet;

  var parsed = players.map(function(player){
    return {
      name: rearrangeName(player[1]),
      url: assembleUrl(player[5]),
      team: player[8]
    };
  });

  callback(JSON.stringify(parsed));
}

http.get(url, function(response){
  var data = '';

  response.on('data', function(body){
    data += body;
  });

  response.on('end', function(){
    gatherPlayers(data, function(parsedData){
      fs.writeFile('data/nba.json', parsedData, function(err){
        if(err){
          return console.log(err);
        }

        console.log('Successfully gathered NBA player URLs.');
      });
    });
  });
});
