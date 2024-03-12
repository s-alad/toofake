
import User from './user';
import Realmoji from './realmoji';
import Comment from './comment';
import axios from 'axios';


class Instance {
    user: User;

    realmojis: Realmoji[];
    comments: Comment[];
    location: { latitude: number, longitude: number } | undefined;
    creationdate: string;
    caption: string;
    instanceid: string;
    primary: string;
    secondary: string;

    // make a constructor
    constructor(user: User, realmojis: Realmoji[], comments: Comment[], location: { latitude: number, longitude: number } | undefined, creationdate: string ,caption: string, instanceid: string, primary: string, secondary: string) {
        this.user = user;
        this.realmojis = realmojis;
        this.comments = comments;
        this.location = location;
        this.creationdate = creationdate;
        this.caption = caption;
        this.instanceid = instanceid;
        this.primary = primary;
        this.secondary = secondary;
    }

    // static method to create instances
    static async create(raw: any) {
        let user = User.create(raw.user);

        let caption = raw.caption;
        let instanceid = raw.id;
        let primary = raw.photoURL;
        let secondary = raw.secondaryPhotoURL; 
        let creationdate = new Date(raw.creationDate).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
        
        let raw_realmojis = raw.realMojis;
        let realmojis: Realmoji[] = [];
        for (let raw_moji of raw_realmojis) {
            realmojis.push(Realmoji.create(raw_moji));
        }

        let initial_location = undefined;
        if (raw.location) {
            let lat = raw.location._latitude;
            let long = raw.location._longitude;

            initial_location = { latitude: lat, longitude: long}
        }
        let location = initial_location

        let comments: Comment[] = [];
        for (let raw_comment of raw.comment) {
            comments.push(Comment.create(raw_comment));
        }

        return new Instance(user, realmojis, comments, location, creationdate, caption, instanceid, primary, secondary);
    }

    static async moment(raw: any, rawuser: any) {
        let user = User.create(rawuser);

        let caption = raw.caption;
        let instanceid = raw.id;
        let primary = raw.primary.url;
        let secondary = raw.secondary.url;
        let creationdate = 
            raw.creationDate ? new Date(raw.creationDate).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : "no date available"

        let raw_realmojis = raw.realMojis;
        let realmojis: Realmoji[] = [];
        for (let raw_moji of raw_realmojis) {
            realmojis.push(Realmoji.moment(raw_moji));
        }

        let initial_location = undefined;
        if (raw.location) {
            let lat = raw.location.latitude;
            let long = raw.location.longitude;

            initial_location = { latitude: lat, longitude: long}
        }
        let location = initial_location

        let comments: Comment[] = [];
        for (let raw_comment of raw.comments) {
            comments.push(Comment.moment(raw_comment));
        }
        return new Instance(user, realmojis, comments, location, creationdate ,caption, instanceid, primary, secondary);
    }
}

export default Instance;