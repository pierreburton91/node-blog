
if (!window.Promise) {
  window.Promise = Promise;
}

var uploadView = document.querySelector('.upload'),
    uploadForm = document.querySelector('#upload-form'),
    uploadInput = document.querySelector('input[name="upload-file"]'),
    dropZone = document.querySelector('.dragndrop'),
    fileLink = document.querySelector('input[name="file-link"]'),
    uploadPreviewContainer = document.querySelector('.upload-preview'),
    uploadPreview = document.querySelector('#previewed'),
    imagePreviewContainer = document.querySelector('.image-preview'),
    previewError = document.querySelector('.preview-error'),
    cancelPreviewButton = document.querySelector('#cancel-upload'),
    cancelUploadButton = document.querySelector('#upload-close'),
    uploadButton = document.querySelector('#upload-confirm'),
    acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"],
    simplemde = new SimpleMDE({
    spellChecker: false,
    forceSync: true,
    insertTexts: {link: ["[text to display](http://...)",""]},
    toolbar: ["bold", "italic", "heading-2", "heading-3", "|", "quote", "unordered-list", "ordered-list", "|", "link", {
        name: "Image",
        action: function uploadImageInSimplemde(editor) {

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
                throw err;
            }).then(function(result){
                uploadView.style.display = "none";
                uploadButton.disabled = true;
                fileLink.value = "";
                uploadInput.value = "";
                uploadForm.style.display = "block";
                uploadPreviewContainer.style.display = "none";

                editor.options.insertTexts.image[0] = "![]("+result+")";
                editor.options.insertTexts.image[1] = "";

                simplemde.drawImage();
            }, function(err) {
                uploadView.style.display = "none";
                uploadForm.style.display = "block";
                uploadPreviewContainer.style.display = "none";
                previewError.style.display = "none";
                fileLink.value = "";
                uploadInput.value = "";
                uploadButton.disabled = true;
                if(err) {
                    uploadImageInSimplemde();
                }
                else {
                    uploadView.style.display = "none";
                }
            });
        },
        className: "fa fa-picture-o",
        title: "Insert Image"
        }, "|", "preview", "side-by-side", "fullscreen", "|", "guide"]
    }),
    tagsInput = document.querySelector('input[name="tags"]'),
    tagsContainer = tagsInput.closest('.labeled'),
    tagBoxGroup,
    tags = [];

dropZone.addEventListener("dragover", function( event ) {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.add("dragover");
}, false);
dropZone.addEventListener("dragleave", function( event ) {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove("dragover");
}, false);


// Update tags array and resize tagInput on load if article update
if (document.querySelectorAll('.tags') != undefined) {
    tagBoxGroup = document.querySelectorAll('.tags');

    for(var i=0 ; i < tagBoxGroup.length ; i++) {
        offset += tagBoxGroup[i].offsetWidth + 9;
        tagsInput.style.width = "calc(100% - "+ offset +"px)";
    }
}

/* Add tags and resize the input when hitting the coma
prevents writting new tags if 5 tags are already there
prevents a bug where writting a single coma cause the layout to break */
tagsInput.addEventListener('keyup', function(e) {
    if (tags.length == 5 && e.keyCode == 188) {
        return false;
    }
    else if (e.target.value == ",") {
        tagsInput.value = "";
    }
    else if (e.keyCode == 188) {
        var inputValue = e.target.value,
            tag = inputValue.substring(0, inputValue.length - 1),
            tagBox = document.createElement('span'),
            tagBoxText = document.createTextNode(tag),
            offset = 0;

        tagsInput.value = "";
        if (!document.querySelector('input[name="tags"] + .float-label').classList.contains("active")) {
            document.querySelector('input[name="tags"] + .float-label').classList.add("active");
        }
        tags.push(tag);
        tagBox.classList.add('tags');
        tagBox.appendChild(tagBoxText);
        tagsContainer.insertBefore(tagBox, tagsInput);

        tagBoxGroup = document.querySelectorAll('.tags');

        for(var i=0 ; i < tagBoxGroup.length ; i++) {
            offset += tagBoxGroup[i].offsetWidth + 9;
            tagsInput.style.width = "calc(100% - "+ offset +"px)";
        }
    }
});

/* Removes last tag on hitting return if input is empty
and prevents writting new tags if 5 tags are already there */
tagsInput.addEventListener('keydown', function(e) {
    if (e.keyCode == 8 && tagsInput.value == "") {
        var tagBoxGroup = document.querySelectorAll('.tags'),
            lastItem = tagBoxGroup.length;
        if (tagBoxGroup.length > 0) {
            tagsContainer.removeChild(tagsContainer.childNodes[lastItem]);
            tags.pop();
        }
        if (tagBoxGroup.length == 1) {
            document.querySelector('input[name="tags"] + .float-label').classList.remove("active");
        }
    }
    else if (tags.length == 5 && e.keyCode != 8) {
        e.preventDefault();
        e.stopPropagation();
    }
});

/* Removes tags on click */
tagsContainer.addEventListener('click', function(e){
    if(e.target && e.target.classList.contains("tags")) {
        var currentItem = e.target.innerHTML,
            tagToDelete = tags.indexOf(currentItem);

        tagsContainer.removeChild(tagsContainer.childNodes[tagToDelete + 1]);
        tags.splice(tagToDelete, 1);
        if(tags.length == 0) {
            document.querySelector('input[name="tags"] + .float-label').classList.remove("active");
        }
    }
});

function goBack() {
    var title = document.querySelector('input[name="post-title"]'),
        articleBody = document.querySelector('textarea');

    if (title.value != "" || articleBody.value != "") {
        var confirm = window.confirm("Are your sure ? All your work will be lost.");
        // console.log(simplemde.options.previewRender(articleBody.value)); Needed for db insert
        if (confirm == true) {
            window.location.href = "/";
        }
        else {
            return false;
        }
    }
    else {
        window.location.href = "/";
    }
}