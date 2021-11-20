let name = document.querySelector('.name');
let textarea = document.querySelector('#textarea');
let loginScreen = document.querySelector('.login__screen');
let room;
const btn = document.querySelector(".btn");
const roomName = document.querySelector(".room__name");
let displayError = document.querySelector('.display-error');
let preloader = document.querySelector('.preloader');
const check = ()=>{
	if (name.value.trim() !== "" && roomName.value.trim() !== "") {
		btn.classList.remove('disable')
	}
	else{
		
		btn.classList.add('disable')
	}
}
check()
name.addEventListener('keyup',(e)=>{
	check()
})
roomName.addEventListener('keyup',(e)=>{
	check()
})

btn.addEventListener('click',()=>{
	sendName = name.value;
	room = roomName.value.toLowerCase();
	window.location.href = `${window.location.protocol}//${window.location.host}/chat?name=${sendName}&room=${room}`
})
window.addEventListener('load',()=>{
	preloader.style.opacity = "0";
preloader.style.zIndex = "-1";

})