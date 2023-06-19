
import User from './user';
import Realmoji from './realmoji';
import axios from 'axios';


class Instance {
    user: User;

    realmojis: Realmoji[];

    location: string;

    caption: string;
    instanceid: string;
    primary: string;
    secondary: string;

    // make a constructor
    constructor(user: User, realmojis: Realmoji[], location: string, caption: string, instanceid: string, primary: string, secondary: string) {
        this.user = user;
        this.realmojis = realmojis;
        this.location = location;
        this.caption = caption;
        this.instanceid = instanceid;
        this.primary = primary;
        this.secondary = secondary;
    }


    // static method to create instances
    static async create(raw: any) {
        console.log("CREATION")
        console.log(raw);
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

        let initial_location = ""
        if (raw.location) {
            let lat = raw.location._latitude;   
            let long = raw.location._longitude;

            let response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&zoom=15&format=jsonv2`
            )
            console.log(response.data);
            initial_location = response.data.display_name.split(",")[0] + ", " + response.data.display_name.split(",")[1];

        }
        let location = initial_location

        return new Instance(user, realmojis, location, caption, instanceid, primary, secondary);
    }
}

export default Instance;