var casper  = require('casper').create({ verbose: true });
var fs      = require('fs');
var players = JSON.parse(fs.read('data/mls.json'));

function fetchImage(){
  return this.evaluate(function(){
    return document.querySelector('.player-headshot img').getAttribute('src');
  });
}

function imageFileName(url){
  return url.match(/head-shots\/(.+)/)[1];
}

casper.start().each(players, function(self, player){
  this.thenOpen(player.url, function(){
    var imageUrl = fetchImage.call(this, player.url),
        fileName = imageFileName(imageUrl);

    this.echo("Saving: " + fileName);

    player.image = fileName;

    this.download(imageUrl, 'photos/mls/' + fileName);
  });
});

casper.run(function(){
  fs.write('data/mls.json', JSON.stringify(players), 'w');
  this.exit();
});
