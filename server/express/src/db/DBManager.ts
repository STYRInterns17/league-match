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

    private static TABLES: string[] = ['Users', 'Leagues', 'Activity', 'Notifications', 'MMRHistory'];
    private static fs = require('fs');


    private static tableDataVolatile = []; // [Table[Page[IStorable]]]
    private static tableMetaDataVolatile = []; // [TableMetaData]
    private static isWritingToDisk = false;

    private static pendingWrites = [];


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


        for (let i: number = 0; i < this.TABLES.length; i++) {

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

        // Set data write loop
        setInterval(() => {
            this.isWritingToDisk = true;
            console.log('Writing to Disk');
            this.writeTablesToDisk().then(value => {
                console.log('Done writing to Disk');
                this.isWritingToDisk = false;
            })
        }, 60000);

        // Pull data from disk into memory
        this.readTablesFromDisk().then(value => {
            console.log('DB Init complete');
        });


    }

    private static writeTablesToDisk(): Promise<{}> {
        return new Promise((resolve, reject) => {
            let dbWrites: Promise<{}>[] = [];
            for (let i = 0; i < this.TABLES.length; i++) {
                let metaData = this.getVolatileTableMetaData(this.TABLES[i]);

                dbWrites.push(this.writeTableMetaData(this.TABLES[i], metaData));
                for (let pageNum = 0; pageNum <= metaData.pageCount; pageNum++) {
                    let newPageData = this.getVolatilePage(this.TABLES[i], i);
                    dbWrites.push(this.writeToPage(this.TABLES[i], i, newPageData));
                }
            }

            Promise.all(dbWrites).then(value => {
                for (let i = 0; i < this.pendingWrites.length; i++) {
                    this.pendingWrites[i]();
                }
                // Remove all pending writes from the array
                this.pendingWrites.splice(0, this.pendingWrites.length);
                resolve();
            }).catch(reason => {
                reject(reason);
            })
        });
    }

    private static readTablesFromDisk(): Promise<{}> {
        return new Promise((resolve, reject) => {
            let dbReadMetaData: Promise<TableMetaData>[] = [];
            for (let i = 0; i < this.TABLES.length; i++) {
                dbReadMetaData.push(this.getTableMetaData(this.TABLES[i]));
            }

            Promise.all(dbReadMetaData).then(metaDatas => {
                // For each table
                for (let i = 0; i < metaDatas.length; i++) {
                    this.overWriteVolatileMetaData(this.TABLES[i], metaDatas[i]);
                    console.log(metaDatas[i].pageCount);
                    // For each page in table //  <= because page numbers start at 0
                    for (let pageNum = 0; pageNum <= metaDatas[i].pageCount; pageNum++) {
                        this.getPage(this.TABLES[i], pageNum).then(page => {
                            this.overWriteVolatilePage(this.TABLES[i], pageNum, page);
                        });
                    }
                }
                console.log(this.tableDataVolatile);
                resolve();
            }).catch(reason => {
                reject(reason);
            })
        });
    }

    private static overWriteVolatilePage(table: string, pageNum: number, page: IStorable[]) {
        // while there are less uninitlized tables than there should be
        while (this.tableDataVolatile.length < this.TABLES.length) {
            this.tableDataVolatile.push([]);
        }

        // while there are less uninitlized pages than there should be
        while (this.tableDataVolatile[this.TABLES.indexOf(table)].length <= pageNum) {
            this.tableDataVolatile[this.TABLES.indexOf(table)].push([]);
        }

        this.setVolatilePage(table, pageNum, page);
    }

    private static overWriteVolatileMetaData(table: string, metaData: TableMetaData) {
        // while there are less uninitlized metadata than there should be
        while (this.tableMetaDataVolatile.length < this.TABLES.length) {
            this.tableMetaDataVolatile.push([]);
        }

        this.setVolatileTableMetaData(table, metaData);
    }

    private static getVolatileTable(table: string) {
        return this.tableDataVolatile[this.TABLES.indexOf(table)];
    }

    private static getVolatilePage(table: string, pageNum: number): IStorable[] {
        return this.getVolatileTable(table)[pageNum];
    }

    private static setVolatileTable(table: string, data: IStorable[]) {
        this.tableDataVolatile[this.TABLES.indexOf(table)] = data;
    }

    private static setVolatilePage(table: string, pageNum: number, data: IStorable[]) {
        let oldTable = this.getVolatileTable(table);
        oldTable[pageNum] = data;
        this.setVolatileTable(table, oldTable);
    }

    private static setVolatileItem(table: string, item: IStorable): IStorable {
        let oldPage = this.getVolatilePage(table, this.getPageNumOfId(item.id));
        oldPage[this.getItemIndexOfId(item.id)] = item;
        this.setVolatilePage(table, this.getPageNumOfId(item.id), oldPage);
        return item;
    }

    private static getVolatileItem(table: string, itemId: number): IStorable {
        let page = this.getVolatilePage(table, this.getPageNumOfId(itemId));
        return page[this.getItemIndexOfId(itemId)];
    }

    public static appendItemToTable(table: string, item: IStorable): Promise<IStorable> {
        return new Promise((resolve, reject) => {
            if (this.isWritingToDisk) {
                this.pendingWrites.push(() => this.appendItemToTable(table, item))
            } else {
                let metaData = this.incrementTableItemsInLastPage(table);
                let pageData = this.getVolatilePage(table, metaData.pageCount);
                // - 1 is because if there is one item in the page we need index 0
                item.id = metaData.pageCount * this.PAGESIZE + metaData.itemsInLastPage - 1;
                pageData.push(item);
                this.setVolatilePage(table, metaData.pageCount, pageData);
            }
            resolve(item);
        })


    }

    //Get entire page,
    //[User at id index] = User
    //Write back page
    public static updateItem(table: string, item: IStorable): IStorable {

        if (this.isWritingToDisk) {
            this.pendingWrites.push(() => this.updateItem(table, item))
        } else {
            return this.setVolatileItem(table, item);
        }
    }

    public static updateItems(table: string, items: IStorable[]) {
        if (this.isWritingToDisk) {
            this.pendingWrites.push(() => this.updateItems(table, items))
        } else {


        }
    }


    private static getVolatileTableMetaData(table: string): TableMetaData {
        return this.tableMetaDataVolatile[this.TABLES.indexOf(table)];
    }

    private static setVolatileTableMetaData(table: string, metaData: TableMetaData) {
        this.tableMetaDataVolatile[this.TABLES.indexOf(table)] = metaData;
    }

    private static incrementTablePageCount(table: string): TableMetaData {
        let metaData = this.getVolatileTableMetaData(table);
        // Increment Page Count
        metaData.pageCount++;
        this.setVolatileTableMetaData(table, metaData);
        return metaData;
    }

    private static incrementTableItemsInLastPage(table: string): TableMetaData {

        let metaData: TableMetaData = this.getVolatileTableMetaData(table);
        // Increment Page Count
        if (metaData.itemsInLastPage + 1 > this.PAGESIZE) {
            // If last page is full, increment total page counter and reset objects in last page counter
            this.incrementTablePageCount(table);
            metaData.itemsInLastPage = 1;
        } else {
            // If last page is not full, increment objects in last page counter
            metaData.itemsInLastPage++;
        }

        this.setVolatileTableMetaData(table, metaData);

        return metaData;
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
            resolve(this.getVolatileItem(table, itemId));
        });

        return p;
    }


    //Will replace an item with an empty object just containing its orginal id
    //Once created the id can not be reused but the data can be cleaned up to quicken
    //File read and write times

    public static voidItem(table: string, item: IStorable): void {
        let pageData = this.getVolatilePage(table, this.getPageNumOfId(item.id));
        pageData[this.getItemIndexOfId(item.id)] = {id: item.id};
        this.setVolatilePage(table, this.getPageNumOfId(item.id), pageData);
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


    private static getTableMetaData(table: string): Promise<TableMetaData> {
        let p = new Promise((resolve, reject) => {

            // Get current meta data
            this.fs.readFile(this.PATH + table + '/' + 'meta.json', (err, data) => {
                let tableMetaData: TableMetaData;
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                tableMetaData = JSON.parse(data);

                resolve(tableMetaData);
            });

        });

        return p;
    }

    private static writeTableMetaData(table: string, metaData: TableMetaData): Promise<TableMetaData> {
        return new Promise((resolve, reject) => {
            // Save updated meta data
            this.fs.writeFile(this.PATH + table + '/' + 'meta.json', JSON.stringify(metaData), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(metaData);
                }
            });
        })


    }


    private static writeToPage(table: string, pageNum: number, data: IStorable[]): Promise<IStorable[]> {
        return new Promise((resolve, reject) => {
            this.fs.writeFile(this.PATH + table + '/' + pageNum + '.json', JSON.stringify(data), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })

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


}





