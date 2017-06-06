
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class User {
    //Unique identifier for the user for db look up
    public id: number;
    //Date the user was created, can not be changed
    public joinDate: Date;
    //List of leagues
    public leagues: number[];
    //The current MMR of the player in the same index as leagues array
    public mmr: number[];


}