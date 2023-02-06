import { Component } from "react";

interface ESRProps {
    index: number;
    name: string;
    weight: number;
    drop: number;
}

class EditSchemeRow extends Component<ESRProps, {}> {
    constructor(props: ESRProps) {
        super(props);
    }

    render() {
        return (
            <div className="popup-flex-wrapper">
                <input id={`popup-edit-scheme-label-${this.props.index}`}
                    className="popup-input popup-edit-scheme-label"
                    type="text"
                    defaultValue={this.props.name}
                />
                <input id={`popup-edit-scheme-weight-${this.props.index}`}
                    className="popup-input popup-edit-scheme-input"
                    type="number"
                    defaultValue={this.props.weight}
                />
                <input id={`popup-edit-scheme-drop-${this.props.index}`}
                    className="popup-input popup-edit-scheme-input"
                    type="number"
                    defaultValue={this.props.drop}
                />
            </div>
        );
    }
} 

export default EditSchemeRow;
