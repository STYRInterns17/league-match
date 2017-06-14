"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by STYR-Curt on 6/6/2017.
 */
var User = (function () {
    function User(pref, email) {
        this.pref = pref;
        this.joinDate = new Date(); //This will need to be updated to account for time zones
        this.leagues = [];
        this.mmr = [];
        this.email = email;
    }
    return User;
}());
exports.User = User;
