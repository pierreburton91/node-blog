function login() {
    var user = document.querySelector("#user"),
        password = document.querySelector("#password"),
        toSave = document.querySelector("#save").checked,
        data = {"username": user.value, "password": password.value, "toSave": toSave};

    if (user.value == "" || password.value == "") {
        if (user.value == "") {
            user.focus();
        }
        if (password.value == "") {
            if (user.value != "") {
                password.focus();
            }
        }

        var popUpInfos = {"type": "error", "form": "login", "reason": "empty"};
        displayPop(popUpInfos);
    }
    else {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = this.responseText;
                    if(response == "true") {
                        window.location.href = "/";
                    }
                    else {
                        var popUpInfos = {"type": "error", "form": "login", "reason": "wrong"};
                        displayPop(popUpInfos);
                    }
                }
                else {
                    console.log(this.status, this.statusText, this.getAllResponseHeaders());
                    var popUpInfos = {"type": "error", "form": "login", "reason": this.status + " - " + this.statusText };
                        displayPop(popUpInfos);
                }
            }
        }
        xhr.open("POST", "/api/check-credentials", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }
}