
import User from './user';
import Realmoji from './realmoji';
import Comment from './comment';
import axios from 'axios';


class Instance {
    user: User;

    realmojis: Realmoji[];
    comments: Comment[];

    location: string;

    caption: string;
    instanceid: string;
    primary: string;
    secondary: string;

    // make a constructor
    constructor(user: User, realmojis: Realmoji[], comments: Comment[], location: string, caption: string, instanceid: string, primary: string, secondary: string) {
        this.user = user;
        this.realmojis = realmojis;
        this.comments = comments;
        this.location = location;
        this.caption = caption;
        this.instanceid = instanceid;
        this.primary = primary;
        this.secondary = secondary;
    }


    // static method to create instances
    static async create(raw: any) {
        /* console.log("CREATION")
        console.log(raw); */
        let user = User.create(raw.user);

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

            try {
                let response = await axios.get(
                    `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${long},${lat}&outSR=&forStorage=false&f=pjson`
                )
                console.log(response.data)
                initial_location = response.data.address.Match_addr + ", " + response.data.address.City;
            } catch (e) {
                console.log(e)
            }

            /* let response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&zoom=15&format=jsonv2`
            )
            initial_location = response.data.display_name.split(",")[0] + ", " + response.data.display_name.split(",")[1]; */

        }
        let location = initial_location

        let comments: Comment[] = [];
        for (let raw_comment of raw.comment) {
            comments.push(Comment.create(raw_comment));
        }

        return new Instance(user, realmojis, comments ,location, caption, instanceid, primary, secondary);
    }
}

export default Instance;