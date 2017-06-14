"use strict";
/**
 * Created by Nikola Uzelac on 6/6/2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tabris = require("tabris");
var BasePage = (function () {
    function BasePage() {
        this.page = new tabris.Page({
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        });
        this.page.background = '#37474f';
    }
    return BasePage;
}());
exports.BasePage = BasePage;
