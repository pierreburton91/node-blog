var valuesChecked = [];

function handleTabClick(event) {
    var target = event.currentTarget,
        articlesButton = document.querySelector('#panel-posts'),
        subscribersButton = document.querySelector('#panel-subscribers'),
        articlesActions = document.querySelector('#posts-actions'),
        subscribersActions = document.querySelector('#subscribers-actions'),
        articlesTable = document.querySelector('#dashboard-posts'),
        subscribersTable = document.querySelector('#dashboard-subscribers');

    if (target.id == "panel-posts") {
        if (articlesButton.classList.contains('active')) {
            return false;
        }
        else {
            subscribersTable.style.display = "none";
            articlesTable.style.display = "table";
            subscribersActions.style.display = "none";
            articlesActions.style.display = "block";
            var inputs = subscribersTable.querySelectorAll('input[type="checkbox"]');
            for (i = 0; i < inputs.length; i++) {
                inputs[i].checked = false;
            }
            setActionsAvailability();
            subscribersButton.classList.remove('active');
            articlesButton.classList.add('active');
        }
    }
    else {
        if (subscribersButton.classList.contains('active')) {
            return false;
        }
        else {
            articlesTable.style.display = "none";
            subscribersTable.style.display = "table";
            articlesActions.style.display = "none";
            subscribersActions.style.display = "block";
            var inputs = articlesTable.querySelectorAll('input[type="checkbox"]');
            for (i = 0; i < inputs.length; i++) {
                inputs[i].checked = false;
            }
            setActionsAvailability();
            articlesButton.classList.remove('active');
            subscribersButton.classList.add('active');
        }
    }
}

function checkAll(event) {
    var target = event.target,
        parentTable = target.closest('table'),
        inputs = document.querySelectorAll('#'+parentTable.id+' input[type="checkbox"]');

    for (i = 1; i < inputs.length; i++) {
        if (target.checked) {
            inputs[i].checked = true;
        }
        else {
            inputs[i].checked = false;
        }
    }        
}

function setActionsAvailability() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#checkAll)'),
        checkedOnes = Array.prototype.slice.call(checkboxes).filter(function(x) {return x.checked}),
        editPostButton = document.querySelector('#edit-post'),
        deletePostButton = document.querySelector('#delete-post'),
        deleteContactButton = document.querySelector('#delete-contacts');

    if (checkedOnes.length == 0) {
        editPostButton.disabled = true;
        deletePostButton.disabled = true;
        deleteContactButton.disabled = true;
    }
    else if (checkedOnes.length == 1) {
        editPostButton.disabled = false;
        deletePostButton.disabled = false;
        deleteContactButton.disabled = false;
    }
    else {
        editPostButton.disabled = true;
        deletePostButton.disabled = false;
        deleteContactButton.disabled = false;
    }

    valuesChecked = [];
    for (i=0; i < checkedOnes.length; i++) {
        valuesChecked.push(checkedOnes[i].value);
    }
}

function handleActionClick(entity, action) {
    if(entity == 'articles' && action == 'edit') {
        window.location.href = "/edit/" + valuesChecked[0];
    } else if (entity == 'subscribers' && action == 'export') {
        window.location.href = "/api/export-subscribers";
    } else {
        if (action == "delete") {
            var prompt = window.confirm("You are about to delete the selected "+ entity +".\nAre you sure ?");
            if (prompt == false) {
                return;
            }
        }
        var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status == 200) {
					var response = JSON.parse(this.responseText),
						isSuccess = response.success,
                        message = response.message;

					if (isSuccess) {
						var popUpInfos = { "type": "success", "text": "The operation succeeded ! " + message + "" };
                        displayPop(popUpInfos);
                        setTimeout(function () { window.location.href = "/"; }, 2000);
					}
					else {
						var popUpInfos = { "type": "warning", "text": "An error occured. Please contact the support." };
						displayPop(popUpInfos);
					}

				}
				else {
					console.log(this.status, this.statusText, this.getAllResponseHeaders());
					var popUpInfos = { "type": "error", "text": "Internal server error. Please contact the support." };
					displayPop(popUpInfos);
				}
			}
        }

		if (entity == 'articles' && action == 'delete') {
			xhr.open("DELETE", "/api/delete-posts", true);
		} else if (entity == 'subscribers' && action == 'export') {
			xhr.open("POST", "/api/export-subscribers", true);
		} else if (entity == 'subscribers' && action == 'delete') {
            xhr.open("DELETE", "/api/delete-subscribers", true);
        }
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(valuesChecked));
    }
}