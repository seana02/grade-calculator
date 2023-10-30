import Course, { regenerateCourse } from "./Course";

export default class Semester {
    private _name: string;
    private _courses: Course[];

    constructor(name: string, courses: Course[]) {
        this._name = name;
        this._courses = courses;
    }

    toJSON() {
        let courses: string[] = [];
        this._courses.forEach(c => courses.push(JSON.stringify(c)));
        return {
            name: this._name,
            courses: courses
        };
    }

    getCourse(courseID: number): Course {
        return this._courses[courseID];
    }

    newCourse(name: string) {
        this._courses.push(new Course(name, [], []));
        return this.getCourse(this._courses.length - 1);
    }

    addCourse(course: Course) {
        this._courses.push(course);
    }

    deleteCourse(courseID: number) {
        this._courses.splice(courseID, 1);
    }

    get courseCount() { return this._courses.length; }

    set name(newName: string) {
        this._name = newName || this._name;
    }

    get name() { return this._name; }
}


export function regenerateSemester(json: string) {
    let obj = JSON.parse(json);

    let course: Course[] = [];
    obj.courses.forEach((courseJson: string) => course.push(regenerateCourse(courseJson)));

    return new Semester(obj.name, course);
}
