import { Component } from "react";

interface Props {
    name: string,
    selected: boolean,
    onclick: () => void;
}

export default class SemesterElem extends Component<Props, {}> {
    render() {
        let classList = "semester";
        if (this.props.selected) {
            classList += " selected";
        }
        return (
            <div className={classList} onClick={this.props.onclick}>
                {this.props.name}
            </div>
        );
    }
}