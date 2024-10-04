const socket = io("http://localhost:8000");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('ting.mp3')

/* 
We need to 
    Allow CORS: Access-Control-Allow-Origin
    enable to connect client to server
    
    chrome extension link :- https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf/related
*/
// socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
// });

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
    
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    // if(message.includes("hello")){
    //     socket.emit("hello", message);
    // }
    messageInput.value = '';
})
const ename = prompt("Enter your name to join");
document.getElementById("client-heading").innerText = "Client Page (Name :- "+ename+")";
socket.emit("new-user-joined", ename);

// socket.on("user-joined", ename =>{
//     append(`${ename} joined the chat`, 'right');
// })
// socket.on("hi", data =>{
//     append(`${data.ename}: ${data.message}`, 'left');
// })

socket.on("receive", data =>{
    append(`${data.ename}: ${data.message}`, 'left');
})

// socket.on("left", ename =>{
//     append(`${ename}: left the chat`, 'left');
// })