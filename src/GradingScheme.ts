interface Weights {
    [name: string]: {
        drop: number[],
        weight: number[]
    },
}

export default class GradingScheme {
    private _scheme: Weights;

    constructor (weightList: Weights) {
        this._scheme = weightList;
    }

    updateScheme(newList: Weights) {
        this._scheme = newList;
    }

    toJSON() {
        return {
            sch: this._scheme
        }
    }

    getWeight(groupName: string): {drop: number[], weight: number[]} {
        return this._scheme[groupName] || { drop: [0], weight: [0] };
    }

    get weightCount() { return this._scheme.length; }
    
    get length() { return Object.keys(this._scheme).length; }

    get keys() { return Object.keys(this._scheme); }
}

export function regenerateScheme(obj: {sch: Weights}) {
    return new GradingScheme(obj.sch);
}
