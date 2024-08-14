import User from "./user";

class Comment {
    comment_id: number;
    text: string;
    owner: User;
    comment_time?: string;

    constructor(comment_id: number, text: string, owner: User, comment_time?: string) {
        this.comment_id = comment_id;
        this.text = text;
        this.owner = owner;
        this.comment_time = comment_time;
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
        let comment_time = this.formatTime(raw.postedAt);

        let owner = User.create(raw.user);

        return new Comment(comment_id, text, owner, comment_time);
    }

    static formatTime(postedAt: string): string {
        if (!postedAt) return "no date available";

        let postedDate = new Date(postedAt);
        let now = new Date();
        let diffInSeconds = Math.floor((now.getTime() - postedDate.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            let minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minutes ago`;
        } else {
            return postedDate.toLocaleString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                month: 'short',
                day: 'numeric'
            });
        }
    }
}

export default Comment;
