(function () {
    'use strict';

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(function (error) {
            // registration failed
            console.log('Registration failed with ' + error);
        });
    }

    // Shortcut function
    function $(str) {
        if ( str.charAt(0) === '#' ) {
            return document.getElementById(str.substring(1));
        }
        return document.querySelector(str);
    }

    // Helper variables for item lists
    var currentItems = $('#currentItems');
    var completedItems = $('#completedItems');

    // Helper functions
    function getSelectedItem() {
        return $('li[data-selected]');
    }
    function selectItem(item) {
        item.setAttribute('data-selected', '');
    }
    function deselectItem() {
        var item = $('li[data-selected]');
        if ( item ) {
            item.removeAttribute('data-selected');
            $('textarea').value = '';
        }
    }
    function createNewItem() {
        var newItem = document.createElement('li');
        return currentItems.insertBefore(newItem, currentItems.lastElementChild);
    }
    function setItemText(item, theText) {
        item.innerHTML = theText.replace(/&/g, '&amp;').replace(/</g, '&lt;').
            replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
    function getItemText(item) {
        return item.innerHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').
            replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, '\'');
    }

    // Delegated Event Listener for Tabs
    $('nav').addEventListener('click', deselectItem);

    // Delegated Event Listeners for clicking on items
    function clickOnItemHandler(ev) {
        var item = ev.target;
        if ( item.nodeName === 'LI' && !item.classList.contains('modal') ) {
            selectItem(item);
        }
    }
    currentItems.addEventListener('click', clickOnItemHandler);
    completedItems.addEventListener('click', clickOnItemHandler);

    // Event Listeners for the buttons inside "New" tab
    $('#ok').addEventListener('click', function () {
        var item = getSelectedItem() || createNewItem();
        setItemText(item, $('textarea').value);
        deselectItem();
        $('#currentTab').checked = true;
    });
    $('#cancel').addEventListener('click', function () {
        deselectItem();
        $('#currentTab').checked = true;
    });

    // Event Listeners for Dialogs
    $('#moveUp').addEventListener('click', function () {
        var item = getSelectedItem();
        currentItems.insertBefore(item, item.previousElementSibling);
    });
    $('#moveDown').addEventListener('click', function () {
        var item = getSelectedItem();
        currentItems.insertBefore(item.nextElementSibling, item);
    });
    $('#edit').addEventListener('click', function (ev) {
        $('textarea').value = getItemText( getSelectedItem() );
        $('#newOrEditTab').checked = true;
        ev.stopPropagation();
    });
    $('#complete').addEventListener('click', function () {
        completedItems.insertBefore(getSelectedItem(), completedItems.lastElementChild);
    });
    $('#reactivate').addEventListener('click', function () {
        currentItems.insertBefore(getSelectedItem(), currentItems.lastElementChild);
    });
    $('#delete').addEventListener('click', function () {
        completedItems.removeChild( getSelectedItem() );
    });
    // Delegated Event Listeners after closing the dialogs
    $('#currentItemsDialog').addEventListener('click', deselectItem);
    $('#completedItemsDialog').addEventListener('click', deselectItem);
})();