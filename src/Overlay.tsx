import { Component } from "react";

export default class Overlay extends Component<{resetState: () => void}, {}> {
    render() {
        return (
            <div className="overlay" onClick={this.props.resetState}></div>
        );
    }
}
