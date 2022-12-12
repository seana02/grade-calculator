import IGrade from "./IGrade";

class GradeGroup implements IGrade {
    private _desc: string;
    private _weight: number;
    private gradesList: Array<IGrade>;

    constructor(desc: string, weight: number = 1) {
        this._desc = desc;
        this._weight = weight;
        this.gradesList = [];
    }

    addGrade(newGrade: IGrade) {
        this.gradesList.push(newGrade);
    }
    
    removeGrade(desc: string) {
        this.gradesList = this.gradesList.filter(elem => elem.desc !== desc);
    }

    get ptsEarned() {
        let sum = 0;
        this.gradesList.forEach(elem => {
            sum += elem.ptsEarned;
        });
        return sum;
    }

    get ptsPossible() {
        let sum = 0;
        this.gradesList.forEach(elem => {
            sum += elem.ptsPossible;
        });
        return sum;
    }

    get percent() {
        let totalPercent = 0;
        let totalWeight = 0;
        this.gradesList.forEach(elem => {
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

    toJSON() {
        let template: any = {
            [this._desc]: {
                weight: this._weight,
            }
        };
        this.gradesList.forEach(elem => {
            template[this._desc][elem.desc] = elem.toJSON()[elem.desc];
        });
        return template;
    }

}

export default GradeGroup;
