import { Component } from "react"

interface MenuProps {
    onconfirm: () => void,
    oncancel: () => void,
    hidden: boolean
}

export default class DeleteConfirmationMenu extends Component<MenuProps, {}> {
    render() {
        return (
            <div className={"delete-confirm-menu menu" + (this.props.hidden ? " hidden" : "")}>
                <div className="popup-title">Are you sure?</div>
                <div className="course-group-grade-edit-menu-buttons buttons">
                    <div className="course-group-grade-edit-menu-buttons-submit" onClick={this.props.onconfirm}>Confirm</div>
                    <div className="course-group-grade-edit-menu-buttons-cancel" onClick={this.props.oncancel}>Cancel</div>
                </div>
            </div>
        );
    }
}
