// Utilities functions

// Notification pop-up
function displayPop(content) {
    // Remove existing pop if any
    if (document.querySelector(".pop-container")) {
        document.querySelector('body').removeChild(document.querySelector(".pop-container"));
    }
    // Create the HTML string
    var element = '<div class="pop-container"><div class="pop"><div class="pop-content"></div><div class="pop-close"><i class="fa fa-close"></i></div></div></div>',
        body = document.querySelector('body');
    // append HTML string to body
    body.insertAdjacentHTML('beforeend', element);

    var popUp = document.querySelector(".pop"),
        popUpContainer = document.querySelector(".pop-container"),
        closeButton = document.querySelector(".pop-close"), 
        popUpContent = document.querySelector(".pop-content"),
        contentText; 

    switch (content.type) {
        case "error":
            popUp.classList.add('error');
            break;
        case "warning":
            popUp.classList.add('warning');
            break;
        case "success":
            popUp.classList.add('success');
            break;
        case "info":
            popUp.classList.add('info');
            break;
    }

    if (content.form == "login") {
        switch (content.reason) {
            case "empty":
                contentText = "Some required fields are empty !";
                break;
            case "wrong":
                contentText = "Invalid Username and Password combination !";
                break;
            default:
                contentText = "Something went wrong...";
        }
    }
    else if (content.form == "register") {
        contentText = "The super content of the dead for your pop-up !"; 
    }

    // your text to display
    popUpContent.innerHTML = contentText;

    

    // Display popup
    setTimeout(function() {
        popUpContainer.classList.add('show-pop');
    }, 300);

    // click event on close button
    closeButton.addEventListener("click", function() {
        popUpContainer.classList.remove('show-pop');
        
        // remove the pop-up from the DOM
        setTimeout(function() {
            body.removeChild(popUpContainer);
        }, 300);
    });
}