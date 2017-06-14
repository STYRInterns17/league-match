"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserPreferences_1 = require("../../../../common/UserPreferences");
var User_1 = require("../../../../common/User");
var DBManager_1 = require("../db/DBManager");
var NotificationController_1 = require("./NotificationController");
var MapManager_1 = require("../db/MapManager");
/**
 * Created by STYR-Curt on 6/6/2017.
 */
var UserController = (function () {
    function UserController() {
    }
    //Create a new user
    UserController.create = function (pref, email) {
        //DBManager add user to db
        DBManager_1.DBManager.appendItemToTable(this.TABLE, new User_1.User(pref, email)).then(function (user) {
            // Create a notification list for the new user
            NotificationController_1.NotificationController.create();
            // Add User email to map
            MapManager_1.MapManager.createItem('emails', user.email, user.id);
            //Return success y/n
            console.log('true');
            return true;
        }).catch(function (reason) {
            return false;
        });
    };
    //Get user by Id
    UserController.get = function (userId) {
        var _this = this;
        //DBManager get user from db
        var p = new Promise(function (resolve, reject) {
            DBManager_1.DBManager.getItemFromTable(_this.TABLE, userId).then(function (user) {
                resolve(user);
            });
        });
        return p;
    };
    // id, which user to update. newPref, the new preferences
    UserController.updatePreferences = function (userId, newPref) {
        var _this = this;
        //DBManager get user, update user preferences
        this.get(userId).then(function (user) {
            user.pref = newPref;
            DBManager_1.DBManager.updateItem(_this.TABLE, user);
        });
        return true;
    };
    UserController.getPreferences = function (userid) {
        //DBManager get user
        //return preferences of user, not whole user
        return new UserPreferences_1.UserPreferences('curt@styr.com', 'passcode', 'I like to fly kites', 1);
    };
    UserController.validate = function (email, password) {
        //DBManager search through users, find matching email
        //If password === password, return true;
        //else return false;
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (MapManager_1.MapManager.doesItemExist('emails', email)) {
                MapManager_1.MapManager.getItemId('emails', email).then(function (id) {
                    if (password === _this.getPreferences(id).password) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
            }
            else {
                resolve(false);
            }
        });
        //DBManager.getItemFromTable(this.TABLE, 0);
    };
    UserController.getAssociations = function (userId, mask) {
        //DBManager get all leagues this users is part of
        //Return list of users in those leagues which match the alphabetic mask
        //List of user Ids
        return [];
    };
    UserController.sendEmailInvite = function (email, leagueId) {
        //Use magic to send an email to the email address
        //DBManager create user with that email which is invited to the league with Id ^
    };
    return UserController;
}());
UserController.TABLE = 'Users';
exports.UserController = UserController;
