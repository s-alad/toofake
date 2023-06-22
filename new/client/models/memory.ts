class Memory {
    memid: string;
    primary: string;
    secondary: string;
    thumbnail: string;
    date: string;
    location: { latitude: number, longitude: number } | undefined;

    constructor(
        memid: string, primary: string, secondary: string, thumbnail: string, date: string, 
        location: { latitude: number, longitude: number } | undefined
    ) {
        this.memid = memid;
        this.primary = primary;
        this.secondary = secondary;
        this.thumbnail = thumbnail;
        this.date = date;
        this.location = location;
    }


    static async create(raw: any) {
        let memid = raw.id;
        let primary = raw.primary.url;
        let secondary = raw.secondary.url;
        let thumbnail = raw.thumbnail.url;
        let date = raw.memoryDay;
        let location = raw.location != undefined ? { 
            latitude: raw.location.latitude as number, 
            longitude: raw.location.longitude as number
        } : undefined;

        return new Memory(memid, primary, secondary, thumbnail, date, location);
    }
}

export default Memory;