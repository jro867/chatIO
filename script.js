$(function(){
  var socket = io.connect();
  var $messageForm = $('#messageForm');
  var $message = $('#message');
  var $chat = $('#chat');
  var $userFormArea = $('#userFormArea');
  var $messageArea = $('#messageArea');
  var $userForm = $('#userForm');
  var $users = $('#users');
  var $username = $('#username');

  $messageForm.submit(function(e){
    e.preventDefault();
    console.log('submited');

    var url = "http://localhost:3000/translate?q="+ $message.val();
    console.log("url: ", url);

    $.getJSON(url,function(data){
     // console.log("Translated data: ",data);
      console.log("Translated data: ",data.data);
      socket.emit('send message', data.data); //send message
      $message.val('');
    });       
  });

  socket.on('new message', function(data){
    $chat.append('<div class="well"><strong>'+data.user+': </strong>'+data.msg+'</div>');
  });

  $userForm.submit(function(e){
    e.preventDefault();
    console.log('submited');
    socket.emit('new user', $username.val(),function(data){
      if(data){
        $userFormArea.hide();
        $messageArea.show();
      }
    });
    $username.val('');
  });
  socket.on('get users',function(data){
    var html = '';
    for(i = 0; i < data.length; i++){
      html +='<li class="list-group-item">'+data[i]+'</li>';
    }
    $users.html(html);
  });
});