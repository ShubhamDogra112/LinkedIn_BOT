const btn = document.querySelectorAll(".tableBtn")
let url = "http://localhost:3000/sendInvites";
for(let i in btn){
	btn[i].addEventListener('click', () => {
		alert("Starting pupeeteer script")
		sendReq(url);
	})
}

function sendReq(url){
	fetch(url)
	.then(res => {
		alert("Personallized invite send to 5 people");
	})
	.catch(err => {
		console.error(err);
	})
}
