var casper  = require('casper').create({ verbose: true });
var fs      = require('fs');
var players = [];

// Player rows:
// div.view.view-players-list > div.view-content > table > tbody > tr
// Number:
// views-field-field-player-jersey-no-value
// Position:
// views-field-field-player-position-detail-value
// Name:
// views-field-field-player-lname-value
// Team:
// views-field-field-player-club-nid
// Age:
// views-field-field-player-birth-date-value-1
// Height:
// views-field-field-player-height-value
// Weight:
// views-field-field-player-weight-value
// Birth country:
// views-field-field-player-birth-country-value

function getData() {
    var rows = document.querySelectorAll('div.view.view-players-list > div.view-content > table > tbody > tr');
    var data = []
    Array.prototype.forEach.call(rows, function(row) {
        data.push({
          url: 'http://www.mlssoccer.com' + row.querySelector('.views-field-field-player-lname-value a').getAttribute('href'),
          number: parseInt(row.querySelector('.views-field-field-player-jersey-no-value').innerText, 10),
          position: row.querySelector('.views-field-field-player-position-detail-value').innerText,
          name: row.querySelector('.views-field-field-player-lname-value').innerText,
          team: row.querySelector('.views-field-field-player-club-nid').innerText,
          age: row.querySelector('.views-field-field-player-birth-date-value-1').innerText,
          height: row.querySelector('.views-field-field-player-height-value').innerText,
          weight: row.querySelector('.views-field-field-player-weight-value').innerText,
          birthCountry: row.querySelector('.views-field-field-player-birth-country-value').innerText,
          sport: 'soccer',
          league: 'MLS'
        });
    });

    return data;
}

function fetch(players){
  data = this.evaluate(getData);
  this.echo(data.length + " new players");
  players = players.concat(data);

  var next = 'li.pager-next a';
  if(casper.visible(next)){
    var that = this;

    casper.echo('Fetching next page');
    casper.thenClick(next);

    casper.then(function(){
      fetch.call(that, players);
    });
  } else {
    fs.write('data/mls.json', JSON.stringify(players), 'w');
    casper.echo('Finished fetching player data.');
  }
}

casper.start('http://www.mlssoccer.com/players?field_player_club_nid=All&tid_2=197&title=', function(){});

casper.then(function(){
  fetch.call(this, players);
});

casper.on('remote.message', function(msg) {
  console.log('[Remote Page] ' + msg);
});

casper.run(function(){
  this.exit();
});

