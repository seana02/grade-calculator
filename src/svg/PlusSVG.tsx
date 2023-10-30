import { Component } from "react";

interface PlusProps {
    onclick: () => void;
}

export default class PlusSVG extends Component<PlusProps, {}> {
    render() {
        return (
            <svg className="svg-plus" viewBox="0 0 24 24" onClick={this.props.onclick}>
                <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
        );
    }
}
