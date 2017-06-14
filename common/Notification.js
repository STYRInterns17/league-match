"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by STYR-Curt on 6/6/2017.
 */
var Notification = (function () {
    function Notification(msg, submitterUser, submitterLeague) {
        this.message = msg;
        this.submitterUser = submitterUser;
        this.submitterLeague = submitterLeague;
        this.read = false;
    }
    return Notification;
}());
exports.Notification = Notification;
