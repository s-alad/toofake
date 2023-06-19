class User {
    username: string;
    pfp: string;
    uid: string;

    constructor(username: string, pfp: string, uid: string) {
        this.username = username;
        this.pfp = pfp;
        this.uid = uid;
    }
}

export default User;