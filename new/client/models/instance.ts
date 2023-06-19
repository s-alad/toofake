
import User from './user';
import Realmoji from './realmoji';

class Instance {
    user: User;

    realmojis: Realmoji[];

    caption: string;
    instanceid: string;
    primary: string;
    secondary: string;

    // make a constructor
    constructor(user: User, realmojis: Realmoji[], caption: string, instanceid: string, primary: string, secondary: string) {
        this.user = user;
        this.realmojis = realmojis;
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

        let raw_realmojis = raw.realMojis;
        let realmojis: Realmoji[] = [];
        for (let raw_moji of raw_realmojis) {
            realmojis.push(Realmoji.create(raw_moji));
        }

        return new Instance(user, realmojis, caption, instanceid, primary, secondary);
    }
}

export default Instance;