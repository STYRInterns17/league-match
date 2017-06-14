"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TableMetaData_1 = require("./utility/TableMetaData");
/**
 * Created by STYR-Curt on 6/6/2017.
 */
//This class will handle reading and writing from files
var DBManager = (function () {
    function DBManager() {
    }
    DBManager.init = function () {
        // Validate that all tables that should exist do exist
        // If not create them
        console.log('DB Init');
        //If PATH folder does not exist create it
        try {
            this.fs.accessSync(this.PATH);
        }
        catch (e) {
            this.fs.mkdir(this.PATH);
            console.log(this.PATH + ' created');
        }
        ;
        for (var i = 0; i < this.TABLES.length; i++) {
            try {
                this.fs.accessSync(this.PATH + this.TABLES[i] + '/');
            }
            catch (e) {
                console.log('File did not exist');
                //If table does not exist, create new table aka folder
                this.createTable(this.TABLES[i]);
                //Create meta data for table
                this.writeTableMetaData(this.TABLES[i], new TableMetaData_1.TableMetaData());
            }
        }
        console.log('DB Init complete');
    };
    DBManager.createTable = function (name) {
        console.log('Trying to make table');
        this.fs.mkdir(this.PATH + name + '/', function (err2) {
            if (err2) {
                return console.error(err2);
            }
            console.log("Creating table: " + name);
        });
        this.fs.writeFile(this.PATH + name + '/' + '0.json', JSON.stringify([]), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Creating first item: " + name + '/' + '0.json');
        });
    };
    DBManager.getItemFromTable = function (table, itemId) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            resolve(_this.getItemFromPage(table, itemId));
        });
        return p;
    };
    DBManager.emailHashMap = function (table, itemId) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var HashMap = (function () {
                function HashMap() {
                    this.buckets = {};
                    //this.buckets = {};
                }
                HashMap.prototype.put = function (key, value) {
                    var hashCode = key.hashCode();
                    var bucket = this.buckets[hashCode];
                    if (!bucket) {
                        bucket = new Array();
                        this.buckets[hashCode] = bucket;
                    }
                    for (var i = 0; i < bucket.length; ++i) {
                        if (bucket[i].key.equals(key)) {
                            bucket[i].value = value;
                            return;
                        }
                    }
                    bucket.push({ key: key, value: value });
                };
                HashMap.prototype.get = function (key) {
                    var hashCode = key.hashCode();
                    var bucket = this.buckets[hashCode];
                    if (!bucket) {
                        return null;
                    }
                    for (var i = 0; i < bucket.length; ++i) {
                        if (bucket[i].key.equals(key)) {
                            return bucket[i].value;
                        }
                    }
                };
                HashMap.prototype.keys = function () {
                    var keys = new Array();
                    for (var hashKey in this.buckets) {
                        var bucket = this.buckets[hashKey];
                        for (var i = 0; i < bucket.length; ++i) {
                            keys.push(bucket[i].key);
                        }
                    }
                    return keys;
                };
                HashMap.prototype.values = function () {
                    var values = new Array();
                    for (var hashKey in this.buckets) {
                        var bucket = this.buckets[hashKey];
                        for (var i = 0; i < bucket.length; ++i) {
                            values.push(bucket[i].value);
                        }
                    }
                    return values;
                };
                return HashMap;
            }());
            // interface IDictionary
            // {
            //     add(key: string, value: any): void;
            //     remove(key: string): void;
            //     containsKey(key: string): Boolean;
            //     keys(): string[];
            //     values(): any[];
            // }
            //
            // class Dictionary {
            //     _keys: string[];
            //     _values: any[];
            //
            //     constructor(init: { key: string; value: any;}[]){
            //
            //         for (let i = 0; i < init.length; i++){
            //             this[init[i].key] = init[i].value;
            //             this._keys.push(init[i].key);
            //             this._values.push(init[i].value);
            //         }
            //     }
            //
            //     add(key: string, value: any){
            //         this[key] = value;
            //         this._keys.push(key);
            //         this._values.push(value);
            //     }
            //
            //     remove(key: string){
            //         let index = this._keys.indexOf(key, 0);
            //         this._keys.splice(index, 1);
            //         this._values.splice(index, 1);
            //
            //         delete this[key];
            //     }
            //
            //     keys(): string[] {
            //         return this._keys;
            //     }
            //
            //     values(): any[] {
            //         return this._values;
            //     }
            //
            //     containsKey(key: string){
            //         if (typeof this[key] === "undefined") {
            //             return false;
            //         } return true;
            //     }
            //
            //     toLookup(): IDictionary {
            //         return this;
            //     }
            // }
            //
            // interface userEmail {
            //     email: string;
            //
            // }
            //
            // interface userEmailDictionary extends IDictionary {
            //      [index: string]: userEmail;
            //      values(): string;
            // }
            //
            // class EmailDictionary extends Dictionary{
            //     constructor(init: { key: string; value: userEmail;}[]){
            //         super(init);
            //     }
            //
            //     values(): userEmail[]{
            //         return this._values;
            //     }
            //
            //     toLookup(): userEmailDictionary{
            //         return this;
            //     }
            // }
            resolve(_this.emailHashMap(table, itemId));
        });
        return p;
    };
    DBManager.getItemFromPage = function (table, itemId) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            _this.getPage(table, _this.getPageNumOfId(itemId)).then(function (page) {
                resolve(page[_this.getItemIndexOfId(itemId)]);
            });
        });
        return p;
    };
    DBManager.appendItemToTable = function (table, item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.incrementTableItemsInLastPage(table).then(function (metaData) {
                _this.getPage(table, metaData.pageCount).then(function (pageData) {
                    // - 1 is because if there is one item in the page we need index 0
                    item.id = metaData.pageCount * _this.PAGESIZE + metaData.itemsInLastPage - 1;
                    pageData.push(item);
                    _this.writeToPage(table, metaData.pageCount, pageData);
                    resolve(item);
                });
            });
        });
    };
    //Get entire page,
    //[User at id index] = User
    //Write back page
    DBManager.updateItem = function (table, item) {
        var _this = this;
        this.getPage(table, this.getPageNumOfId(item.id)).then(function (pageData) {
            pageData[_this.getItemIndexOfId(item.id)] = item;
            _this.writeToPage(table, _this.getPageNumOfId(item.id), pageData);
        });
    };
    //Will replace an item with an empty object just containing its orginal id
    //Once created the id can not be reused but the data can be cleaned up to quicken
    //File read and write times
    DBManager.voidItem = function (table, item) {
        var _this = this;
        this.getPage(table, this.getPageNumOfId(item.id)).then(function (pageData) {
            pageData[_this.getItemIndexOfId(item.id)] = { id: item.id };
            _this.writeToPage(table, _this.getPageNumOfId(item.id), pageData);
        });
    };
    DBManager.getPage = function (table, pageNum) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            //console.log(this.PATH + table + '/' + pageNum + '.json');
            _this.fs.readFile(_this.PATH + table + '/' + pageNum + '.json', function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(data));
            });
        });
        return p;
    };
    DBManager.getTableById = function (tableId) {
        return this.TABLES[tableId];
    };
    DBManager.incrementTablePageCount = function (table) {
        var _this = this;
        this.getTableMetaData(table).then(function (metaData) {
            // Increment Page Count
            metaData.pageCount++;
            _this.writeTableMetaData(table, metaData);
        });
    };
    DBManager.getTableMetaData = function (table) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            console.log(_this.PATH + table + '/' + 'meta.json');
            // Get current meta data
            _this.fs.readFile(_this.PATH + table + '/' + 'meta.json', function (err, data) {
                var tableMetaData;
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                console.log('HEREj');
                console.log(data);
                tableMetaData = JSON.parse(data);
                console.log('Got parsed');
                console.log(tableMetaData);
                resolve(tableMetaData);
            });
        });
        return p;
    };
    DBManager.writeTableMetaData = function (table, metaData) {
        // Save updated meta data
        this.fs.writeFile(this.PATH + table + '/' + 'meta.json', JSON.stringify(metaData), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    };
    DBManager.incrementTableItemsInLastPage = function (table) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            _this.getTableMetaData(table).then(function (metaData) {
                // Increment Page Count
                if (metaData.itemsInLastPage + 1 > _this.PAGESIZE) {
                    // If last page is full, increment total page counter and reset objects in last page counter
                    _this.incrementTablePageCount(table);
                    metaData.itemsInLastPage = 1;
                }
                else {
                    // If last page is not full, increment objects in last page counter
                    metaData.itemsInLastPage++;
                }
                _this.writeTableMetaData(table, metaData);
                resolve(metaData);
            });
        });
        return p;
    };
    DBManager.writeToPage = function (table, pageNum, data) {
        this.fs.writeFile(this.PATH + table + '/' + pageNum + '.json', JSON.stringify(data), function (err) {
            if (err) {
                return console.error(err);
            }
        });
    };
    DBManager.getPageNumOfId = function (itemId) {
        //ex. Id 235 = Page 2, index 35
        //ex. Id 5434 = Page 54, index 34
        return Math.floor(itemId / this.PAGESIZE);
    };
    DBManager.getItemIndexOfId = function (itemId) {
        //ex. Id 235 = Page 2, index 35
        //ex. Id 5434 = Page 54, index 34
        return itemId % this.PAGESIZE;
    };
    DBManager.getNextOpenId = function (table) {
        var metaData = this.getTableMetaData(table);
    };
    return DBManager;
}());
//the database is the folder data
//the folders within that are each a seperate table
//within a table is sequential files which are named 'pageNumber'.data
//each page contains an array of objects with a max size of PAGESIZE
/*
 Notes on FS

 fs.writeFile will create the file if it does not exist
 however fs.writeFile can not create directories

 fs.readFile will giveback the contents of a file asyncly

 this will make directories for you but only one at a time.
 for example if tmp did not exist already this would error out,
 you must first make tmp, then tmp/test

 fs.mkdir('/tmp/test',function(err){
 if (err) {
 return console.error(err);
 }
 console.log("Directory created successfully!");
 });


 */
DBManager.PAGESIZE = 100;
DBManager.PATH = 'data/';
DBManager.TABLES = ['Users', 'Leagues', 'Activity', 'Notifications'];
DBManager.fs = require('fs');
exports.DBManager = DBManager;
