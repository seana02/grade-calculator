import { GradeGroupData } from './DataInterfaces';
import Grade from './Grade';

class GradeGroup {
    private _desc: string;
    private _gradesList: Array<Grade>;

    constructor(desc: string) {
        this._desc = desc;
        this._gradesList = [];
    }

    public static load(data: GradeGroupData) {
        let group = new GradeGroup(data.name);
        console.log(data);
        data.grades.forEach(gr => {
            group.addGrade(Grade.load(gr));
        });
        return group;
    }

    addGrade(newGrade: Grade) {
        this._gradesList.push(newGrade);
        this.sort();
    }
    
    removeGrade(id: number) {
        this._gradesList.splice(id, 1);
    }

    get percent() {
        return this.percentDrop(0);
    }

    percentDrop(d: number = 0) {
        let sorted = [...this._gradesList];
        if (0 < d && d < this._gradesList.length)
            sorted = sorted.sort((a, b) => a.percent - b.percent);
        let totalEarned = 0;
        let totalPossible = 0;
        for (let i = d; i < sorted.length; i++) {
            totalEarned += sorted[i].ptsEarned;
            totalPossible += sorted[i].ptsPossible;
            //totalPercent += sorted[i].percent * sorted[i].weight;
            //totalWeight += sorted[i].weight;
        }
        //return (totalWeight !== 0 && totalPercent / totalWeight) || 0;
        return (totalPossible !== 0 && totalEarned / totalPossible) || 0;
    }

    get desc() {
        return this._desc;
    }

    set desc(desc: string) {
        this._desc = desc;
    }

    get gradesList() {
        return this._gradesList;
    }

    private sort() {
        this._gradesList.sort((a, b): number => {
            if (a instanceof GradeGroup) {
                if (b instanceof GradeGroup) {
                    return 0;
                }
                return -1;
            }
            if (b instanceof GradeGroup) {
                return 1;
            }
            return a.desc.localeCompare(b.desc);
        });
    }

    toJSON() {
        let template: any = [];
        this._gradesList.forEach(elem => {
            template.push(elem.toJSON());
        });
        return {
            name: this._desc,
            grades: template
        };
    }

}

export default GradeGroup;
