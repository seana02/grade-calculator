import { Component } from "react";
import EditSchemeRow from "./EditSchemeRow";
import GradingScheme from "./GradingScheme";

interface Props {
    activeCourse: GradingScheme; 
    schemeID: number
    deactivatePopup: () => void;
}

class EditSchemePopup extends Component<Props, {}> {
    private weights: {[key: string]: number};
    private drops: {[key: string]: number};

    constructor(props: Props) {
        super(props);
        
        this.weights = this.props.activeCourse.weights[this.props.schemeID];
        this.drops = this.props.activeCourse.dropCounts[this.props.schemeID];
        this.getNewRow = this.getNewRow.bind(this);
    }

    getNewRow(index: number) {
        let newRow = document.createElement('div');
        newRow.classList.add('popup-flex-wrapper');

        let labelElem = document.createElement('input');
        labelElem.id = `popup-edit-scheme-label-${index}`;
        labelElem.classList.add('popup-input');
        labelElem.classList.add('popup-edit-scheme-label');
        labelElem.type = 'text';
        labelElem.defaultValue = '';

        let weightElem = document.createElement('input');
        weightElem.id = `popup-edit-scheme-weight-${index}`;
        weightElem.classList.add('popup-input');
        weightElem.classList.add('popup-edit-scheme-input');
        weightElem.type = 'number';
        weightElem.defaultValue = '';
        
        let dropElem = document.createElement('input');
        dropElem.id = `popup-edit-scheme-drop-${index}`;
        dropElem.classList.add('popup-input');
        dropElem.classList.add('popup-edit-scheme-input');
        dropElem.type = 'number';
        dropElem.defaultValue = '';

        newRow.appendChild(labelElem);
        newRow.appendChild(weightElem);
        newRow.appendChild(dropElem);
        return newRow;
    }
    
    render() {
        let groups: JSX.Element[] = [];
        let i = 0;
        for (let key in this.weights) {
            groups.push(
                <EditSchemeRow
                    index={i}
                    name={key}
                    weight={this.weights[key]}
                    drop={this.drops[key]}
                />
            );
            i++;
        }
        return (
            <div className="popup active" id="popup-edit-scheme">
                <div className="popup-flex-wrapper">
                    <div className="popup-header">Edit Grading Scheme</div>
                    <svg id="popup-edit-scheme-plus-svg" viewBox="0 0 24 24" onClick={() => {
                        let rowContainer = document.querySelector('#popup-edit-scheme-row-wrapper');
                        let i = 0;
                        while (document.querySelector(`#popup-edit-scheme-label-${i}`)) {
                            i++;
                        }
                        rowContainer?.appendChild(this.getNewRow(i));
                    }}>
                        <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </div>
                <div className="popup-flex-wrapper">
                    <div id="popup-edit-scheme-label-header" className="popup-edit-scheme-label">Name</div>
                    <div id="popup-edit-scheme-weight-header" className="popup-edit-scheme-input">Weight</div>
                    <div id="popup-edit-scheme-drop-header" className="popup-edit-scheme-input">Drop</div>
                </div>
                <div id="popup-edit-scheme-row-wrapper">
                    {groups}
                </div>
                <div className="popup-flex-wrapper">
                    <div className="popup-submit" id="popup-grade-submit" onClick={() => {
                        let newWeights: {[key: string]: number} = {};
                        let newDrops: {[key: string]: number} = {};
                        let i = 0;
                        while (document.querySelector(`#popup-edit-scheme-label-${i}`)) {
                            let label = document.querySelector(`#popup-edit-scheme-label-${i}`) as HTMLInputElement;
                            let weight = document.querySelector(`#popup-edit-scheme-weight-${i}`) as HTMLInputElement;
                            let drop = document.querySelector(`#popup-edit-scheme-drop-${i}`) as HTMLInputElement;
                            if (label.value && +weight.value >= 0 && +drop.value >= 0) {
                                newWeights[label.value] = +weight.value;
                                newDrops[label.value] = +drop.value;
                            }
                            i++;
                        }
                        this.props.activeCourse.changeGradingScheme(this.props.schemeID, newWeights, newDrops);
                        this.props.deactivatePopup();
                        this.setState({ activeScheme: -1 });
                    }}>Done</div>
                    <div className="popup-submit" id="popup-grade-cancel" onClick={this.props.deactivatePopup}>Cancel</div>
                </div>
            </div>
        );
    }
}

export default EditSchemePopup;
