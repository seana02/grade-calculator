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

    removeGradeGroup(index: number) {
        return this._gradeGroups.splice(index, 1)[0];
    }

    newScheme(sch: {[name: string]: {drop: number, weight: number}}) {
        this._schemes.push(new GradingScheme(sch));
    }

    deleteScheme(schemeID: number) {
        this._schemes.splice(schemeID, 1);
    }

    getSchemeKeys(schemeID: number) {
        return this._schemes[schemeID].keys;
    }

    get groupCount() { return this._gradeGroups.length; }

    set name(newName: string) {
        this._name = newName || this._name;
    }

    get name() { return this._name; }

    get grade() {
        let max = 0;
        this._schemes.forEach(sch => {
            if (!sch.length) return;
            let totalWeight = 0;
            let weightedScore = 0;
            this._gradeGroups.forEach(g => {
                let weightInfo = sch.getWeight(g.name) || {weight: 0, drop: 0};
                weightedScore += g.avgWithDrop(weightInfo.drop) * weightInfo.weight;
                totalWeight += weightInfo.weight;
            });
            if (weightedScore / totalWeight > max) {
                max = weightedScore/totalWeight;
            }
        });
        return max || this._gradeGroups.reduce((accu, g) => accu + g.avg, 0) / this._gradeGroups.length || 0;
    }
}

export function regenerateCourse(json: string) {
    let obj = JSON.parse(json);

    let schemes: GradingScheme[] = [];
    obj.schemes.forEach((schemeJson: string) => schemes.push(regenerateScheme(schemeJson)));

    let groups: GradeGroup[] = [];
    obj.gradeGroups.forEach((groupJson: string) => groups.push(regenerateGradeGroup(groupJson)));

    return new Course(obj.name, schemes, groups);
}
