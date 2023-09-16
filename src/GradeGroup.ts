import Grade, { regenerateGrade } from "./Grade";

export default class GradeGroup {
    private _name: string;
    private _grades: Grade[];

    constructor(name: string, grades: Grade[]) {
        this._name = name;
        this._grades = grades;
    }

    toJSON() {
        let grades: string[] = [];
        this._grades.forEach(g => grades.push(JSON.stringify(g)));
        return {
            name: this._name,
            grades: grades
        };
    }

    getGrade(gradeID: number): Grade {
        return this._grades[gradeID];
    }

    newGrade(name: string, ptsEarned: number, ptsPossible: number) {
        this._grades.push(new Grade(name, ptsEarned, ptsPossible));
        return this.getGrade(this._grades.length - 1);
    }

    get gradeCount() { return this._grades.length; }

    set name(newName: string) {
        this._name = newName || this._name;
    }

    get name() { return this._name; }
}

export function regenerateGradeGroup(json: string) {
    let obj = JSON.parse(json);
    
    let grades: Grade[] = [];
    obj.grades.forEach((gradeJson: string) => grades.push(regenerateGrade(gradeJson)));

    return new GradeGroup(obj.name, grades);
}