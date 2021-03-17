(function () {
    'use strict';

    // Shortcut function
    function $(str) {
        if ( str.charAt(0) === '#' ) {
            return document.getElementById(str.substring(1));
        }
        return document.querySelector(str);
    }

    var View = function (pubSub) {
        this.pubSub = pubSub;
        this.current   = { items: $('#currentItems')   , dialog: $('#currentItemsDialog') };
        this.completed = { items: $('#completedItems') , dialog: $('#completedItemsDialog') };
        this.defaultTab = $('#currentTab');
        this.element = document.createElement('li');
    };

    View.prototype.init = function () {
        this.bindEvents([
            { id: 'moveUp',       event: 'moveUp'      },
            { id: 'moveDown',     event: 'moveDown'    },
            { id: 'complete',     event: 'complete'    },
            { id: 'reactivate',   event: 'reactivate'  },
            { id: 'delete',       event: 'delete'      },
            { id: 'edit',         event: 'edit'        },
            { id: 'closeDlg1',    event: 'closeDialog' },
            { id: 'closeDlg2',    event: 'closeDialog' },
            { id: 'ok',           event: 'finishEdit'  },
            { id: 'cancel',       event: 'cancelEdit'  }
        ])
        this.pubSub.subscribe('listUpdated', this.updateList.bind(this));
    };

    View.prototype.bindEvents = function (elementsArray) {
        var pubSub = this.pubSub;
        elementsArray.forEach(function (element) {
            $('#'+element.id).addEventListener('click', function () {
                pubSub.publish(element.event);
            });
        });
        $('#newOrEditTab').addEventListener('change', function () {
            $('textarea').value = '';
            pubSub.publish('deselectItem');
        });
        // Delegated Event Listeners for clicking on items
        function clickOnItemHandler(ev) {
            var item = ev.target;
            if ( item.nodeName === 'LI' && !item.classList.contains('modal') ) {
                item.setAttribute('data-selected', '');
                pubSub.publish('selectItem', item.id);
            }
        }
        this.current.items.addEventListener('click', clickOnItemHandler);
        this.completed.items.addEventListener('click', clickOnItemHandler);
    };

    View.prototype.updateList = function (listObject) {
        var list = this[listObject.listName];
        var dialog = list.items.removeChild(list.dialog);
        list.items.innerHTML = '';
        listObject.listItems.forEach(function (itemText, index) {
            var item = this.element.cloneNode();
            item.setAttribute('id', index+'-'+listObject.listName);
            item.innerHTML = itemText;
            list.items.appendChild(item);
        }, this);
        list.items.appendChild(dialog);
    };

    View.prototype.clearSelectedItem = function () {
        var item = $('li[data-selected]');
        if ( item ) {
            item.removeAttribute('data-selected');
        }
    };

    View.prototype.showDefaultTab = function () {
        this.defaultTab.checked = true;
    };

    View.prototype.showEditTab = function (text) {
        $('textarea').value = text;
        $('#newOrEditTab').checked = true;
    };

    View.prototype.getTextarea = function () {
        return $('textarea').value;
    };

    myApp.View = View;
    
})();