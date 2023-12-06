// check offline or online 
let offline_text = document.querySelector(".offline-text");

function offlineUser() {
    offline_text.classList.add("offline-text-show")
}
function onlineUser() {
    offline_text.classList.remove("offline-text-show")
}

// check first code start 
if (navigator.onLine) onlineUser(); else offlineUser();

// if you offline during running
window.addEventListener("offline", offlineUser)
window.addEventListener("online", onlineUser)

