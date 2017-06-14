import {DBManager} from "./DBManager";
/**
 * Created by STYR-Curt on 6/12/2017.
 */
export class MapManager {

    private static fs = require('fs');
    private static PATH = 'maps/';

    private static MAPS = ['emails'];

    public static init() {
        //Check if directory exists
        // If false, create General directory
        // Create Map directory

        // Validate that all tables that should exist
        // If not create them
        console.log('Map Init');
        try {
            this.fs.accessSync(this.PATH);
        } catch (e) {
            this.fs.mkdir(this.PATH);
            console.log(this.PATH + ' created');
        }


        for (var i: number = 0; i < this.MAPS.length; i++) {

            try {
                this.fs.accessSync(this.PATH + this.MAPS[i] + '/');
            } catch (e) {
                console.log('Map did not exist');
                //If table does not exist, create new table aka folder
                this.createMap(this.MAPS[i]);
            }

        }
        console.log('Map Init complete');
    }

    public static createMap(name: string) {
        // Mkdir with MapName
        console.log('Trying to make table');
        this.fs.mkdir(this.PATH + name + '/', (err2) => {
            if (err2) {
                return console.error(err2);
            }
            console.log("Creating map: " + name);
        });
    }

    public static getItemId(map: string, itemName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.fs.readFile(this.PATH + map + '/' + itemName + '.json', (err, data) => {
                if (err) {
                    reject('Item may not exist in ' + map);
                } else {
                    console.log('found');
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    // Creating an item in a map that already exists will overwrite the current item
    public static createItem(map: string, itemName: string, itemId: number): Promise<Number> {
        return new Promise((resolve, reject) => {
            this.fs.writeFile(this.PATH + map + '/' + itemName + '.json', JSON.stringify({id: itemId}), (err) => {
                if (err) {
                    reject(console.error(err));
                    return;
                } else {
                    // Was Succesfull
                    resolve(itemId)
                }
            });
        });
    }

    public static doesItemExist(map: string, itemName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getItemId(map, itemName).then(value => {
                resolve(true);
            }).catch(reason => {
                console.log(reason);
                resolve(false);
            });
        });
    }

    public static removeItem(map: string, itemName): Promise<any> {
        return new Promise((resolve, reject) => {
            this.fs.unlink(this.PATH + map + '/' + itemName + '.json', (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static changeItemKey(map: string, itemName: string, newItemName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getItemId(map, itemName).then(idObj => {
                this.removeItem(map, itemName);
                this.createItem(map, newItemName, idObj.id);
                resolve(true);
            }).catch(reason => {
                resolve(false);
            });
        });

    }
}