import IGrade from "./IGrade";

class Grade implements IGrade {
    private _desc: string;
    private _ptsPossible: number;
    private _ptsEarned: number;
    private _weight: number;

    constructor(desc: string, ptsEarned: number, ptsPossible: number,  weight: number = 1) {
        this._desc = desc;
        this._ptsPossible = ptsPossible;
        this._ptsEarned = ptsEarned;
        this._weight = weight;
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
        this._ptsPossible = newPts;
    }

    get weight() {
        return this._weight;
    }

    set weight(newW: number) {
        if (newW <= 0) {
            throw new Error('Weight must be positive');
        }
        this._weight = newW;
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
    
    toJSON() {
        let obj = {
            [this._desc]: {
                ptsEarned: this._ptsEarned,
                ptsPossible: this._ptsPossible,
                weight: this._weight,
            }
        };
        return obj;
    }

}

export default Grade;
