
import User from './user';

class Instance {
    user: User;
    caption: string;
    instanceid: string;
    primary: string;
    secondary: string;

    // make a constructor
    constructor(user: User, caption: string, instanceid: string, primary: string, secondary: string) {
        this.user = user;
        this.caption = caption;
        this.instanceid = instanceid;
        this.primary = primary;
        this.secondary = secondary;
    }


    // static method to create instances
    static create(raw: any) {
        let username = raw.user.username;
        let pfp = raw.user.profilePicture.url;
        let uid = raw.user.id;

        let user = new User(username, pfp, uid);

        let caption = raw.caption;
        let instanceid = raw.id;
        let primary = raw.photoURL;
        let secondary = raw.secondaryPhotoURL;

        return new Instance(user, caption, instanceid, primary, secondary);
    }
}

export default Instance;