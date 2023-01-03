import { Component } from "react";

interface SidebarProps {
    add: () => void;
    remove: (id: number) => void;
    groupList: string[];
    activeGroup: number;
    changeActiveGroup: (id: number) => void;
}

interface SidebarState {
    deleting: boolean;
}

class Sidebar extends Component<SidebarProps, SidebarState> {
    constructor(props: any) {
        super(props);

        this.state = {
            deleting: false
        }
    
        this.trashIcon = this.trashIcon.bind(this);
        this.getRows = this.getRows.bind(this);
    }

    render() {
        return (
            <div id="sidebar">
                <div id="sidebar-header">
                    {this.trashIcon()}
                    <svg id="sidebar-plus-svg" viewBox="0 0 24 24" onClick={this.props.add}>
                        <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </div>
                {this.getRows()}
            </div>
        );
    }

    trashIcon() {
        if (this.state.deleting) {
            return (
                <div onClick={() => this.setState({ deleting: false })}>
                    <svg id="sidebar-close-svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                    </svg>
                </div>
            );
        }
        return (
            <div onClick={() => this.setState({ deleting: true })}>
                <svg id="sidebar-trash-svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
            </div>
        );
    }

    getRows() {
        let content: Array<JSX.Element> = [];
        for (let i = 0; i < this.props.groupList.length; i++) {
            content.push(
                <div className="sidebar-group-wrapper">
                    <div
                        key={i}
                        className={"sidebar-group " + (i === this.props.activeGroup ? "active" : "")}
                        onClick={this.props.changeActiveGroup.bind(this, i)}
                    >
                        {this.props.groupList[i]}
                    </div>
                    {this.state.deleting
                        ? <div className="sidebar-delete-group" onClick={() => this.props.remove(i)}>
                            <svg id="sidebar-trash-button" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>
                        </div>
                        : <></>
                    }
                </div>
            )
        }
        return content;
    }
}

export default Sidebar;


