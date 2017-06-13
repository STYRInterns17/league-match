/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class UserPreferences {
    public password: string;
    public bio: string;
    public avatarId: number;
    constructor(password: string, bio: string, avatarId: number) {
        this.password = password;
        this.bio = bio;
        this.avatarId = avatarId;
    }
}