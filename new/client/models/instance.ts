
class Instance {
    username: string;
    caption: string;
    id: string;
    primary: string;
    secondary: string;

    // make a constructor
    constructor(username: string, caption: string, id: string, primary: string, secondary: string) {
        this.username = username;
        this.caption = caption;
        this.id = id;
        this.primary = primary;
        this.secondary = secondary;
    }


    // static method to create instances
    static create(raw: any) {
        let username = raw.userName;
        let caption = raw.caption;
        let id = raw.id;
        let primary = raw.photoURL;
        let secondary = raw.secondaryPhotoURL;
        return new Instance(username, caption, id, primary, secondary);
    }
}

export default Instance;