import { Component } from "react";

interface TIProps {
    deleting: boolean;
    toggleDeleting: () => void;
    idPrefix: string;
}

class TrashIcon extends Component<TIProps, {}> {

    constructor(props: TIProps) {
        super(props);
    }

    render() {
        if (this.props.deleting) {
            return (
                <svg id={`${this.props.idPrefix}-close-svg`} className="close-svg" viewBox="0 0 24 24" onClick={this.props.toggleDeleting}>
                    <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                </svg>
            );
        }
        return (
            <svg id={`${this.props.idPrefix}-trash-svg`} className="trash-svg" viewBox="0 0 24 24" onClick={this.props.toggleDeleting}>
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
        );
    }
}

export default TrashIcon;
