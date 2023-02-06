import { GradeData } from "./DataInterfaces";

class Grade {
    private _desc: string;
    private _ptsPossible: number;
    private _ptsEarned: number;

    constructor(desc: string, ptsEarned: number, ptsPossible: number) {
        this._desc = desc;
        this._ptsPossible = ptsPossible;
        this._ptsEarned = ptsEarned;
    }

    public static load(data: GradeData) {
        return new Grade(data.name, data.ptsEarned, data.ptsPossible);
    }

    get ptsPossible() {
        return this._ptsPossible;
    }

    set ptsPossible(newPts: number) {
        if (newPts < 0) {
            throw new Error('Points possible cannot be negative');
        }
        this._ptsPossible = newPts;
    }

    get ptsEarned() {
        return this._ptsEarned;
    }

    set ptsEarned(newPts: number) {
        this._ptsEarned = newPts;
    }

    get desc() {
        return this._desc;
    }

    set desc(newDesc: string) {
        this._desc = newDesc;
    }

    get percent() {
        if (this._ptsEarned === -1) {
            return -1;
        }
        return this.ptsEarned / this.ptsPossible;
    }

    get gradesList() {
        return [this];
    }
    
    toJSON() {
        let obj = {
            name: this._desc,
            ptsEarned: this._ptsEarned,
            ptsPossible: this._ptsPossible,
        };
        return obj;
    }

}

export default Grade;
