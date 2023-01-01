import { Component } from "react";
import './index.css';


class TopBar extends Component {
    render() {
        return (
            <div id="topbar">
                <svg id="hamburger-menu" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
                </svg>
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
