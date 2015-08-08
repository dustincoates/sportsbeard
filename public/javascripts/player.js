var Player = (function(){
  function Player(_id){
    this._id = _id;
  }

  Player.prototype.update = function(opts){
    this.success = null;
    this.error = null;

    $.ajax({
      url: '/players/' + this._id,
      type: 'POST',
      dataType: 'JSON',
      data: opts,
      context: this,
    }).done(function(data, textStatus, jqXHR){
      this.success = true;
      return this;
    }).fail(function(jqXHR, textStatus, errorThrown){
      this.success = false;
      this.error = errorThrown;
      return this;
    });
  }

  Player.prototype.refresh = function(){
    this.success = null;
    this.error = null;

    $.ajax({
      url: '/players',
      type: 'GET',
      dataType: 'JSON',
      context: this,
    }).done(function(data, textStatus, jqXHR){
      this._id = data._id;
      this.league = data.league;
      this.image = data.image;
      this.success = true;
      return this;
    }).fail(function(jqXHR, textStatus, errorThrown){
      this.success = false;
      this.error = errorThrown;
      return this;
    });
  }

  return Player;
})();
