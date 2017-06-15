/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class UserPreferences {
    public password: string;
    public bio: string;
    public avatarId: number;
    public name: string;
    constructor(password: string, bio: string, avatarId: number, name: string) {
        this.password = password;
        this.bio = bio;
        this.avatarId = avatarId;
        this.name = name;
    }
}