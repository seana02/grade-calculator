import { Component } from "react";

interface SidebarProps {
    add: () => void;
    remove: () => void;
    groupList: string[];
    changeActiveGroup: (id: number) => void;
}

class Sidebar extends Component<SidebarProps, {}> {
    constructor(props: any) {
        super(props);
    
        this.getRows = this.getRows.bind(this);
    }

    render() {
        return (
            <div id="sidebar">
                <div id="sidebar-header">
                    <svg id="sidebar-trash-svg" viewBox="0 0 24 24" onClick={this.props.remove}>
                        <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                    <svg id="sidebar-plus-svg" viewBox="0 0 24 24" onClick={this.props.add}>
                        <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </div>
                {this.getRows()}
            </div>
        );
    }

    getRows() {
        let content: Array<JSX.Element> = [];
        for (let i = 0; i < this.props.groupList.length; i++) {
            content.push(<div key={i} className="sidebar-group" onClick={this.props.changeActiveGroup.bind(this, i)}>{this.props.groupList[i]}</div>)
        }
        return content;
    }
}

export default Sidebar;


