interface Weight {
    groupName: string,
    weight: number
}

export default class GradingScheme {
    private _scheme: Weight[];

    constructor (weightList: Weight[]) {
        this._scheme = weightList;
    }

    updateScheme(newList: Weight[]) {
        this._scheme = newList;
    }

    toJSON() {
        return {
            sch: this._scheme
        }
    }

    getWeight(weightID: number): Weight {
        return this._scheme[weightID];
    }

    get weightCount() { return this._scheme.length; }
}

export function regenerateScheme(json: string) {
    let obj = JSON.parse(json);
    return new GradingScheme(obj.sch);
}