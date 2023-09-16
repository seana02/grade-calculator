import { Component } from "react";

interface TrashProps {
    deleting: boolean;
    onclick: () => void;
    onclose: () => void;
}

export default class TrashSVG extends Component<TrashProps, {}> {

    render() {
        if (this.props.deleting) {
            return (
                <svg className="close-svg" viewBox="0 0 24 24" onClick={this.props.onclose}>
                    <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                </svg>
            );
        }
        return (
            <svg className="trash-svg" viewBox="0 0 24 24" onClick={this.props.onclick}>
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
        );
    }
}