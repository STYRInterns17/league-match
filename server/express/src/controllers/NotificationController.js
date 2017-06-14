"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DBManager_1 = require("../db/DBManager");
var Notification_1 = require("../../../../common/Notification");
var NotificationList_1 = require("../../../../common/NotificationList");
/**
 * Created by STYR-Curt on 6/6/2017.
 */
var NotificationController = (function () {
    function NotificationController() {
    }
    NotificationController.create = function () {
        // Create an new notification array for a new user
        var notificationList = new NotificationList_1.NotificationList;
        var welcomeNotification = new Notification_1.Notification('Welcome to AmLeagues!', 'AmLeagues', 'AmLeagues the League');
        notificationList.list.push(welcomeNotification);
        DBManager_1.DBManager.appendItemToTable(this.TABLE, notificationList);
    };
    //Send Notification to a League
    NotificationController.sendNotificationToLeague = function (message, leagueId, submitterName) {
        //Get all users in a league
        //Send the same notification to all those users
        //DBManager write to notification table
        return true;
    };
    //Send Notification to a User
    NotificationController.sendNotificationToUser = function (message, userId, submitterName, submitterLeague) {
        var _this = this;
        //Write to notification table at userId
        this.getNotifications(userId).then(function (notificationList) {
            var notification = new Notification_1.Notification(message, submitterName, submitterLeague);
            notificationList.list.push(notification);
            DBManager_1.DBManager.updateItem(_this.TABLE, notificationList);
        });
        return true;
    };
    //Get all of a Users pending notifications
    NotificationController.getNotifications = function (userId) {
        var _this = this;
        //Return DBManager get pendingNotifications at in Notification Table at userId
        var p = new Promise(function (resolve, reject) {
            DBManager_1.DBManager.getItemFromTable(_this.TABLE, userId).then(function (notificationList) {
                resolve(notificationList);
            });
        });
        return p;
    };
    //Removes a particular notification from a user's pending list
    NotificationController.dismissNotification = function (userId, notificationId) {
        //DBManager go to notification table at userId
        //Remove notification by notificationId
        //return success
        var _this = this;
        this.getNotifications(userId).then(function (notificationList) {
            notificationList.list.splice(notificationId, 1);
            DBManager_1.DBManager.updateItem(_this.TABLE, notificationList);
        });
        return true;
    };
    NotificationController.readAllNotifications = function (userId) {
        var _this = this;
        // DBManager get list of notifications
        // Mark all notifications as read
        // return success
        this.getNotifications(userId).then(function (notificationList) {
            for (var i = 0; i < notificationList.list.length; i++) {
                notificationList.list[i].read = true;
            }
            DBManager_1.DBManager.updateItem(_this.TABLE, notificationList);
        });
        return true;
    };
    return NotificationController;
}());
NotificationController.TABLE = 'Notifications';
exports.NotificationController = NotificationController;
