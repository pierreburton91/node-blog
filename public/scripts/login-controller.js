function login() {
    var user = document.querySelector("#user"),
        password = document.querySelector("#password"),
        data = {"username": user.value, "password": password.value};

    if (user.value == "" || password.value == "") {
        if (user.value == "") {
            user.focus();
        }
        if (password.value == "") {
            if (user.value != "") {
                password.focus();
            }
        }

        var popUpInfos = {"type": "warning", "text": "Some required fields are empty !"};
        displayPop(popUpInfos);
    }
    else {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if(response.success == true) {
                        var popUpInfos = {"type": "success", "text": response.message };
                        displayPop(popUpInfos);
                        setTimeout(function(){window.location.href = "/";}, 2000);
                    }
                    else {
                        var popUpInfos = {"type": "error", "text": "Wrong username/password combination ! " + this.responseText};
                        displayPop(popUpInfos);
                    }
                }
                else {
                    var popUpInfos = {"type": "error", "text": this.status + " - " + this.statusText };
                    displayPop(popUpInfos);
                }
            }
        }
        xhr.open("POST", "/api/check-credentials", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }
}

window.addEventListener("keypress", function(e) {
    if (e.keyCode == 13) {
        login();
    }
    return false;
})