import { Component } from "react";
import Course from "./Course";
import GradeGroup from "./GradeGroup";
import EditSVG from "./EditSVG";
import TrashSVG from "./TrashSVG";
import Grade from "./Grade";

interface GDProps {
    course: Course
}

interface GDState {
    editing: [number, number];
    deleting: [number, number];
}

export default class GradeDetails extends Component<GDProps, GDState> {
    constructor(props: GDProps) {
        super(props);

        this.state = {
            editing: [-1, -1],
            deleting: [-1, -1],
        }

        this.getGroupInfo = this.getGroupInfo.bind(this);
        this.getOverlay = this.getOverlay.bind(this);
        this.resetState = this.resetState.bind(this);
        this.getEditMenu = this.getEditMenu.bind(this);
        this.badKey = this.badKey.bind(this);
        this.deleteKey = this.deleteKey.bind(this);
        this.getDeleteConfirmationMenu = this.getDeleteConfirmationMenu.bind(this);
        this.gradeSubmit = this.gradeSubmit.bind(this);
        this.deleteGrade = this.deleteGrade.bind(this);
    }

    render() {
        let content = [];

        for (let i = 0; i < this.props.course.groupCount; i++) {
            content.push(this.getGroupInfo(i))
        }

        return (
            <div id="course-info">
                {this.getOverlay()}
                {this.getEditMenu()}
                {this.getDeleteConfirmationMenu()}
                <div id="course-header">
                    {this.props.course.name}
                </div>
                {content}
            </div>
        );
    }

    getOverlay() {
        if (this.state.editing[1] >= 0 || this.state.deleting[1] >= 0) {
            return (
                <div className="overlay grade-details" onClick={this.resetState}></div>
            );
        }
        return <></>;
    }

    getEditMenu() {
        return (
            <div className={"course-group-grade-edit-menu" + (this.state.editing[1] === -1 ? " hidden" : "")}>
                <div className="popup-title">Edit Grade</div>
                <div className="course-group-grade-edit-menu-name">
                    <div className="course-group-grade-edit-menu-name-left">Name:</div>
                    <div className="course-group-grade-edit-menu-name-right editable" contentEditable={true}>
                        {this.props.course.getGradeGroup(this.state.editing[0])?.getGrade(this.state.editing[1])?.name || ""}
                    </div>
                </div>
                <div className="course-group-grade-edit-menu-grade">
                    <div className="course-group-grade-edit-menu-grade-left">Grade:</div>
                    <div className="course-group-grade-edit-menu-grade-right">
                        <div id="course-group-grade-edit-menu-grade-right-earned"
                            className="editable"
                            contentEditable={true}
                            onKeyDown={e => {
                                    if (this.badKey(e.key)) {
                                        e.preventDefault();
                                    } else if (!this.deleteKey(e.key) && (document.getElementById('course-group-grade-edit-menu-grade-right-earned')?.textContent?.length || 0) >= 6) {
                                        e.preventDefault();
                                    }
                                }
                            }
                        >
                            {this.props.course.getGradeGroup(this.state.editing[0])?.getGrade(this.state.editing[1])?.ptsEarned || ""}
                        </div>
                        <div className="course-group-grade-edit-menu-grade-right-slash"> / </div>
                        <div id="course-group-grade-edit-menu-grade-right-possible"
                            className="editable"
                            contentEditable={true}
                            onKeyDown={e => {
                                    if (this.badKey(e.key)) {
                                        e.preventDefault();
                                    } else if (!this.deleteKey(e.key) && (document.getElementById('course-group-grade-edit-menu-grade-right-possible')?.textContent?.length || 0) >= 6) {
                                        e.preventDefault();
                                    }
                                }
                            }
                        >
                            {this.props.course.getGradeGroup(this.state.editing[0])?.getGrade(this.state.editing[1])?.ptsPossible || ""}
                        </div>
                    </div>
                </div>
                <div className="course-group-grade-edit-menu-buttons">
                    <div className="course-group-grade-edit-menu-buttons-submit" onClick={this.gradeSubmit}>Submit</div>
                    <div className="course-group-grade-edit-menu-buttons-cancel" onClick={this.resetState}>Cancel</div>
                </div>
            </div>
        );
    }

    badKey(key: string) {
        // console.log(key);
        if (this.deleteKey(key)) return false;
        if (key === 'Tab') return false;
        if (key === '.') return false;
        if (key.startsWith('Arrow')) return false;
        if (isNaN(Number.parseInt(key))) return true;
        return false;
    }

    deleteKey(key: string) {
        if (key === 'Backspace') return true;
        if (key === 'Delete') return true;
        return false;
    }
    
    getDeleteConfirmationMenu() {
        return (
            <div className={"delete-confirm-menu" + (this.state.deleting[1] === -1 ? " hidden" : "")}>
                <div className="popup-title">Are you sure?</div>
                <div className="course-group-grade-edit-menu-buttons">
                    <div className="course-group-grade-edit-menu-buttons-submit" onClick={this.deleteGrade}>Confirm</div>
                    <div className="course-group-grade-edit-menu-buttons-cancel" onClick={this.resetState}>Cancel</div>
                </div>
            </div>    
        );
    }

    gradeSubmit() {
        let namePrefix: string = "course-group-grade-edit-menu-";
        let gradeObj: Grade = this.props.course.getGradeGroup(this.state.editing[0]).getGrade(this.state.editing[1]);
        gradeObj.name = document.getElementById(namePrefix + "name-right")?.textContent || gradeObj.name;
        gradeObj.ptsPossible = +(document.getElementById(namePrefix + "grade-right-possible")?.textContent || gradeObj.ptsPossible) || gradeObj.ptsPossible;
        gradeObj.ptsEarned = +(document.getElementById(namePrefix + "grade-right-earned")?.textContent || gradeObj.ptsEarned) || gradeObj.ptsEarned;
        this.resetState();
    }

    deleteGrade() {
        this.props.course.getGradeGroup(this.state.deleting[0]).deleteGrade(this.state.deleting[1]);
        this.resetState();
    }

    getGroupInfo(n: number) {
        let group: GradeGroup = this.props.course.getGradeGroup(n);
        let content = [];
        
        for (let i = 0; i < group.gradeCount; i++) {
            content.push(
                <div className="course-group-grade">
                    <div className="course-group-grade-name">{group.getGrade(i).name}</div>
                    <div className="course-group-grade-right">
                        <div className="course-group-grade-fraction">{group.getGrade(i).ptsEarned + ' / ' + group.getGrade(i).ptsPossible}</div>
                        <div className="course-group-grade-percent">{group.getGrade(i).percent}</div>
                        <div className="course-group-grade-edit"><EditSVG onclick={() => {this.setState({editing: [n, i]})}}/></div>
                        <div className="course-group-grade-delete"><TrashSVG deleting={false} onclick={() => this.setState({deleting: [n, i]})} onclose={() => {}}/></div>
                    </div>
                </div>
            );
        }

        return (
            <details className="course-group">
                <summary className="course-group-header">{group.name}</summary>
                {content}
            </details>
        );
    }

    resetState() {
        // clear the forms

        this.setState({
            deleting: [-1, -1],
            editing: [-1, -1]
        });
    }

}
