class User {
    username: string;
    pfp: string;
    uid: string;

    constructor(username: string, pfp: string, uid: string) {
        this.username = username;
        this.pfp = pfp;
        this.uid = uid;
    }

    static create(rawuser: any) {
        let username = rawuser.username;
        let pfp = rawuser.profilePicture == undefined ? "" : rawuser.profilePicture.url; 
        let uid = rawuser.id;

        return new User(username, pfp, uid);
    }
}

export default User;