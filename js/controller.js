(function () {
    'use strict';
    
    var selectedItemIndex = -1;

    var Controller = function (model, view, pubSub) {
        this.model = model;
        this.view = view;
        this.pubSub = pubSub;
    };

    Controller.prototype.init = function () {
        this.view.init();
        this.model.init();
        this.bindEvents([
            { name: 'selectItem',    handler: this.selectItem },
            { name: 'deselectItem',  handler: this.clearSelectedItemIndex },
            { name: 'moveUp',        handler: this.moveUp },
            { name: 'moveDown',      handler: this.moveDown },
            { name: 'complete',      handler: this.complete },
            { name: 'reactivate',    handler: this.reactivate },
            { name: 'delete',        handler: this.delete },
            { name: 'edit',          handler: this.edit },
            { name: 'finishEdit',    handler: this.finishEdit },
            { name: 'cancelEdit',    handler: this.cancelEdit },
            { name: 'closeDialog',   handler: this.closeDialog }
        ]);
    };

    Controller.prototype.bindEvents = function (eventsArray) {
        eventsArray.forEach(function (event) {
            this.pubSub.subscribe(event.name, event.handler.bind(this));
        }, this);
    };

    Controller.prototype.clearSelectedItemIndex = function () {
        selectedItemIndex = -1;
    };

    Controller.prototype.selectItem = function (id) {
        selectedItemIndex = parseInt( id );
    };

    Controller.prototype.moveUp = function () {
        this.model.swapItems(selectedItemIndex-1, selectedItemIndex);
        this.closeDialog();
    };

    Controller.prototype.moveDown = function () {
        this.model.swapItems(selectedItemIndex, selectedItemIndex+1);
        this.closeDialog();
    };

    Controller.prototype.complete = function () {
        this.model.switchItem(selectedItemIndex, true);
        this.closeDialog();
    };

    Controller.prototype.reactivate = function () {
        this.model.switchItem(selectedItemIndex, false);
        this.closeDialog();
    };

    Controller.prototype.delete = function () {
        this.model.deleteItem(selectedItemIndex);
        this.closeDialog();
    };

    Controller.prototype.edit = function () {
        this.closeDialog(true);
        this.view.showEditTab( this.model.getItemText(selectedItemIndex) );
    };

    Controller.prototype.finishEdit = function () {
        if ( selectedItemIndex === -1 ) {
            this.model.createItem( this.view.getTextarea() );
        } else {
            this.model.setItemText( selectedItemIndex, this.view.getTextarea() );
        }
        this.cancelEdit();
    };

    Controller.prototype.cancelEdit = function () {
        this.clearSelectedItemIndex();
        this.view.showDefaultTab();
    };

    Controller.prototype.closeDialog = function (keepSelected) {
        if ( !keepSelected ) {
            this.clearSelectedItemIndex();
        }
        this.view.clearSelectedItem();
    };

    myApp.Controller = Controller;
    
})();