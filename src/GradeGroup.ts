import IGrade from "./IGrade";

class GradeGroup implements IGrade {
    private _desc: string;
    private _weight: number;
    private _gradesList: Array<IGrade>;

    constructor(desc: string, weight: number = 1) {
        this._desc = desc;
        this._weight = weight;
        this._gradesList = [];
    }

    addGrade(newGrade: IGrade) {
        this._gradesList.push(newGrade);
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
    
    removeGrade(id: number) {
        this._gradesList.splice(id, 1);
    }

    get ptsEarned() {
        let sum = 0;
        this._gradesList.forEach(elem => {
            sum += elem.ptsEarned;
        });
        return sum;
    }

    get ptsPossible() {
        let sum = 0;
        this._gradesList.forEach(elem => {
            sum += elem.ptsPossible;
        });
        return sum;
    }

    get percent() {
        let totalPercent = 0;
        let totalWeight = 0;
        this._gradesList.forEach(elem => {
            if (elem.percent !== -1) {
                totalPercent += elem.percent * elem.weight;
                totalWeight += elem.weight;
            }
        });
        return totalPercent / totalWeight;
    }

    get desc() {
        return this._desc;
    }

    set desc(desc: string) {
        this._desc = desc;
    }

    get weight() {
        return this._weight;
    }

    set weight(w: number) {
        if (w <= 0) {
            throw new Error('Weight must be positive');
        }
        this._weight = w;
    }

    get gradesList() {
        return this._gradesList;
    }

    toJSON() {
        let template: any = {
            [this._desc]: {
                weight: this._weight,
            }
        };
        this._gradesList.forEach(elem => {
            template[this._desc][elem.desc] = elem.toJSON()[elem.desc];
        });
        return template;
    }

}

export default GradeGroup;
