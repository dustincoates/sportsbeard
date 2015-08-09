var fs      = require('fs');
var http    = require('http');
var players = [];
var i       = 0;

function assembleUrl(playerCode){

  return 'http://mlb.mlb.com/mlb/images/players/head_shot/' + playerCode + '.jpg'
}

function fileName(playerCode){
  return playerCode + '.jpg'
}

function filePath(playerCode){
  return 'photos/mlb/' + fileName(playerCode);
}

function savePlayersWithFileNames(players){
  fs.writeFile('data/mlb.json', JSON.stringify(players), function(err){
    if(err){
      return console.log(err);
    }

    return console.log('Finished saving images for MLB.');
  })
}

function getPlayerImage(index, players){
  if(!players[index]){
    return savePlayersWithFileNames(players);
  }

  var playerCode = players[index].playerCode;

  http.get(assembleUrl(playerCode), function(response){
    if(response.statusCode === 404){
      console.log(playerCode + ' not found');
      return getPlayerImage(++index, players);
    }

    var data = '';
    response.setEncoding('binary');

    response.on('data', function(body){
      data += body;
    });

    response.on('end', function(){
      fs.writeFile(filePath(playerCode), data, 'binary', function(err){
        if(err){
          console.log(err);
        }

        players[index].image = fileName(playerCode);

        return getPlayerImage(++index, players);
      })
    });
  });
}

fs.readFile('data/mlb.json', function(err, data){
  if(err){
    return console.log(err);
  }

  getPlayerImage(i, JSON.parse(data));
});
