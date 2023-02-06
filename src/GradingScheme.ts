import { SchemeData } from './DataInterfaces';
import GradeGroup from './GradeGroup';

class GradingScheme {
    private _gradeGroups: GradeGroup[];
    private _weights: {[key: string]: number}[]
    private _dropCounts: {[key: string]: number}[]
    private _numGradingSchemes: number;
    name: string;
    private _maxWeight: number;

    constructor(name: string) {
        this._gradeGroups = [];
        this._weights = [];
        this._dropCounts = [];
        this._numGradingSchemes = 0;
        this.name = name;
        this._maxWeight = 0;

    }

    public static load(data: SchemeData) {
        let scheme = new GradingScheme(data.name);
        data.gradeGroups.forEach(g => {
            scheme.addGradeGroup(GradeGroup.load(g));
        });
        for (let i = 0; i < data.numGradingSchemes; i++) {
            scheme.addGradingScheme(data.weights[i], data.dropCounts[i]);
        }
        return scheme;
    }

    addGradingScheme(sch: {[key: string]: number}, drop: {[key: string]: number} = {}) {
        this._weights.push(sch);
        this._dropCounts.push(drop);
        this._numGradingSchemes++;
    }

    addGradeGroup(g: GradeGroup) {
        this._gradeGroups.push(g);
    }

    removeGradeGroup(id: number) {
        this._gradeGroups.splice(id, 1);
    }

    changeGradingScheme(index: number, weights: {[key: string]: number}, drops: {[key: string]: number}) {
        if (Object.keys(weights).length === 0 || Object.keys(drops).length === 0) {
            if (this._numGradingSchemes > 1) {
                this._weights.splice(index, 1);
                this._dropCounts.splice(index, 1);
                this._numGradingSchemes--;
            }
        }
        else {
            this._weights[index] = weights;
            this._dropCounts[index] = drops;
        }
    }

    get percent() {
        if (this._numGradingSchemes === 0) {
            return this.equalPercent();
        }
        let possible = [];
        for (let i = 0; i < this._numGradingSchemes; i++) {
            let totalWeight = 0;
            let totalPercent = 0;
            for (let x of this._gradeGroups) {
                let weight = this._weights[i][x.desc] || 0;
                totalWeight += weight;
                totalPercent += x.percentDrop(this._dropCounts[i][x.desc]) * weight;
            }
            possible.push(totalPercent / totalWeight);
        }
        let maxIndex = 0;
        for (let i = 1; i < possible.length; i++) {
            if (!possible[maxIndex] || possible[maxIndex] < possible[i]) {
                maxIndex = i;
            }
        }
        this._maxWeight = maxIndex;
        return possible[maxIndex];
    }

    gradeGroupPercent(i: number) {
        if (this._numGradingSchemes === 0) {
            return 0;
        }
        let d = this._dropCounts[this._maxWeight][this._gradeGroups[i].desc];
        return this._gradeGroups[i].percentDrop(d);
    }

    equalPercent() {
        let totalPercent = 0;
        for (let x of this._gradeGroups) {
            totalPercent += x.percent;
        }
        return totalPercent / this._gradeGroups.length || 0;
    }

    get gradesList() {
        return this._gradeGroups;
    }

    get weights() {
        return this._weights;
    }

    get dropCounts() {
        return this._dropCounts;
    }

    get numGradingSchemes() {
        return this._numGradingSchemes;
    }

    get maxWeight() {
        return this._maxWeight;
    }

    toJSON() {
        let groups: any = [];
        this._gradeGroups.forEach(gg => {
            groups.push(gg.toJSON());
        });
        return {
            name: this.name,
            gradeGroups: groups,
            weights: this._weights,
            dropCounts: this._dropCounts,
            numGradingSchemes: this._numGradingSchemes
        };
    }
    
}

export default GradingScheme;
