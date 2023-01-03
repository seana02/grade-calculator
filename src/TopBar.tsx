import { Component } from "react";
import './index.css';


class TopBar extends Component<{ onReturn: () => void; }, {}> {
    constructor(props: { onReturn: () => void; }) {
        super(props);
    }

    render() {
        return (
            <div id="topbar">
                <div id="return-button" onClick={this.props.onReturn}>
                    <svg id="return-button-svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,7V11H5.83L9.41,7.41L8,6L2,12L8,18L9.41,16.58L5.83,13H21V7H19Z" />
                    </svg>
                </div>
                <div id="center">
                    <svg id="calculator-image" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V8H17V4H7M7,10V12H9V10H7M11,10V12H13V10H11M15,10V12H17V10H15M7,14V16H9V14H7M11,14V16H13V14H11M15,14V16H17V14H15M7,18V20H9V18H7M11,18V20H13V18H11M15,18V20H17V18H15Z" />
                    </svg>
                    <div className="text">Grade Calculator</div>
                </div>
            </div>
        );
    }
}

export default TopBar;
