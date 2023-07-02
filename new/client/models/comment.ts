import User from "./user";

class Comment {
    comment_id: number;
    text: string;
    owner: User;

    constructor(comment_id: number, text: string, owner: User) {
        this.comment_id = comment_id;
        this.text = text;
        this.owner = owner;
    }

    static create(raw: any) {
        let comment_id = raw.id;
        let text = raw.text;

        let owner = User.create(raw.user);

        return new Comment(comment_id, text, owner);
    }

    static moment(raw: any) {
        let comment_id = raw.id;
        let text = raw.content;

        let owner = User.create(raw.user);

        return new Comment(comment_id, text, owner);
    }
}

export default Comment;
