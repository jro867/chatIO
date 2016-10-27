    /**
      COMMENT:
        We are using node to tranlate the msg from each user. Look into the server.js file

        So every time that user enters a msg we grab the msg and use /translate in our server to call 
        http://api.phteven.io/intakepoint/ and then parse the data and send it back to to the frontend
        to post the translated msg.

        The rest of the project use node as a server for sockets IO.
    **/    

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

        var translatedData = "";
        //READ THE COMMENTS ABOVE
        //var url = "http://localhost:3000/translate?q="+ $message.val();
	       var url = "http://ec2-54-200-183-25.us-west-2.compute.amazonaws.com:3000/translate?q=" + $message.val();
        console.log("url: ", url);

          $.getJSON(url,function(data){
          console.log("Translated data: ",data.data);
          socket.emit('send message', data.data); //send message
          $message.val('');
        });       
      });

      socket.on('new message', function(data){
        $chat.append('<div class="well"><strong>'+data.user+': </strong>'+data.msg+'</div>');
      });
      //TEAD THE COMMENTS ABOVE
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
    //READ COMMENTS ABOVE