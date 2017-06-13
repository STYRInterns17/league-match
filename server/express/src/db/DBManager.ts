import {TableMetaData} from "./utility/TableMetaData";
import {IStorable} from "../middleware/IStorable";
/**
 * Created by STYR-Curt on 6/6/2017.
 */

//This class will handle reading and writing from files
export class DBManager {

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

    private static PAGESIZE: number = 100;
    private static PATH: string = 'data/';

    private static TABLES: string[] = ['Users', 'Leagues', 'Activity', 'Notifications'];

    private static fs = require('fs');

    public static init(): void {
        // Validate that all tables that should exist do exist
        // If not create them
        console.log('DB Init');

        //If PATH folder does not exist create it
        try {
            this.fs.accessSync(this.PATH);
        } catch (e) {
            this.fs.mkdir(this.PATH);
            console.log(this.PATH + ' created');
        }
        ;

        for (var i: number = 0; i < this.TABLES.length; i++) {

            try {
                this.fs.accessSync(this.PATH + this.TABLES[i] + '/');
            } catch (e) {
                console.log('File did not exist');
                //If table does not exist, create new table aka folder
                this.createTable(this.TABLES[i]);
                //Create meta data for table
                this.writeTableMetaData(this.TABLES[i], new TableMetaData());
            }

        }
        console.log('DB Init complete');

    }


    private static createTable(name: string) {
        console.log('Trying to make table');
        this.fs.mkdir(this.PATH + name + '/', (err2) => {
            if (err2) {
                return console.error(err2);
            }
            console.log("Creating table: " + name);
        });
        this.fs.writeFile(this.PATH + name + '/' + '0.json', JSON.stringify([]), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log("Creating first item: " + name + '/' + '0.json');
        })
    }

    public static getItemFromTable(table: string, itemId: number): Promise<IStorable> {
        let p = new Promise((resolve, reject) => {
            resolve(this.getItemFromPage(table, itemId));
        });

        return p;
    }

    public static emailHashMap(table: string, itemId: number): Promise<IStorable> {

        let p = new Promise((resolve, reject) => {

            class HashMap {
                constructor() {
                    //this.buckets = {};
                }

                buckets = {};

                put(key, value) {
                    const hashCode = key.hashCode();
                    let bucket = this.buckets[hashCode];
                    if (!bucket) {
                        bucket = new Array();
                        this.buckets[hashCode] = bucket;
                    }
                    for (let i = 0; i < bucket.length; ++i) {
                        if (bucket[i].key.equals(key)) {
                            bucket[i].value = value;
                            return;
                        }
                    }
                    bucket.push({ key, value });
                }

                get(key) {
                    const hashCode = key.hashCode();
                    const bucket = this.buckets[hashCode];
                    if (!bucket) {
                        return null;
                    }
                    for (let i = 0; i < bucket.length; ++i) {
                        if (bucket[i].key.equals(key)) {
                            return bucket[i].value;
                        }
                    }
                }

                keys() {
                    const keys = new Array();
                    for (const hashKey in this.buckets) {
                        const bucket = this.buckets[hashKey];
                        for (let i = 0; i < bucket.length; ++i) {
                            keys.push(bucket[i].key);
                        }
                    }
                    return keys;
                }

                values() {
                    const values = new Array();
                    for (const hashKey in this.buckets) {
                        const bucket = this.buckets[hashKey];
                        for (let i = 0; i < bucket.length; ++i) {
                            values.push(bucket[i].value);
                        }
                    }
                    return values;
                }
            }

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

            resolve(this.emailHashMap(table, itemId));

        });

        return p;
    }

    private static getItemFromPage(table: string, itemId: number): Promise<IStorable[]> {
        let p = new Promise((resolve, reject) => {
            this.getPage(table, this.getPageNumOfId(itemId)).then((page) => {
                resolve(page[this.getItemIndexOfId(itemId)]);
            });
        });

        return p;

    }

    public static appendItemToTable(table: string, item: IStorable): Promise<User> {
        return new Promise((resolve, reject) => {
            this.incrementTableItemsInLastPage(table).then((metaData: TableMetaData) => {
                this.getPage(table, metaData.pageCount).then((pageData: IStorable[]) => {
                    // - 1 is because if there is one item in the page we need index 0
                    item.id = metaData.pageCount * this.PAGESIZE + metaData.itemsInLastPage - 1;
                    pageData.push(item);
                    this.writeToPage(table, metaData.pageCount, pageData);
                    resolve(item);
                });
            });
        });


    }

    //Get entire page,

    //[User at id index] = User
    //Write back page
    public static updateItem(table: string, item: IStorable): void {

        this.getPage(table, this.getPageNumOfId(item.id)).then((pageData: IStorable[]) => {
            pageData[this.getItemIndexOfId(item.id)] = item;
            this.writeToPage(table, this.getPageNumOfId(item.id), pageData);
        });

    }

    //Will replace an item with an empty object just containing its orginal id
    //Once created the id can not be reused but the data can be cleaned up to quicken
    //File read and write times
    
    public static voidItem(table: string, item: IStorable): void {
        this.getPage(table, this.getPageNumOfId(item.id)).then((pageData: IStorable[]) => {
            pageData[this.getItemIndexOfId(item.id)] = {id: item.id};
            this.writeToPage(table, this.getPageNumOfId(item.id), pageData);
        })
    }

    private static getPage(table: string, pageNum: number): Promise<IStorable[]> {
        let p = new Promise((resolve, reject) => {
            //console.log(this.PATH + table + '/' + pageNum + '.json');
            this.fs.readFile(this.PATH + table + '/' + pageNum + '.json', (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(data));
            });
        });

        return p;

    }

    private static getTableById(tableId: number) {
        return this.TABLES[tableId];
    }

    private static incrementTablePageCount(table: string) {
        this.getTableMetaData(table).then((metaData: TableMetaData) => {
            // Increment Page Count
            metaData.pageCount++;
            this.writeTableMetaData(table, metaData);
        });
    }

    private static getTableMetaData(table: string): Promise<TableMetaData> {
        let p = new Promise((resolve, reject) => {
            console.log(this.PATH + table + '/' + 'meta.json');
            // Get current meta data
            this.fs.readFile(this.PATH + table + '/' + 'meta.json', (err, data) => {
                let tableMetaData: TableMetaData;
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
    }

    private static writeTableMetaData(table: string, metaData: TableMetaData): void {
        // Save updated meta data
        this.fs.writeFile(this.PATH + table + '/' + 'meta.json', JSON.stringify(metaData), (err) => {
            if (err) {
                return console.log(err);
            }
        });

    }

    private static incrementTableItemsInLastPage(table: string): Promise<TableMetaData> {
        let p = new Promise((resolve, reject) => {
            this.getTableMetaData(table).then((metaData: TableMetaData) => {
                // Increment Page Count
                if (metaData.itemsInLastPage + 1 > this.PAGESIZE) {
                    // If last page is full, increment total page counter and reset objects in last page counter
                    this.incrementTablePageCount(table);
                    metaData.itemsInLastPage = 1;
                } else {
                    // If last page is not full, increment objects in last page counter
                    metaData.itemsInLastPage++;
                }

                this.writeTableMetaData(table, metaData);
                resolve(metaData);
            });

        });

        return p;


    }

    private static writeToPage(table: string, pageNum: number, data: IStorable[]) {
        this.fs.writeFile(this.PATH + table + '/' + pageNum + '.json', JSON.stringify(data), (err) => {
            if (err) {
                return console.error(err);
            }
        });
    }

    private static getPageNumOfId(itemId: number): number {

        //ex. Id 235 = Page 2, index 35
        //ex. Id 5434 = Page 54, index 34

        return Math.floor(itemId / this.PAGESIZE);
    }

    private static getItemIndexOfId(itemId: number): number {

        //ex. Id 235 = Page 2, index 35
        //ex. Id 5434 = Page 54, index 34

        return itemId % this.PAGESIZE;
    }

    public static getNextOpenId(table: string) {
        let metaData = this.getTableMetaData(table);

    }
}