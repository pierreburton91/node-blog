var host = window.location.host;

/* For dev purpose */
if (host == "localhost:4000") {
	host = "localhost:3000";
}

if(sessionStorage.getItem('nodejscms-'+ host +'-auth-token') || localStorage.getItem('nodejscms-'+ host +'-auth-token')) {
    var cred = sessionStorage.getItem('nodejscms-'+ host +'-auth-token') || localStorage.getItem('nodejscms-'+ host +'-auth-token');
   	console.log("User is known as : " + cred);
}
else {
    window.location.href = "/login";
}