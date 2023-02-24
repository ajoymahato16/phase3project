(function(){
    const app = document.querySelector(".app");
    const socket = io();
    let username;

    app.querySelector(".join-screen #join-user").addEventListener("click", function(){

        username = app.querySelector(".join-screen #username").value;

        if(username.length == 0)
        {
            return
        }

        socket.emit("newuser", username);
        app.querySelector(".download-chat .download").setAttribute("href",`api/${username}`);
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");

    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){

        let message = app.querySelector(".chat-screen #message-input").value;

        if(message.length == 0)
        {
            return;
        }
        renderMessage("my",{
            username:username,
            text:message
        })
        socket.emit("chat",{
            username : username,
            text:message
        })
        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(username){    
        socket.emit("exituser", username);       
        window.location.href = window.location.href;
    });
    
    socket.on("user-connected",function(socket_name){
        userjoinleft(socket_name,'joined')


    })
    socket.on("user-left",function(user){
       // console.log(user);
        userjoinleft(user,'left')
    })
    function userjoinleft(name, status)
    {
        let uselogin=`${name} has ${status}`

        let dvuser = app.querySelector(".chat-screen .user-join");
        dvuser.append(uselogin);
    }


    socket.on("udpate",function(update){
        renderMessage("update", update);
    });

    socket.on("chat",function(message){
        renderMessage("other", message);
    });

    function renderMessage(type,message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML= `
                <div>
                    <div class="name">you</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);

        }else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML= `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);

        } else if (type == "update")
        {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText =  message;
            messageContainer.appendChild(el);
            console.log("update");
        }
        messageContainer.scrollTop = messageContainer.scrollHeight = messageContainer.clientHeight;
    }
    
})();