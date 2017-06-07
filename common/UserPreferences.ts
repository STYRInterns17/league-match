/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class UserPreferences {
    public email: string;
    public password: string;
    public bio: string;
    public avatarId: number;
    constructor(email: string, password: string, bio: string, avatarId: number) {
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.avatarId = avatarId;
    }
}