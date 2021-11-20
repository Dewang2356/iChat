const socket = io();
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let userOnline = document.querySelector('.online-users');
let userOnlineList = document.querySelectorAll('.userOnlineList');
let chatSection = document.querySelector('.chat__section');
let P;
let userTyping = document.createElement('p');
let send = document.querySelector('.send');
const toggle = document.querySelector(".toggle");
const colorArray = ["#35cd96", "#8b7add", "#dfb610", "#6bcbef", "#3bdec3", "#e69f73", "#91ab01", "#e68200", "#00b33e"];
let typingArea = document.querySelector('.typingArea');
let sendName;
let name;
let roomName;
let emoji = document.querySelector('.emojionearea-editor');
const audio = document.getElementById("audio");
let preloader = document.querySelector('.preloader');
const generateRandomColor = () => {
    result = Math.floor((Math.random() * colorArray.length));
    return result;
}
toggle.addEventListener('click', () => {
    userOnlineList[1].classList.toggle('toggle');
})
window.addEventListener('load', () => {
    userOnlineList[0].innerHTML = "";
    userOnlineList[1].innerHTML = "";
    typingArea.style.width = messageArea.clientWidth + "px";
    name = new webkitURL(location.href).searchParams.get('name')
    roomName = new webkitURL(location.href).searchParams.get('room')
    if (!new webkitURL(location.href).searchParams.get('name') || !new webkitURL(location.href).searchParams.get('room')) {
        window.location.href = `${window.location.protocol}//${window.location.host}`
    }
    socket.emit('login', name, roomName)
    alert(`${name}, Welcome to the ${roomName} room`)
    socket.on('error', (error) => {
        if (error) {
            window.location.href = `${window.location.protocol}//${window.location.host}`
            window.alert(error)
        }
        
        
    })
    preloader.style.opacity = "0";
    preloader.style.zIndex = "-1";
})

const playAudio = () => {
    var context = new AudioContext();
    
    context.resume().then(() => {
        audio.play();
        
    });
}

function scrollSmoothToBottom() {
    window.scrollBy(messageArea.scrollHeight, messageArea.scrollHeight);
    
}
textarea.addEventListener('keyup', (e) => {
    
    textarea.value.trim()
    if (e.key === 'Enter' && textarea.value.trim() !== "") {
        sendMessage(e.target.value);
        textarea.value = "";
        socket.emit('typing', name, roomName, e.target.value)
        typing(e.target.value);
    } else {
        socket.emit('typing', name, roomName, e.target.value)
    }
    
})
textarea.addEventListener('keypress', (e) => {
    if (e.keyCode == '13') {
        e.preventDefault();
    }
})
send.addEventListener('click', () => {
    if (textarea.value.trim() !== "") {
        sendMessage(textarea.value.trim());
        textarea.value = "";
        
        textarea.focus()
    }
})

const typing = (getVal) => {
    if (getVal === "") {
        
        
        userTyping.innerHTML = "";
        userTyping.style.display = "none";
        
        scrollSmoothToBottom();
    }
}
const sendMessage = (message) => {
    let msg = {
        user: name,
        message: message,
        room: roomName
    }
    appendMessage(msg, 'outgoing')
    socket.emit('sendMessage', msg);
    typing();
    
    scrollSmoothToBottom();
    
}
generateRandomColor();
const appendMessage = (msg, type) => {
    generateRandomColor();
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.style.display = "inherit";
    mainDiv.classList.add('hmm')
    let final = msg.message.replace(' ', '');
    
    let markup = `
	${className === "outgoing" ? "" : `<h4 style="color:${colorArray[result]};text-transform:capitalize" class="scale-up-center">${msg.user}</h4>`}
	<div class="${className} message scale-up-center">
	
	
	
	
	<p>${msg.message}</p>
	
	
	</div>
	`
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
    
    scrollSmoothToBottom();
    
    
}
const hehe = (val) => {
    let mainP = document.createElement('li');
    let mainL = document.createElement('li');
    mainP.classList.add('onlineuser')
    
    mainP.innerHTML = val;
    mainL.classList.add('onlineuser')
    mainL.innerHTML = val;
    userOnlineList[0].appendChild(mainP);
    userOnlineList[1].appendChild(mainL);
}
const chalo = (users) => {
    if (users) {
        for (a in users) {
            
            
            hehe(users[a].name);
            
        }
    }
}
const alert = (val) => {
    P = document.createElement('p');
    P.classList.add("alert", "scale-up-center");
    P.innerHTML = val;
    messageArea.appendChild(P);
    
}
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    
    playAudio();
    
    
})
socket.on('notification', (title) => {
    alert(title.title)
    
    
    scrollSmoothToBottom()
})

socket.on('users', (client) => {
    userOnlineList[0].innerHTML = "";
    userOnlineList[1].innerHTML = "";
    chalo(client)
    
})

socket.on('typing', (type) => {
    
    userTyping.classList.add('type')
    userTyping.style.display = "flex";
    userTyping.innerHTML = `<p>${type.name}</p> <img src="loading-buffering.gif" class="type-gif" alt="">`;
    messageArea.appendChild(userTyping);
    
    scrollSmoothToBottom();
    
    typing(type.val)
    
    
})
window.addEventListener('resize', () => {
    
    
    typingArea.style.width = messageArea.clientWidth + "px";
})
