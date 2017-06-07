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
        };

        for(var i: number = 0; i < this.TABLES.length; i++) {

            try {
                this.fs.accessSync(this.PATH + this.TABLES[i] + '/');
            } catch (e) {
                console.log('File did not exist');
                //If table does not exist, create new table aka folder
                this.createTable(this.TABLES[i]);
                //Create meta data for table
                this.writeTableMetaData(this.TABLES[i], new TableMetaData());
            };

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
    }


    public static getItemFromTable(table: string, itemId: number): any {
        return this.getItemFromPage(table, itemId);
    }

    private static getItemFromPage(table: string, itemId: number): any {
        let page = this.getPage(table, this.getPageNumOfId(itemId));
        return page[this.getItemIndexOfId(itemId)];
    }

    public static appendItemToTable(table: string, item: IStorable) {
        console.log('Append to table');
        let metaData: TableMetaData = this.incrementTableItemsInLastPage(table);
        console.log('Append to table2');
        let pageData: any = this.getPage(table, metaData.pageCount);
        console.log('Append to table3');
        item.id = metaData.pageCount * this.PAGESIZE + metaData.itemsInLastPage;
        console.log('Append to table4');
        pageData.push(item);

        this.writeToPage(table, metaData.pageCount, item);
    }

    private static getPage(table: string, pageNum: number): any {
        this.fs.readFile(this.PATH + table + '/' + pageNum, (err, data) => {
            if (err) {
                return console.error(err);
            }
            return JSON.parse(data);
        });
    }

    private static getTableById(tableId: number) {
        return this.TABLES[tableId];
    }

    private static incrementTablePageCount(table: string) {
        let tableMetaData: TableMetaData = this.getTableMetaData(table);

        // Increment Page Count
        tableMetaData.pageCount++;

        this.writeTableMetaData(table, tableMetaData);
    }

    private static getTableMetaData(table: string): TableMetaData {
        let tableMetaData: TableMetaData;
        console.log(this.PATH + table + '/' + 'meta.data');
        // Get current meta data
        this.fs.readFile(this.PATH + table + '/' + 'meta.data', (err, data) => {
            if (err) {
                return console.error(err);
            }
            tableMetaData = JSON.parse(data);
            console.log('Got parsed');
        });
        console.log(tableMetaData);
        return tableMetaData;
    }

    private static writeTableMetaData(table: string, metaData: TableMetaData): void {
        // Save updated meta data
        this.fs.writeFile(this.PATH + table + '/' + 'meta.data', JSON.stringify(metaData), (err) => {
            if(err) {
                return console.log(err);
            }
        });

    }

    private static incrementTableItemsInLastPage(table: string): TableMetaData {
        let tableMetaData: TableMetaData = this.getTableMetaData(table);
        console.log(tableMetaData);
        // Increment Page Count
        if(tableMetaData.itemsInLastPage + 1 > this.PAGESIZE) {
            // If last page is full, increment total page counter and reset objects in last page counter
            this.incrementTablePageCount(table);
            tableMetaData.itemsInLastPage = 1;
        } else {
            // If last page is not full, increment objects in last page counter
            tableMetaData.itemsInLastPage++;
        }

        this.writeTableMetaData(table, tableMetaData);

        return tableMetaData;
    }

    private static writeToPage(table: string, pageNum: number, data: any) {
        this.fs.writeFile(this.PATH + table + '/' + pageNum + '.data', JSON.stringify(data),  (err) => {
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