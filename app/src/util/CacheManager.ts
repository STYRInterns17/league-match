import {User} from "../../../common/User";
/**
 * Created by STYR-Curt on 6/21/2017.
 */
export class CacheManager {
    private static getItem(key: string): string {
        return localStorage.getItem(key);
    }

    private static setItem(key: string, item: string): void {
        localStorage.setItem(key, item);

    }

    public static clearCache(): void {
        localStorage.clear();
    }

    public static getCurrentUserId(): number {
        let item = this.getItem('userId');
        if(item === null) {
            return null;
        } else {

        }
        return parseInt(item);
    }

    public static setCurrentUserId(id: number): void {
        this.setItem('userId', id.toString());
    }

    public static getCurrentUser(): User {
        let item = this.getItem('userObj');
        if(item === null) {
            return null;
        } else {
            return JSON.parse(this.getItem('userObj'));
        }

    }

    public static setCurrentUser(user: User): void {
        this.setItem('userObj', JSON.stringify(user));
    }

    public static getCurrentLeagueId(): number {
        let item = this.getItem('currentLeagueId');
        if(item === null) {
            return null;
        } else {
            return parseInt(item);
        }

    }

    public static setCurrentLeagueId(id: number): void {
        this.setItem('currentLeagueId', id.toString());
    }
}