import User from "./user";

class Friend extends User {
    status: string;
    fullname: string;

    constructor(username: string, pfp: string, uid: string, status: string, fullname: string) {
        super(username, pfp, uid);
        this.status = status;
        this.fullname = fullname;
    }

    static create(rawuser: any) {
        let username = rawuser.username;
        let pfp = rawuser.profilePicture == undefined ? "" : rawuser.profilePicture.url; 
        let uid = rawuser.id;
        let status = rawuser.status;
        let fullname = rawuser.fullname;

        return new Friend(username, pfp, uid, status, fullname);
    }
}

export default Friend;