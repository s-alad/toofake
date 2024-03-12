import User from "./user";

class Realmoji {
    owner: User;

    emoji: string;
    emoji_id: string;
    type: string;
    uri: string;

    constructor(owner: User, emoji: string, emoji_id: string, type: string, uri: string) {
        this.owner = owner;
        this.emoji = emoji;
        this.emoji_id = emoji_id;
        this.type = type;
        this.uri = uri;
    }

    static create(raw: any) {

        let owner = User.create(raw.user);

        let emoji = raw.emoji;
        let emoji_id = raw.id;
        let type = raw.type;
        let uri = raw.uri;

        return new Realmoji(owner, emoji, emoji_id, type, uri);

    }

    static moment(raw: any) {
        let owner = User.create(raw.user);

        let emoji = raw.emoji;
        let emoji_id = raw.id;
        let type = raw.type;
        let uri = raw.media.url;

        return new Realmoji(owner, emoji, emoji_id, type, uri);
    }

}

export default Realmoji;