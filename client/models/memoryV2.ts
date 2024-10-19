class MemoryV2 {
    id: string;
    primary: string;
    secondary: string;
    date: string;
    time: string;

    constructor(
        id: string, primary: string, secondary: string, date: string, time: string
    ) {
        this.id = id;
        this.primary = primary;
        this.secondary = secondary;
        this.date = date;
        this.time = time;
    }


    static create(raw: any) {
        let id = raw.id;
        let primary = raw.primary.url;
        let secondary = raw.secondary.url;

        let takenAt = raw.takenAt.split("T");
        let date = takenAt[0];
        let time = takenAt[1].split(".")[0];

        return new MemoryV2(id, primary, secondary, date, time);
    }
}

export default MemoryV2;