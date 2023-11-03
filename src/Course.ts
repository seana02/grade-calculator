import GradeGroup, { regenerateGradeGroup } from "./GradeGroup";
import GradingScheme, { regenerateScheme } from "./GradingScheme";

export default class Course {
    private _name: string;
    private _schemes: GradingScheme[];
    private _gradeGroups: GradeGroup[];
    private _maxInd: number;

    constructor(name: string, schemes: GradingScheme[], gradeGroups: GradeGroup[]) {
        this._name = name;
        this._schemes = schemes;
        this._gradeGroups = gradeGroups;
        this._maxInd = -1;
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
    
    getFinalNeededFor(grade: number) {
        grade /= 100;
        if (this._maxInd >= 0) {
            // "final" category is first group with "Final" in it;
            // if it doesn't exist, it is the group with the largest weight
            // else, it is the last group
            let sch = this._schemes[this._maxInd];
            let finalIndex = -1;
            for (let i = 0; i < this._gradeGroups.length; i++) {
                if (this._gradeGroups[i].name.toLowerCase().includes("final")) {
                    finalIndex = i;
                    break;
                }
            }
            if (finalIndex === -1) {
                for (let i = 0; i < this._gradeGroups.length; i++) {
                    if (finalIndex === -1) {
                        if (sch.getWeight(this._gradeGroups[i].name).weight) {
                            finalIndex = i;
                        }
                    } else if (sch.getWeight(this._gradeGroups[i].name).weight > sch.getWeight(this._gradeGroups[finalIndex].name).weight) {
                        finalIndex = i;
                    }
                }
            }
            if (finalIndex === -1) {
                finalIndex = this._gradeGroups.length - 1;
            }

            // f = (grade*[sum of weights]-[sum of avg*weights except final category]) / (final category weight) * (total pts possible w/o final + 100) - (total earned without final)
            // f = (grade*[weightSum]-[currGrade]) / (expression) * finalPossible - finalEarned
            let weightSum = this._gradeGroups.reduce((accu, next) => accu + sch.getWeight(next.name).weight, 0);
            let currGrade = 0;
            for (let i = 0; i < this._gradeGroups.length; i++) {
                if (i === finalIndex) continue;
                let g = this._gradeGroups[i];
                let w = sch.getWeight(g.name);
                currGrade += w.weight * g.avgWithDrop(w.drop);
            }
            let finalPossible = 100 + this._gradeGroups[finalIndex].possibleWithDrop(sch.getWeight(this._gradeGroups[finalIndex].name).drop);
            let finalEarned = this._gradeGroups[finalIndex].earnedWithDrop(sch.getWeight(this._gradeGroups[finalIndex].name).drop);
            return (grade * weightSum - currGrade) / sch.getWeight(this._gradeGroups[finalIndex].name).weight * finalPossible - finalEarned;
        }
        // "final" category is first group with "final" in the name
        // if it doesn't exist, first group with "exam" or "midterm"
        // else last category
        let finalIndex = -1;
        for (let i = 0; i < this._gradeGroups.length; i++) {
            if (this._gradeGroups[i].name.toLowerCase().includes("final")) {
                finalIndex = i;
                break;
            }
        }
        if (finalIndex === -1) {
            for (let i = 0; i < this._gradeGroups.length; i++) {
                if (this._gradeGroups[i].name.toLowerCase().includes("exam")
                 || this._gradeGroups[i].name.toLowerCase().includes("midterm")) {
                    finalIndex = i;
                    break;
                }
            }
        }
        if (finalIndex === -1) {
            finalIndex = this._gradeGroups.length - 1;
        }
        // f = (grade*[sum of weights]-[sum of avg*weights except final category]) / (final category weight) * (total pts possible w/o final + 100) - (total earned without final)
        // f = (grade*[# groups]-[sum of avgs except final category]) * (total pts possible w/o final + 100) - (total earned without final)
        let f = grade * this._gradeGroups.length;
        for (let i = 0; i < this._gradeGroups.length; i++) {
            if (finalIndex === i) continue;
            f -= this._gradeGroups[i].avg;
        }
        f *= this._gradeGroups[finalIndex].possibleWithDrop(0) + 100;
        f -= this._gradeGroups[finalIndex].earnedWithDrop(0);
        return f;
    }

    get groupCount() { return this._gradeGroups.length; }

    set name(newName: string) {
        this._name = newName || this._name;
    }

    get name() { return this._name; }

    get grade() {
        let max = 0;
        let ind = -1;
        let count = 0;
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
                ind = count;
            }
            count += 1;
        });
        this._maxInd = ind;
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
