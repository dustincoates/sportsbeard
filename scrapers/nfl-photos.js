var casper  = require('casper').create({
  verbose: true,
  pageSettings: {
    webSecurityEnabled: false
  }
});
var fs      = require('fs');
var players = JSON.parse(fs.read('data/nfl.json'));

function fetchPlayerData(){
  return this.evaluate(function(){
    return {
      image: document.querySelector('.player-photo img').getAttribute('src'),
      team: document.querySelector('.player-team-links a').innerText
    }
  });
}

function imageFileName(url){
  return url.replace(/^.*\//, '');
}

casper.start().each(players, function(self, player){
  this.thenOpen(player.url, function(){
    var playerData = fetchPlayerData.call(this, player.url);
    if(!playerData){
      this.echo('-----------------------------------');
      this.echo(player.name);
      this.echo('-----------------------------------');
    } else {
      for(var attr in playerData){
        player[attr] = playerData[attr];
      }

      var fileName = imageFileName(playerData.image);

      this.echo("Saving: " + playerData.image);

      this.download(playerData.image, 'photos/nfl/' + fileName);

      playerData.image = fileName;
    }

  });
});

casper.run(function(){
  fs.write('data/nfl.json', JSON.stringify(players), 'w');
  this.exit();
});
