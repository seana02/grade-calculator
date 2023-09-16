import Grade from "./Grade";
import GradeGroup, { regenerateGradeGroup } from "./GradeGroup";
import GradingScheme, { regenerateScheme } from "./GradingScheme";

export default class Course {
    private _name: string;
    private _schemes: GradingScheme[];
    private _gradeGroups: GradeGroup[];

    constructor(name: string, schemes: GradingScheme[], gradeGroups: GradeGroup[]) {
        this._name = name;
        this._schemes = schemes;
        this._gradeGroups = gradeGroups;
    }

    toJSON() {
        let schemes: string[] = [];
        this._schemes.forEach(s => schemes.push(JSON.stringify(s)));
        let groups: string[] = [];
        this._gradeGroups.forEach(g => groups.push(JSON.stringify(g)));
        return {
            name: this._name,
            schemes: schemes,
            gradeGroups: groups
        };
    }

    getScheme(schemeID: number): GradingScheme {
        return this._schemes[schemeID];
    }

    get schemeCount() { return this._schemes.length; }

    getGradeGroup(groupID: number): GradeGroup {
        return this._gradeGroups[groupID];
    }

    newGradeGroup(name: string) {
        this._gradeGroups.push(new GradeGroup(name, []));
        return this.getGradeGroup(this._gradeGroups.length - 1);
    }

    addGradeGroup(group: GradeGroup) {
        this._gradeGroups.push(group);
    }

    get groupCount() { return this._gradeGroups.length; }

    set name(newName: string) {
        this._name = newName || this._name;
    }

    get name() { return this._name; }
}

export function regenerateCourse(json: string) {
    let obj = JSON.parse(json);

    let schemes: GradingScheme[] = [];
    obj.schemes.forEach((schemeJson: string) => schemes.push(regenerateScheme(schemeJson)));

    let groups: GradeGroup[] = [];
    obj.gradeGroups.forEach((groupJson: string) => groups.push(regenerateGradeGroup(groupJson)));

    return new Course(obj.name, schemes, groups);
}