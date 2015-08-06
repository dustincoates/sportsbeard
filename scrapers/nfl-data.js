var casper  = require('casper').create({ verbose: true });
var fs      = require('fs');
var players = [];

function range(lower, upper){
  var charRange = [],
      start = lower.charCodeAt(0),
      end = upper.charCodeAt(0);

  for(; start <= end; ++start){
    charRange.push(String.fromCharCode(start));
  }

  return charRange;
}

function listUrl(character){
  return "http://www.nfl.com/players/search?category=lastName&filter=" + character + "&playerType=current";
}

var listUrls = range('A', 'Z').map(function(character){
  return listUrl(character);
});

var currentUrl = 0;

function getData(){
  var rows = document.querySelectorAll('tr.odd, tr.even');
  var data = [];
  Array.prototype.forEach.call(rows, function(row){
    data.push({
      name: row.querySelector('a').innerText,
      url: "http://www.nfl.com" + row.querySelector('a').getAttribute('href'),
      league: "NFL",
      sport: "football"
    });
  });

  return data;
}

function start(url){
  this.start(url, function(){
    this.echo('Grabbing from: ' + url);
  });
}

function fetchPlayerUrls(url){
  this.then(function(){
    data = this.evaluate(getData);
    this.echo(data.length + ' new players');
    players = players.concat(data);

    var next = '.linkNavigation.floatRight strong + a'
    if(casper.visible(next)){
      var that = this;

      casper.echo('Fetch next page');
      casper.thenClick(next);
      casper.then(function(){
        fetchPlayerUrls.call(that, players);
      });
    } else {
      casper.echo('Finished fetching player data for this letter.');
    }
  });
}

function fetch(){
  if(listUrls[currentUrl]){
    start.call(this, listUrls[currentUrl]);
    fetchPlayerUrls.call(this, listUrls[currentUrl]);
    currentUrl++;
    this.run(fetch);
  } else {
    this.echo('Finished grabbing NFL player URLs');
    fs.write('data/nfl.json', JSON.stringify(players), 'w');
    this.exit();
  }
}

casper.start().then(function(){
  this.echo('Grabbing NFL player URLs');
});

casper.run(fetch);
