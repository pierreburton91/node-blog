var catInput = document.querySelector('#category'),
	catItems = document.querySelector('.editor-categories'),
	categories = [];

if (document.querySelectorAll('.category-item') != undefined) {
	var categoryList = document.querySelectorAll('.category-item');
	for (i = 0; i < categoryList.length; i++) {
		categories.push(categoryList[i].childNodes[0].nodeValue);
	}
}

catInput.addEventListener('keyup', function (e) {
	if (e.keyCode == 13) {
		var value = e.target.value;

		// Prevent duplicates
		if (categories.indexOf(value) != -1) {
			var popUpInfos = { "type": "info", "text": "This category already exists." };
			displayPop(popUpInfos);
			catInput.value = "";
			return false;
		}

		var catBox = document.createElement('div'),
			catBoxText = document.createTextNode(value),
			closeButton = document.createElement('span'),
			closeCross = document.createTextNode('x');

		closeButton.appendChild(closeCross);
		catBox.appendChild(catBoxText);
		catBox.appendChild(closeButton);
		catBox.classList.add("category-item");
		catItems.appendChild(catBox);
		categories.push(value);
		catInput.value = "";
		location.href = "#category";
	}
});

catItems.addEventListener('click', function (e) {
	if (e.target && e.target.nodeName == "SPAN") {
		var currentCat = e.path[1].childNodes[0].data,
			catToDelete = categories.indexOf(currentCat);

		catItems.removeChild(catItems.childNodes[catToDelete + 1]);
		categories.splice(catToDelete, 1);
	}
});

function submit(update) {
	var username = document.querySelector('#username').value,
		password = document.querySelector('#password').value,
		repeatPassword = document.querySelector('#repeat-password').value,
		firstname = document.querySelector('#firstname').value,
		lastname = document.querySelector('#lastname').value,
		picture = document.querySelector('#profile-pic').src,
		email = document.querySelector('#email').value,
		description = document.querySelector('#description').value,
		name = document.querySelector('#name').value,
		catchphrase = document.querySelector('#catchphrase').value,
		data = {
			account: {
				username: username,
				password: password
			},
			about: {
				firstname: firstname,
				lastname: lastname,
				picture: picture,
				email: email,
				description: description,
				social: {
					facebook: '',
					twitter: '',
					google: '',
					instagram: '',
					pinterest: '',
					youtube: '',
					vimeo: '',
					medium: '',
					github: '',
					dribbble: '',
					behance: ''
				}
			},
			blog: {
				name: name,
				url: '',
				logo: '',
				catchphrase: catchphrase,
				categories: categories,
				social: {
					facebook: '',
					twitter: '',
					google: '',
					instagram: '',
					pinterest: '',
					youtube: '',
					vimeo: '',
					medium: '',
					github: '',
					dribbble: '',
					behance: ''
				}
			}
		};

	if (!username) {
		var popUpInfos = { "type": "error", "text": "You must choose a username." };
		displayPop(popUpInfos);
		document.querySelector('#username').focus();

	}
	else if (password.length < 8 && update == false && password != '') {
		var popUpInfos = { "type": "error", "text": "Your password must contain at least 8 characters." };
		displayPop(popUpInfos);
		document.querySelector('#password').focus();
	}
	else if (password != repeatPassword) {
		var popUpInfos = { "type": "error", "text": "Passwords don't match." };
		displayPop(popUpInfos);
		document.querySelector('#repeat-password').focus();
	}
	else if (!email || !document.querySelector('#email').checkValidity()) {
		var popUpInfos = { "type": "error", "text": "You must provide a valid email address." };
		displayPop(popUpInfos);
		document.querySelector('#email').focus();
	}
	else if (!name) {
		var popUpInfos = { "type": "error", "text": "Your blog must have a name." };
		displayPop(popUpInfos);
		document.querySelector('#name').focus();
	}
	else if (categories.length == 0) {
		var popUpInfos = { "type": "error", "text": "Your blog should at least have 1 category." };
		displayPop(popUpInfos);
		document.querySelector('#category').focus();
	}
	else {
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
		if (update != true) {
			xhr.open("POST", "/api/signup", true);
		} else {
			xhr.open("PUT", "/api/update-profile", true);
		}
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(data));
	}
}

function goBack() {
	window.location.href = "/";
}