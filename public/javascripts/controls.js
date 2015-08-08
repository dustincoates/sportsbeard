(function(){
  var keymap = {
    49: 'none', //1
    50: 'beard', //2
    51: 'moustache', //3
    52: 'goatee', //4
    48: 'other', //0
    45: 'remove' //-
  };

  function setSelection(selection, player){
    //update player
    //observer player
    //when player has changed, refresh
    //send those changes to the DOM
    window.player = player
  }

  $(document).ready(function(){
    var player = new Player($('#player').data('id'));

    Object.observe(player, function(changes){
      changes.forEach(function(change){
        console.log(change.type, change.name, change.oldValue);
      })
    });

    $('#player button').on('click', function(e){
      var $currentTarget = $(e.currentTarget),
          selection = $currentTarget.attr('id');
    });

    $('body').on('keypress', function(e){
      var selection = keymap[e.which];
      if(selection){
        setSelection(selection, player);
      }
    });
  });
})();
