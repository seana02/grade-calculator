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
        return this._grades[gradeID] || this.newGrade("New Grade", 100, 100);
    }

    newGrade(name: string, ptsEarned: number, ptsPossible: number) {
        this._grades.push(new Grade(name, ptsEarned, ptsPossible));
        return this.getGrade(this._grades.length - 1);
    }

    deleteGrade(index: number) {
        this._grades.splice(index, 1);
    }

    get gradeCount() { return this._grades.length; }

    get avg() {
        return (this._grades.reduce((accu, nextGrade) => accu + nextGrade.ptsEarned, 0) /
        this._grades.reduce((accu, nextGrade) => accu + nextGrade.ptsPossible, 0)) || 0;
    }

    avgWithDrop(drop: number) {
        if (this._grades.length === 0) { return 0; }
        else if (this._grades.length <= drop) { return 1; }
        return this.earnedWithDrop(drop) / this.possibleWithDrop(drop) || 0;
    }
    
    possibleWithDrop(drop: number) {
        let ptsPossible = 0;
        [...this._grades.keys()]
            .sort((a,b) => this._grades[b].ptsEarned/this._grades[b].ptsPossible - this._grades[a].ptsEarned/this._grades[a].ptsPossible)
            .slice(0, this._grades.length - drop)
            .forEach(i => ptsPossible += this._grades[i].ptsPossible);
        return ptsPossible;
    }

    earnedWithDrop(drop: number) {
        let ptsEarned: number = 0;
        [...this._grades.keys()]
            .sort((a,b) => this._grades[b].ptsEarned/this._grades[b].ptsPossible - this._grades[a].ptsEarned/this._grades[a].ptsPossible)
            .slice(0, this._grades.length - drop)
            .forEach(i => ptsEarned += this._grades[i].ptsEarned);
        return ptsEarned;
    }

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
