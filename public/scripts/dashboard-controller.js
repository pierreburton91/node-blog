function handleTabClick() {
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
            articlesButton.classList.remove('active');
            subscribersButton.classList.add('active');
        }
    }
}

function checkAll() {
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

function handleBoxCheck() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]'),
        isChecked = Array.prototype.slice.call(checkboxes).some(function(x) {return x.checked}),
        checkedOnes = Array.prototype.slice.call(checkboxes).filter(function(x) {return x.checked}),
        editPostButton = document.querySelector('#edit-post'),
        deletePostButton = document.querySelector('#delete-post'),
        exportContactButton = document.querySelector('#export-contacts'),
        deleteContactButton = document.querySelector('#delete-contacts');

    if (checkedOnes.length == 0) {
        editPostButton.disabled = true;
        deletePostButton.disabled = true;
        exportContactButton.disabled = false;
        deleteContactButton.disabled = true;
    }
    else if (checkedOnes.length == 1) {
        editPostButton.disabled = false;
        deletePostButton.disabled = false;
        exportContactButton.disabled = false;
        deleteContactButton.disabled = false;
    }
    else {
        editPostButton.disabled = true;
        deletePostButton.disabled = false;
        exportContactButton.disabled = false;
        deleteContactButton.disabled = false;
    }
}