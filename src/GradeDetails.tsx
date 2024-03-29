import { Component, MouseEvent } from "react";
import Course from "./Course";
import GradeGroup from "./GradeGroup";
import EditSVG from "./svg/EditSVG";
import TrashSVG from "./svg/TrashSVG";
import PlusSVG from "./svg/PlusSVG";
import Grade from "./Grade";
import DeleteConfirmationMenu from "./DeleteConfirmationMenu";
import Overlay from "./Overlay";
import PasteSVG from "./svg/PasteSVG";

interface GDProps {
    course: Course,
    deleteCourse: () => void,
    commit: () => void,
}

interface GDState {
    editing: [number, number];
    deleting: [number, number];
    activeCourseButton: number;
    scheme: number;
    schemeBlanks: number;
}

export default class GradeDetails extends Component<GDProps, GDState> {

    constructor(props: GDProps) {
        super(props);

        this.state = {
            editing: [-1, -1],
            deleting: [-1, -1],
            activeCourseButton: 0,
            scheme: -1,
            schemeBlanks: 0,
        }

        this.getGroupInfo = this.getGroupInfo.bind(this);
        this.getOverlay = this.getOverlay.bind(this);
        this.getNewGroupMenu = this.getNewGroupMenu.bind(this);
        this.getSchemeList = this.getSchemeList.bind(this);
        this.getSchemeInfo = this.getSchemeInfo.bind(this);
        this.resetState = this.resetState.bind(this);
        this.getEditMenu = this.getEditMenu.bind(this);
        this.badKey = this.badKey.bind(this);
        this.deleteKey = this.deleteKey.bind(this);
        this.getDeleteConfirmationMenu = this.getDeleteConfirmationMenu.bind(this);
        this.newGroupSubmit = this.newGroupSubmit.bind(this);
        this.gradeSubmit = this.gradeSubmit.bind(this);
        this.schemeSubmit = this.schemeSubmit.bind(this);
        this.deleteGrade = this.deleteGrade.bind(this);
        this.deleteGradeGroup = this.deleteGradeGroup.bind(this);
        this.getFinalCalculatorMenu = this.getFinalCalculatorMenu.bind(this);
    }

    render() {
        let finalAverage = (this.props.course.grade * 100).toFixed(2);
        let content = [];

        for (let i = 0; i < this.props.course.groupCount; i++) {
            content.push(this.getGroupInfo(i));
        }

        return (
            <div id="course-info">
                {this.getOverlay()}
                {this.getNewGroupMenu()}
                {this.getEditMenu()}
                {this.getDeleteConfirmationMenu()}
                {this.getSchemeList()}
                {this.getSchemeInfo()}
                {this.getFinalCalculatorMenu()}
                <div id="course-header">
                    {this.props.course.name}
                    <div className="course-header-grade">
                        {`${finalAverage}%`}
                    </div>
                    <div className="course-header-svg">
                        <PasteSVG onclick={() => this.setState({activeCourseButton : 4})} />
                        <PlusSVG onclick={ () =>  this.setState({activeCourseButton: 1}) } />
                        <EditSVG onclick={ () => this.setState({activeCourseButton: 2}) } />
                        <TrashSVG onclick={ () => this.setState({activeCourseButton: 3}) } deleting={false} onclose={() => {}} />
                    </div>
                </div>
                {content}
            </div>
        );
    }

    getOverlay() {
        if (this.state.editing[0] >= 0 || this.state.deleting[0] >= 0 || this.state.activeCourseButton || this.state.scheme >= 0) {
            return (
                <Overlay resetState={this.resetState} />
            );
        }
        return <></>;
    }

    getNewGroupMenu() {
        return (
            <div className={"course-group-new-menu menu" + (this.state.activeCourseButton === 1 ? "" : " hidden")}>
                <div className="popup-title">New Grade Group</div>
                <div className="course-group-new-menu-name name">
                    <div className="course-group-new-menu-name-left name-left">Name:</div>
                    <div id="course-new-group-name" className="course-group-new-menu-name-right name-right editable" contentEditable={true}>
                        {"New Group"}
                    </div>
                </div>
                <div className="course-group-new-menu-buttons buttons">
                    <div className="course-group-new-menu-buttons-submit" onClick={this.newGroupSubmit}>Submit</div>
                    <div className="course-group-new-menu-buttons-cancel" onClick={this.resetState}>Cancel</div>
                </div>
            </div>
        );
    }

    getSchemeList() {
        let content = [];
        for (let i = 0; i < this.props.course.schemeCount; i++) {
            content.push(
                <div className="course-scheme-list-menu-row">
                    <div className={"course-scheme-list-menu-row-text" + (i === this.props.course.maxSchemeInd ? " active-scheme" : "")}>{`Scheme ${i+1}`}</div>
                    <div className="course-scheme-list-menu-row-svg">
                        <EditSVG onclick={() => this.setState({scheme: i, activeCourseButton: 0})} />
                        <TrashSVG onclick={() => {this.props.course.deleteScheme(i); this.setState({activeCourseButton: 2})}} deleting={false} onclose={() => {}} />
                    </div>
                </div>
            );
        }
        return (
            <div className={"course-scheme-list-menu menu" + (this.state.activeCourseButton === 2 ? "" : " hidden")}>
                <div className="popup-title">
                    Grading Schemes
                    <PlusSVG onclick={() => {this.props.course.newScheme({}); this.setState({activeCourseButton: 2})}} />
                </div>
                {content}
            </div>
        );
    }

    getSchemeInfo() {
        let content = [];
        if (this.state.scheme >= 0) {
            let sch = this.props.course.getScheme(this.state.scheme);
            let keys = this.props.course.getSchemeKeys(this.state.scheme);
            for (let i = 0; i < keys.length; i++) {
                let w = sch.getWeight(keys[i]);
                console.log(w.drop);
                for (let j = 0; j < w.weight.length; j++) {
                    content.push(
                        <div className="course-scheme-info-menu-text course-scheme-info-menu-row">
                            <div id={`scheme-${i}-group`} className="editable" contentEditable={true}>{keys[i]}</div>
                            <div id={`scheme-${i}-weight`} className="editable" contentEditable={true}>{w.weight[j]}</div>
                            <div id={`scheme-${i}-drop`} className="editable" contentEditable={true}>{w.drop[j]}</div>
                        </div>
                    )
                }
            }
        }
        for (let i = 0; i < this.state.schemeBlanks || content.length === 0; i++) {
            content.push(
                <div className="course-scheme-info-menu-text course-scheme-info-menu-row">
                    <div id={`scheme-${this.props.course.schemeCount}-group`} className="editable" contentEditable={true}></div>
                    <div id={`scheme-${this.props.course.schemeCount}-weight`} className="editable" contentEditable={true}></div>
                    <div id={`scheme-${this.props.course.schemeCount}-drop`} className="editable" contentEditable={true}></div>
                </div>
            );
        }
        return (
            <div className={"course-scheme-info-menu menu" + (this.state.scheme === -1 ? " hidden" : "")}>
                <div className={"popup-title"}>
                    <div>{`Scheme ${this.state.scheme + 1}`}</div>
                    <PlusSVG onclick={() => this.setState({schemeBlanks: this.state.schemeBlanks ? this.state.schemeBlanks + 1 : 2})} />
                </div>
                <div className="course-scheme-info-menu-header course-scheme-info-menu-row">
                    <div className="course-scheme-info-menu-group">Group</div>
                    <div className="course-scheme-info-menu-weight">Weight</div>
                    <div className="course-scheme-info-menu-drop">Drop</div>
                </div>
                {content}
                <div className="course-scheme-info-menu-buttons buttons">
                    <div className="course-scheme-info-menu-buttons-submit submit" onClick={this.schemeSubmit}>Submit</div>
                    <div className="course-scheme-info-menu-buttons-cancel cancel" onClick={this.resetState}>Cancel</div>
                </div>
            </div>
        );
    }

    getEditMenu() {
        return (
            <div className={"course-group-grade-edit-menu menu" + (this.state.editing[1] === -1 ? " hidden" : "")}>
                <div className="popup-title">Edit Grade</div>
                <div className="course-group-grade-edit-menu-name name">
                    <div className="course-group-grade-edit-menu-name-left name-left">Name:</div>
                    <div className="course-group-grade-edit-menu-name-right name-right editable" contentEditable={true}>
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
                                    if (this.badKey(e.key) && !(e.key.toLowerCase() === 'a' && e.ctrlKey)) {
                                        e.preventDefault();
                                    } else if (!this.deleteKey(e.key) && !(e.key.toLowerCase() === 'a' && e.ctrlKey) && (document.getElementById('course-group-grade-edit-menu-grade-right-earned')?.textContent?.length || 0) >= 6) {
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
                                    if (this.badKey(e.key) && !(e.key === 'a' && e.ctrlKey)) {
                                        e.preventDefault();
                                    }
                                    else if (!this.deleteKey(e.key) && !e.key.startsWith('Arrow') && !(e.key === 'a' && e.ctrlKey) && (document.getElementById('course-group-grade-edit-menu-grade-right-possible')?.textContent?.length || 0) >= 6) {
                                        e.preventDefault();
                                    }
                                }
                            }
                        >
                            {this.props.course.getGradeGroup(this.state.editing[0])?.getGrade(this.state.editing[1])?.ptsPossible || ""}
                        </div>
                    </div>
                </div>
                <div className="course-group-grade-edit-menu-buttons buttons">
                    <div className="course-group-grade-edit-menu-buttons-submit submit" onClick={this.gradeSubmit}>Submit</div>
                    <div className="course-group-grade-edit-menu-buttons-cancel cancel" onClick={this.resetState}>Cancel</div>
                </div>
            </div>
        );
    }

    badKey(key: string) {
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
        if (this.state.activeCourseButton === 3) { // deleting Course
            return <DeleteConfirmationMenu onconfirm={this.props.deleteCourse} oncancel={this.resetState} hidden={false} />
        }
        if (this.state.deleting[0] >= 0 && this.state.deleting[1] === -1) { // deleting GradeGroup
            return <DeleteConfirmationMenu onconfirm={this.deleteGradeGroup} oncancel={this.resetState} hidden={false} />
        }
        return <DeleteConfirmationMenu onconfirm={this.deleteGrade} oncancel={this.resetState} hidden={this.state.deleting[0] === -1} />
    }

    getFinalCalculatorMenu() {
        return (
            <div className={"course-final-calculator-menu menu" + (this.state.activeCourseButton === 4 ? "" : " hidden")}>
                <div className={"popup-title"}>Final Grade Needed For...</div>
                <div className={"course-final-calculator-menu-row"}>
                    <div className={"course-final-calculator-menu-left"}>90</div>
                    <div className={"course-final-calculator-menu-right"}>{this.props.course.getFinalNeededFor(90)}</div>
                </div>
                <div className={"course-final-calculator-menu-row"}>
                    <div className={"course-final-calculator-menu-left"}>80</div>
                    <div className={"course-final-calculator-menu-right"}>{this.props.course.getFinalNeededFor(80)}</div>
                </div>
                <div className={"course-final-calculator-menu-row"}>
                    <div className={"course-final-calculator-menu-left editable"} contentEditable={true} onKeyDown={
                        e => { if (this.badKey(e.key)) { e.preventDefault(); }
                    }} onInput={_ => {
                        document.querySelector('.course-final-calculator-menu-set')!.textContent =
                            this.props.course.getFinalNeededFor(Number.parseFloat(document.querySelector('.course-final-calculator-menu-left.editable')!.textContent!));
                    }}>70</div>
                    <div className={"course-final-calculator-menu-right course-final-calculator-menu-set"}>{this.props.course.getFinalNeededFor(70)}</div>
                </div>
            </div>
        );
    }

    newGroupSubmit() {
        let namePrefix: string = "course-group-new-menu-";
        this.props.course.addGradeGroup(new GradeGroup(
            document.getElementsByClassName(namePrefix + "name-right")?.item(0)?.textContent || "",
            []
        ));
        this.props.commit();
        this.resetState();
    }

    gradeSubmit() {
        let namePrefix: string = "course-group-grade-edit-menu-";
        let gradeObj: Grade = this.props.course.getGradeGroup(this.state.editing[0]).getGrade(this.state.editing[1]);
        gradeObj.name = document.getElementsByClassName(namePrefix + "name-right")?.item(0)?.textContent || gradeObj.name;
        gradeObj.ptsPossible = +(document.getElementById(namePrefix + "grade-right-possible")?.textContent || gradeObj.ptsPossible);
        gradeObj.ptsEarned = +(document.getElementById(namePrefix + "grade-right-earned")?.textContent || gradeObj.ptsEarned);
        this.props.commit();
        this.resetState();
    }
    
    schemeSubmit() {
        let rows = document.getElementsByClassName("course-scheme-info-menu-text");
        let newScheme: { [name: string]: {weight: number[], drop: number[]}} = {};
        for (let r of rows) {
            let n = r.children[0].textContent;
            let w = r.children[1].textContent;
            let d = r.children[2].textContent;
            if (n && w && d) {
                if (newScheme[n]) {
                    newScheme[n].weight.push(+w);
                    newScheme[n].drop.push(+d);
                } else {
                    newScheme[n] = {
                        weight: [+w],
                        drop: [+d]
                    }
                }
            }
        }
        this.props.course.getScheme(this.state.scheme).updateScheme(newScheme);
        this.props.commit();
        this.resetState();
    }

    deleteGrade() {
        this.props.course.getGradeGroup(this.state.deleting[0]).deleteGrade(this.state.deleting[1]);
        this.props.commit();
        this.resetState();
    }

    deleteGradeGroup() {
        this.props.course.removeGradeGroup(this.state.deleting[0]);
        this.props.commit();
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

        let weightedAvg = 0;
        let totalWeight = 0;
        let weights = this.props.course.getScheme(this.props.course.maxSchemeInd)?.getWeight(group.name);
        if (weights) {
            for (let i = 0; i < weights.weight.length; i++) {
                weightedAvg += group.avgWithDrop(weights.drop[i]) * weights.weight[i];
                totalWeight += weights.weight[i];
            }
            weightedAvg /= totalWeight;
        }
        return (
            <details className="course-group">
                <summary className="course-group-header">
                    <div className="course-group-header-name">{group.name}</div>
                    <div className="course-group-header-right">
                        <div className="course-group-header-avg">{`${(100 * weightedAvg || 100 * group.avgWithDrop(weights?.drop[0] || 0)).toFixed(2)}%`}</div>
                        <div className="course-group-header-svg" onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault() /* Prevent <summary> from opening */}>
                            <PlusSVG onclick={() => { this.setState({editing: [n, group.gradeCount]}); }} />
                            <TrashSVG deleting={false} onclick={() => this.setState({deleting: [n, -1]})} onclose = {() => {}}/>
                        </div>
                    </div>
                </summary>
                {content}
            </details>
        );
    }

    resetState() {
        // clear the forms
        this.setState({
            deleting: [-1, -1],
            editing: [-1, -1],
            activeCourseButton: 0,
            scheme: -1,
            schemeBlanks: 0
        });
        let newGroupName = document.getElementById("course-new-group-name")
        if (newGroupName) {
            newGroupName.textContent = "New Group";
        }
    }

}
