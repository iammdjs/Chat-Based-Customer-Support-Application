const socket = io("http://localhost:8000");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const clientList = document.querySelector('.clientList');
var audio = new Audio('ting.mp3')
var curUser = "hello";

/* 
We need to 
    Allow CORS: Access-Control-Allow-Origin
    enable to connect client to server
    
    chrome extension link :- https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf/related
*/
// socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
// });

const users = {};

const append = (message, userId, position)=>{                
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    // messageElement.onclick = function(){ getUserId(userId)};
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
    
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
const getUserId = (userId, ename) =>{
    // messageInput.value = userId+",";
    messageContainer.innerHTML = '';
    
    const notify = document.getElementById('notify_'+ userId);
    notify.style.backgroundColor = 'rgba(255,0,0,0.0)';
    notify.innerText = "";
    
    if(curUser != "hello"){
        document.getElementById(curUser).style.backgroundColor = 'rgba(255,0,0,0.0)';
    }
    document.getElementById(userId).style.backgroundColor = 'rgb(255, 250, 250)';
    
    curUser = userId;
    
    for(var i=0; i<Object.keys(users[userId]).length; i++){
        var printName = users[userId][i]["ename"];
        if(users[userId][i]["msgPos"] == "right"){
            printName = "You";
        }
        append(`${printName}: ${users[userId][i]["message"]}`, `${userId}`, users[userId][i]["msgPos"]);
    }
}
const appendUser = (ename, userId, position)=>{
    const userElement = document.createElement('div');
    userElement.classList.add('user');
    userElement.id = userId;
    userElement.onclick = function(){ getUserId(userId, ename)};
    
    const messageElement = document.createElement('div');
    messageElement.innerText = 'Name-> '+ename+'\nUser Id-> '+userId;
    messageElement.classList.add('user-info');
    messageElement.classList.add(position);
    userElement.appendChild(messageElement);
    
    const notifyElement = document.createElement('div');
    notifyElement.innerText = ""
    notifyElement.id = 'notify_'+userId;
    notifyElement.classList.add('notify');
    notifyElement.style.backgroundColor = 'rgba(255,0,0,0.0)';
    userElement.appendChild(notifyElement);
    
    
    clientList.append(userElement);
    users[userId] = {};
    // if(position == 'left'){
    //     audio.play();
    // }
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'Expert', 'right');
    // const array = message.split(",");
    // let msg = "";
    // for(let i=1; i<array.length-1; i++){
    //     msg += array[i] + ',';
    // }
    // msg += array[array.length-1];
    socket.emit("expert-send", {receiver: curUser, message: message});
    // if(message.includes("hello")){
    //     socket.emit("hello", message);
    // }
    
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    
    
    messageInput.value = '';
    const l = Object.keys(users[curUser]).length;
    users[curUser][l] = {"message": message, "ename": "Expert", "msgPos": "right", "msgTime": datetime};
})
const ename = prompt("Enter your name to join");
document.getElementById("expert-heading").innerText = "Client Page (Name :- "+ename+")";
socket.emit("field-expert-joined", ename);

socket.on("user-joined", data =>{
    appendUser(`${data.uName}`, `${data.userId}`, 'left');
})
// socket.on("hi", data =>{
//     append(`${data.ename}: ${data.message}`, 'left');
// })

socket.on("receive", data =>{
    
    if(data.userId == curUser){
        append(`${data.ename}: ${data.message}`, `${data.userId}`, 'left');
    }
    else{
        const notify = document.getElementById('notify_'+ data.userId);
        notify.style.backgroundColor = "gold";
        var count = notify.innerText;
        if(count == ""){
            notify.innerText = "1";
        }
        else{
            count = Number(count);
            count++;
            notify.innerText = String(count);
        }
    }
    
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    
    const l = Object.keys(users[data.userId]).length;
    users[data.userId][l] = {"message": data.message, "ename": data.ename, "msgPos": "left", "msgTime": datetime};
})


let saveFile = (userId) => {
    
    

    // This variable stores all the data.
    let data = "";
    
    for(var i=0; i<Object.keys(users[userId]).length; i++){
        data += users[userId][i]["msgTime"]+'\n' + users[userId][i]["ename"]+' :  ' + users[userId][i]["message"] + '\n\n';
    }

    // Convert the text to BLOB.
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = 'formData.txt';	   // The file to save the data.

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
      newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
      newLink.href = window.URL.createObjectURL(textToBLOB);
      newLink.style.display = "none";
      document.body.appendChild(newLink);
    }

    newLink.click(); 
}

socket.on("left", userId =>{
    saveFile(userId)
    // append(`${ename}: left the chat`, 'left');
})