"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by STYR-Curt on 6/6/2017.
 */
var UserPreferences = (function () {
    function UserPreferences(password, bio, avatarId) {
        this.password = password;
        this.bio = bio;
        this.avatarId = avatarId;
    }
    return UserPreferences;
}());
exports.UserPreferences = UserPreferences;
