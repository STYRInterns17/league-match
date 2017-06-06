/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class ActivityController {

    //Added another data point to acitivity history
    public static appendHistory(userId: number, activityValue: number): boolean {
        //DBManager activity table at userId push another point to the array

        //If at max size dump oldest value

        return true;
    }

    //Get a user's activity history
    public static getHistory(userId: number, startDate: Date, endDate:Date): number[] {
        //DBManager activity table at userId

        //Return subset of array between start and end dates
        return [];
    }
}