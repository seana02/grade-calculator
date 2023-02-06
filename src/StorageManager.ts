import { CourseGroupsData } from "./DataInterfaces";

class StorageManager {
    private static instance: StorageManager;

    private constructor() {}

    public save(data: CourseGroupsData) {
        console.log("hello");
        localStorage.setItem('data', JSON.stringify(data));
    }

    public load(): CourseGroupsData[] {
        return JSON.parse(localStorage.getItem('data') || "[]");
    }

    public static getObj() {
        if (!this.instance) {
            this.instance = new StorageManager();
        }
        return this.instance;
    }
}

export default StorageManager;
