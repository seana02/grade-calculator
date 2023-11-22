export default class Grade {
    private _name: string;
    private _ptsEarned: number;
    private _ptsPossible: number;

    constructor(name: string, ptsEarned: number, ptsPossible: number) {
        this._name = name;
        this._ptsEarned = ptsEarned;
        this._ptsPossible = ptsPossible;
    }

    toJSON() {
        return {
            name: this._name,
            ptsEarned: this._ptsEarned,
            ptsPossible: this._ptsPossible
        };
    }

    get name() { return this._name; }
    get ptsEarned() { return this._ptsEarned; }
    get ptsPossible() { return this._ptsPossible; }
    //get percent() { return Math.round(10000 * (this.ptsEarned / this.ptsPossible || 0)) / 100 + "%"; }
    get percent() { return (this.ptsEarned / this.ptsPossible * 100 || 0).toFixed(2) + "%"; }

    set name(newName: string) {
        this._name = newName || this._name;
    }

    set ptsEarned(newEarned: number) {
        // allows for extra credit, but considers 10x to be a mistake, e.g. typing 1000 instead of 100
        if (newEarned < 0 || (this._ptsPossible !== 0 && newEarned >= 10 * this._ptsPossible)) {
            return;
        }
        this._ptsEarned = newEarned;
    }

    set ptsPossible(newPossible: number) {
        if (newPossible < 0) {
            return;
        }
        this._ptsPossible = newPossible;
    }

}

export function regenerateGrade(obj: {name: string, ptsEarned: number, ptsPossible: number}): Grade {
    return new Grade(obj.name, obj.ptsEarned, obj.ptsPossible);
}
