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
        contentText = content.text;

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

// Upload image handler
function uploadImage(element) {
    var htmlString = '<div class="upload"><div class="upload-overlay"></div><div class="upload-modal"><div id="upload-form"><label class="dragndrop"><input type="file" name="upload-file" accept="image/*"><i class="fa fa-picture-o" aria-hidden="true"></i><p>Drag and drop or click here<br><span>to upload your image</span></p></label><p>or</p><label class="labeled"><input type="text" name="file-link" class="inputs" placeholder="http://example.com/image.png" required/><span class="float-label">Provide a link</span><div class="bottom-line"></div><div class="bottom-line-active"></div></label><span>Accepted files are images .jpeg, .png or .gif, max 2Mo.</span></div><div class="upload-preview"><div class="image-preview"><img id="previewed" src="" /><span class="preview-error"></span></div><a href="#" id="cancel-upload">Cancel and add another image</a></div><div class="button-f-right"><button id="upload-close" class="button borderless">Close</button><button id="upload-confirm" class="button" disabled="true">Add picture</button></div></div></div>',
        uploadView = document.querySelector('.upload'),
        uploadForm = document.querySelector('#upload-form'),
        uploadInput = document.querySelector('input[name="upload-file"]'),
        dropZone = document.querySelector('.dragndrop'),
        fileLink = document.querySelector('input[name="file-link"'),
        uploadPreviewContainer = document.querySelector('.upload-preview'),
        uploadPreview = document.querySelector('#previewed'),
        imagePreviewContainer = document.querySelector('.image-preview'),
        previewError = document.querySelector('.preview-error'),
        cancelPreviewButton = document.querySelector('#cancel-upload'),
        cancelUploadButton = document.querySelector('#upload-close'),
        uploadButton = document.querySelector('#upload-confirm'),
        acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    
    uploadView.style.display = "block";

    var promise = new Promise(function(resolve, reject) {

        function handleUpload(event) {
            uploadInput.removeEventListener('change', handleUpload);
            dropZone.removeEventListener('drop', handleUpload);
            fileLink.removeEventListener('keyup', handleUploadDebounced);
            cancelUploadButton.removeEventListener('click', closeUploadView);
            resolve(event);
        }
        function closeUploadView() {
            uploadInput.removeEventListener('change', handleUpload);
            dropZone.removeEventListener('drop', handleUpload);
            fileLink.removeEventListener('keyup', handleUploadDebounced);
            cancelUploadButton.removeEventListener('click', closeUploadView);
            reject()
        }
        uploadInput.addEventListener('change', handleUpload);
        dropZone.addEventListener('drop', handleUpload);
        var handleUploadDebounced = debounce(handleUpload, 2000);
        fileLink.addEventListener('keyup', handleUploadDebounced);
        cancelUploadButton.addEventListener('click', closeUploadView);
    });

    promise.then(function(event) {
        if (event.type == "change") {
            var file = uploadInput.files[0];

            uploadForm.style.display = "none";
            uploadPreviewContainer.style.display = "block";

            if (acceptedTypes.indexOf(file.type) != -1 && file.size <= 2097152) {
                uploadButton.disabled = false;
                readURL(uploadInput);
            }
            else if (acceptedTypes.indexOf(file.type) == -1) {
                var errorMessage = "The file you are trying to import is not a valid image file.";

                previewError.innerHTML = errorMessage;
                previewError.style.display = "block";
            }
            else if (file.size > 2097152) {
                var errorMessage = "The file you are trying to import weights more than 2Mo.";

                previewError.innerHTML = errorMessage;
                previewError.style.display = "block";
            }

            return new Promise(function(resolve, reject) {
                function confirmUpload() {
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    cancelUploadButton.removeEventListener('click', closeUploadView);

                    var formData = new FormData(),
                        xhr = new XMLHttpRequest();

                    formData.append('file', file);
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4) {
                            if (this.status == 200) {
                                var response = JSON.parse(this.responseText),
                                    imageLink = response.data.link;
                                resolve(imageLink);
                            }
                            else {
                                console.log(this.status, this.statusText, this.getAllResponseHeaders());
                                var popUpInfos = {"type": "error", "reason": this.status + " - " + this.statusText };
                                displayPop(popUpInfos);
                                reject(false);
                            }
                        }
                    }
                    xhr.open("POST", "/api/upload-image", true);
                    xhr.send(formData);
                    
                }
                function cancelAndChange() {
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelUploadButton.removeEventListener('click', closeUploadView);
                    reject(true);
                }
                function closeUploadView() {
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelUploadButton.removeEventListener('click', closeUploadView);
                    reject(false)
                }

                uploadButton.addEventListener('click', confirmUpload);
                cancelPreviewButton.addEventListener('click', cancelAndChange);
                cancelUploadButton.addEventListener('click', closeUploadView);
            });
            
        }
        else if (event.type == "drop") {
            event.preventDefault();
            event.stopPropagation();

            var file = event.dataTransfer.files[0];
            
            dropZone.classList.remove("dragover");
            uploadForm.style.display = "none";
            uploadPreviewContainer.style.display = "block";

            if (acceptedTypes.indexOf(file.type) != -1 && file.size <= 2097152) {
                uploadButton.disabled = false;
                readURL(event);
            }
            else if (acceptedTypes.indexOf(file.type) == -1) {
                var errorMessage = "The file you are trying to import is not a valid image file.";

                previewError.innerHTML = errorMessage;
                previewError.style.display = "block";
            }
            else if (file.size > 2097152) {
                var errorMessage = "The file you are trying to import weights more than 2Mo.";

                previewError.innerHTML = errorMessage;
                previewError.style.display = "block";
            }

            return new Promise(function(resolve, reject) {
                function confirmUpload() {
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    cancelUploadButton.removeEventListener('click', closeUploadView);
                    
                    var formData = new FormData(),
                        xhr = new XMLHttpRequest();

                    formData.append('file', file);
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4) {
                            if (this.status == 200) {
                                var response = JSON.parse(this.responseText),
                                    imageLink = response.data.link;
                                resolve(imageLink);
                            }
                            else {
                                console.log(this.status, this.statusText, this.getAllResponseHeaders());
                                var popUpInfos = {"type": "error", "reason": this.status + " - " + this.statusText };
                                displayPop(popUpInfos);
                                reject(false);
                            }
                        }
                    }
                    xhr.open("POST", "/api/upload-image", true);
                    xhr.send(formData);
                }
                function cancelAndChange() {
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelUploadButton.removeEventListener('click', closeUploadView);
                    reject(true);
                }
                function closeUploadView() {
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelUploadButton.removeEventListener('click', closeUploadView);
                    reject(false)
                }

                uploadButton.addEventListener('click', confirmUpload);
                cancelPreviewButton.addEventListener('click', cancelAndChange);
                cancelUploadButton.addEventListener('click', closeUploadView);
            });
        }
        else if (event.type == "keyup") {
            var link = event.target.value;

            uploadForm.style.display = "none";
            uploadPreviewContainer.style.display = "block";
            
            if (link.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                uploadButton.disabled = false;
                readURL(link);
            }
            else if (link.match(/\.(jpeg|jpg|gif|png)$/) == null) {
                var errorMessage = "The link you provided is not pointing to an image or couldn't be verified.";

                previewError.innerHTML = errorMessage;
                previewError.style.display = "block";
            }

            return new Promise(function(resolve, reject) {
                function confirmUpload() {
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    cancelUploadButton.removeEventListener('click', closeUploadView);
                    resolve(link);
                }
                function cancelAndChange() {
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelUploadButton.removeEventListener('click', closeUploadView);
                    reject(true);
                }
                function closeUploadView() {
                    cancelPreviewButton.removeEventListener('click', cancelAndChange);
                    uploadButton.removeEventListener('click', confirmUpload);
                    cancelUploadButton.removeEventListener('click', closeUploadView);
                    reject(false)
                }

                uploadButton.addEventListener('click', confirmUpload);
                cancelPreviewButton.addEventListener('click', cancelAndChange);
                cancelUploadButton.addEventListener('click', closeUploadView);
            });
        }
    }, function(err) {
        uploadView.style.display = "none";
        uploadButton.disabled = true;
        fileLink.value = "";
        uploadInput.value = "";
        uploadForm.style.display = "block";
        uploadPreviewContainer.style.display = "none";
        
        
    }).then(function(result){
        uploadView.style.display = "none";
        uploadButton.disabled = true;
        fileLink.value = "";
        uploadInput.value = "";
        uploadForm.style.display = "block";
        uploadPreviewContainer.style.display = "none";

        if (element.tagName == "IMG") {
            element.src = result;
        }
        else {
            element.style.backgroundImage = "url("+result+")";
        }
        //return result;

    }, function(err) {
        uploadView.style.display = "none";
        uploadForm.style.display = "block";
        uploadPreviewContainer.style.display = "none";
        previewError.style.display = "none";
        fileLink.value = "";
        uploadInput.value = "";
        uploadButton.disabled = true;
        if(err) {
            uploadImage(element);
        }
        else {
            uploadView.style.display = "none";
        }
    });
}

// File reader for image pre-render
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            document.querySelector('#previewed').setAttribute('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
    else if (input.dataTransfer && input.dataTransfer.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            document.querySelector('#previewed').setAttribute('src', e.target.result);
        }
        
        reader.readAsDataURL(input.dataTransfer.files[0]);
    }
    else {
        document.querySelector('#previewed').setAttribute('src', input);
    }
}

// Sets dynamic height for textarea as typing
function setTextareaHeight(target) {
    if (target.scrollHeight > 148) {
        target.style.height = 'auto';
        target.style.height = target.scrollHeight+'px';
    }
    else {
        target.removeAttribute('style');
    }
}