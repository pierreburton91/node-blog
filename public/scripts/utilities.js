// Utilities functions

/** DEBOUNCE
* Retourne une fonction qui, tant qu'elle continue à être invoquée,
* ne sera pas exécutée. La fonction ne sera exécutée que lorsque
* l'on cessera de l'appeler pendant plus de N millisecondes.
* Si le paramètre `immediate` vaut vrai, alors la fonction 
* sera exécutée au premier appel au lieu du dernier.
* Paramètres :
*  - func : la fonction à `debouncer`
*  - wait : le nombre de millisecondes (N) à attendre avant 
*           d'appeler func()
*  - immediate (optionnel) : Appeler func() à la première invocation
*                            au lieu de la dernière (Faux par défaut)
*  - context (optionnel) : le contexte dans lequel appeler func()
*                          (this par défaut)
*/
function debounce(func, wait, immediate, context) {
    var result;
    var timeout = null;
    return function() {
        var ctx = context || this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) result = func.apply(ctx, args);
        };
        var callNow = immediate && !timeout;
        // Tant que la fonction est appelée, on reset le timeout.
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(ctx, args);
        return result;
    };
}

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