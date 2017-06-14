"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Notification_1 = require("./Notification");
/**
 * Created by STYR-Curt on 6/7/2017.
 */
var NotificationList = (function () {
    function NotificationList() {
        this.list = [];
        this.list.push(new Notification_1.Notification('Welcome to AmLeagues!', 'AmLeagues', 'AmLeagues the League'));
    }
    return NotificationList;
}());
exports.NotificationList = NotificationList;
