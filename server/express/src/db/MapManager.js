"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by STYR-Curt on 6/12/2017.
 */
var MapManager = (function () {
    function MapManager() {
    }
    MapManager.init = function () {
        //Check if directory exists
        // If false, create General directory
        // Create Map directory
        // Validate that all tables that should exist
        // If not create them
        console.log('Map Init');
        try {
            this.fs.accessSync(this.PATH);
        }
        catch (e) {
            this.fs.mkdir(this.PATH);
            console.log(this.PATH + ' created');
        }
        for (var i = 0; i < this.MAPS.length; i++) {
            try {
                this.fs.accessSync(this.PATH + this.MAPS[i] + '/');
            }
            catch (e) {
                console.log('Map did not exist');
                //If table does not exist, create new table aka folder
                this.createMap(this.MAPS[i]);
            }
        }
        console.log('Map Init complete');
    };
    MapManager.createMap = function (name) {
        // Mkdir with MapName
        console.log('Trying to make table');
        this.fs.mkdir(this.PATH + name + '/', function (err2) {
            if (err2) {
                return console.error(err2);
            }
            console.log("Creating map: " + name);
        });
    };
    MapManager.getItemId = function (map, itemName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.fs.readFile(_this.PATH + map + '/' + itemName + '.json', function (err, data) {
                if (err) {
                    reject('Item may not exist in ' + map);
                }
                else {
                    console.log('found');
                    resolve(JSON.parse(data));
                }
            });
        });
    };
    // Creating an item in a map that already exists will overwrite the current item
    MapManager.createItem = function (map, itemName, itemId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.fs.writeFile(_this.PATH + map + '/' + itemName + '.json', JSON.stringify({ id: itemId }), function (err) {
                if (err) {
                    reject(console.error(err));
                    return;
                }
                else {
                    // Was Succesfull
                    resolve(itemId);
                }
            });
        });
    };
    MapManager.doesItemExist = function (map, itemName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getItemId(map, itemName).then(function (value) {
                resolve(true);
            }).catch(function (reason) {
                resolve(false);
            });
        });
    };
    MapManager.removeItem = function (map, itemName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.fs.unlink(_this.PATH + map + '/' + itemName + '.json', function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    MapManager.changeItemKey = function (map, itemName, newItemName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getItemId(map, itemName).then(function (idObj) {
                _this.removeItem(map, itemName);
                _this.createItem(map, newItemName, idObj.id);
                resolve(true);
            }).catch(function (reason) {
                resolve(false);
            });
        });
    };
    return MapManager;
}());
MapManager.fs = require('fs');
MapManager.PATH = 'maps/';
MapManager.MAPS = ['emails'];
exports.MapManager = MapManager;
