/**
 * Created by Nikola Uzelac on 6/6/2017.
 */

import * as tabris from "tabris";

export abstract class BasePage {
    public page: tabris.Page;

    constructor() {
        this.page = new tabris.Page({
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        });
        //this.page.background = '#37474f';
    }

    // public abstract navigationTo(): void;
    //
    // public find(selector: string) {
    //     return this.page.find(selector);
    // }
    //
    // public resolve(): any[] {
    //     return [];
    // }
    //
    // protected runResolve(): any {
    //     if (this.resolve) {
    //         let param = this.resolve();
    //         return this.resolver(param);
    //     }
    //     return false;
    // }
    //
    // private resolver(param: any[]): any {
    //     return Promise.all(<any>param).catch((err) => {
    //         console.error("Failed to resolve", err);
    //     });
    // }
}