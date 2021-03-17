(function () {
    'use strict';

    var CURRENT = 'current';
    var COMPLETED = 'completed';
    var LIST_NAMES = [CURRENT, COMPLETED];

    /**
     * Creates a new Model instance, attaches the pubSub reference
     * and defines current and completed items arrays structure
     *
     * @constructor
     * @param {object} pubSub - Reference to the pubSub object
     */
    var Model = function (pubSub) {
        this.pubSub = pubSub;
        this[CURRENT] = [];
        this[COMPLETED] = [];
    };

    /**
     * Notifies view for a change in a list
     *
     * @param {string} listName - Name of list that was changed
     */
    Model.prototype.notify = function (listName) {
        this.pubSub.publish('listUpdated', {
            listName: listName,
            listItems: this[listName]
        });
    };

    /**
     * Initialize model by loading items from localStorage
     */
    Model.prototype.init = function () {
        LIST_NAMES.forEach(function (listName) {
            var items = JSON.parse( localStorage.getItem(listName) );
            if ( items && items.length > 0 ) {
                this[listName] = items;
                this.notify(listName);
            }
        }, this);
    };

    /**
     * Saves list contents to localStorage and notifies
     *
     * @param {string} listName - Name of list to be saved
     */
    Model.prototype.saveList = function (listName) {
        localStorage.setItem(listName, JSON.stringify(this[listName]));
        this.notify(listName);
    };

    /**
     * Creates a new item.
     * Item creation is only allowed in 'current' list
     *
     * @param {string} theText - Contents of new item
     */
    Model.prototype.createItem = function (theText) {
        var index = this[CURRENT].length;
        this[CURRENT].push('');
        this.setItemText(index, theText);
    };

    /**
     * Swaps two items.
     * Item swap is only allowed in 'current' list
     *
     * @param {number} index1 - First item index
     * @param {number} index2 - Second item index
     */
    Model.prototype.swapItems = function (index1, index2) {
        var tmp = this[CURRENT][index1];
        this[CURRENT][index1] = this[CURRENT][index2];
        this[CURRENT][index2] = tmp;
        this.saveList(CURRENT);
    };

    /**
     * Deletes an existing item
     * Item deletion is only allowed in 'completed' list
     *
     * @param {number} index - Index number of item to be deleted
     */
    Model.prototype.deleteItem = function (index) {
        this[COMPLETED].splice(index, 1);
        this.saveList(COMPLETED);
    };

    /**
     * Moves an item across lists
     *
     * @param {number} index - Index number of item to be moved
     * @param {isCurrent} boolean - True: item is current so move to completed,
     * False: item is completed so move to current
     */
    Model.prototype.switchItem = function (index, isCurrent) {
        var fromList = ( isCurrent ) ? CURRENT : COMPLETED;
        var toList = ( isCurrent ) ? COMPLETED : CURRENT;
        this[toList].push(this[fromList].splice(index, 1)[0]);
        this.saveList(CURRENT);
        this.saveList(COMPLETED);
    };

    /**
     * Changes an item's contents
     * Items' contents changes are only allowed in 'current' list
     * Care is taken for special characters
     *
     * @param {number} index - Index number of item to be changed
     * @param {string} theText - Text to be inserted as item's contents
     */
    Model.prototype.setItemText = function (index, theText) {
        this[CURRENT][index] = theText.replace(/&/g, '&amp;').replace(/</g, '&lt;').
            replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
        this.saveList(CURRENT);
    };

    /**
     * Reads an item's contents
     * Items' contents reading is only allowed in 'current' list
     * Care is taken for special characters
     *
     * @param {number} index - Index number of item to be read
     * @returns {string}
     */
    Model.prototype.getItemText = function (index) {
        return this[CURRENT][index].replace(/&amp;/g, '&').replace(/&lt;/g, '<').
            replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, '\'');
    };

    myApp.Model = Model;
})();