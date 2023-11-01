import React, { Component } from 'react';
import './styles/App.css';
import Data from './Data';
import SemesterElem from './SemesterElem';
import CourseElem from './CourseElem';
import GradeDetails from './GradeDetails';
import Overlay from './Overlay';
import PlusSVG from './svg/PlusSVG';
import TrashSVG from './svg/TrashSVG';
import DeleteConfirmationMenu from './DeleteConfirmationMenu';

interface Props {

}

interface State {
    activeSemester: number,
    activeCourse: number,
    adding: number,
    semesterDeleting: boolean,
    deleteConfirm: number,
}

class App extends Component<Props, State> {
    private data: Data;

    constructor(props: Props) {
        super(props);

        this.state = {
            activeSemester: 0,
            activeCourse: -1,
            adding: 0,
            semesterDeleting: false,
            deleteConfirm: -1
        };

        //this.data = new Data();
        /*
         * Dev data initialization
        */
        this.data = devData();

        this.getLeftColumn = this.getLeftColumn.bind(this);
        this.getTitleBar = this.getTitleBar.bind(this);
        this.getCourses = this.getCourses.bind(this);
        this.getGradeDetails = this.getGradeDetails.bind(this);
        this.getNewCourseMenu = this.getNewCourseMenu.bind(this);
        this.newCourseSubmit = this.newCourseSubmit.bind(this);
        this.newSemesterSubmit = this.newSemesterSubmit.bind(this);
        this.getDeleteConfirmationMenu = this.getDeleteConfirmationMenu.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    render() {
        return (
            <div className="App">
                {this.state.adding ? <Overlay resetState={this.resetState} /> : <></>}
                {this.getNewCourseMenu()}
                {this.getLeftColumn()}
                {this.getDeleteConfirmationMenu()}
                <div id="right-wrapper">
                    {this.getTitleBar()}
                    {this.state.activeCourse === -1 ? this.getCourses() : this.getGradeDetails()}
                </div>
            </div>
        );
    }

    getNewCourseMenu() {
        return (
            <div className={"semester-new-menu-name menu" + (this.state.adding ? "" : " hidden")}>
                <div className="popup-title">{this.state.adding === 1 ? "New Course" : "New Semester"}</div>
                <div className="semester-new-menu-name name">
                    <div className="semester-new-menu-name-left name-left">Name:</div>
                    <div id="semester-new-name" className="semester-new-menu-name-right name-right editable" contentEditable={true}>
                        {this.state.adding === 1 ? "New Course" : "New Semester"}
                    </div>
                </div>
                <div className="semester-new-menu-buttons buttons">
                    <div className="semester-new-menu-buttons-submit" onClick={this.state.adding === 1 ? this.newCourseSubmit : this.newSemesterSubmit}>Submit</div>
                    <div className="semester-new-menu-buttons-cancel" onClick={this.resetState}>Cancel</div>
                </div>
            </div>
        );
    }

    newCourseSubmit() {
        this.data.getSemester(this.state.activeSemester).newCourse(document.getElementById("semester-new-name")?.textContent || "");
        this.data.commit();
        this.resetState();
    }

    newSemesterSubmit() {
        this.data.newSemester(document.getElementById("semester-new-name")?.textContent || "");
        this.data.commit();
        this.resetState();
    }

    getCourses() {
        let content = [];
        let semester = this.data.getSemester(this.state.activeSemester);
        for (let i = 0; i < semester?.courseCount || 0; i++) {
            content.push(
                <CourseElem
                    name={semester.getCourse(i).name}
                    onclick={() => this.setState({ activeCourse: i })}
                />
            );
        }
        if (semester) {
            content.push(
                <CourseElem
                    name={"Add New Course"}
                    onclick={() => this.setState({ adding: 1 })}
                />
            );
        } else {
            content.push(
                <CourseElem
                    name={"Add New Semester"}
                    onclick={() => this.setState({ adding: 2 })}
                />
            );
        }
        return (
            <div className="course-list">
                {content}
            </div>
        );
    }

    getGradeDetails() {
        return (
            <GradeDetails
                course={this.data.getSemester(this.state.activeSemester).getCourse(this.state.activeCourse)}
                deleteCourse={() => {
                    this.data.getSemester(this.state.activeSemester).deleteCourse(this.state.activeCourse);
                    this.data.commit();
                    this.setState({ activeCourse: -1 });
                }}
                commit={this.data.commit}
            />
        );
    }

    getLeftColumn() {
        let content = [];
        for (let i = 0; i < this.data.semesterCount; i++) {
            content.push(
                <div className="semester-element-wrapper">
                    <SemesterElem
                        name={this.data.getSemester(i).name}
                        selected={this.state.activeSemester === i}
                        onclick={() => { this.setState({ activeSemester: i, activeCourse: -1 }) }}
                        key={i}
                    />
                    {this.state.semesterDeleting ? <TrashSVG onclick={() => this.setState({deleteConfirm: i})} onclose={() => {}} deleting={false} /> : <></>}
                </div>
            );
        }
        return (
            <div id="left-column">
                <div id="semester-svg">
                    <PlusSVG onclick={() => this.setState({adding: 2})} />
                    <TrashSVG onclick={() => this.setState({semesterDeleting:true})} onclose={() => { }} deleting={this.state.semesterDeleting} />
                </div>
                {content}
            </div>
        );
    }

    getDeleteConfirmationMenu() {
        return <DeleteConfirmationMenu onconfirm={() => {
                this.data.deleteSemester(this.state.deleteConfirm);
                this.data.commit();
                this.resetState();
            }} oncancel={this.resetState} hidden={this.state.deleteConfirm === -1} />
    }

    getTitleBar() {
        return (
            <div id="title-bar">
                <div id="return-button" onClick={() => { this.setState({ activeCourse: -1 }) }}>
                    <svg id="return-button-svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,7V11H5.83L9.41,7.41L8,6L2,12L8,18L9.41,16.58L5.83,13H21V7H19Z" />
                    </svg>
                </div>
                <div id="title-bar-text">
                    Grade Tracker
                </div>
            </div>
        );
    }

    resetState() {
        this.setState({
            activeSemester: this.state.activeSemester === this.state.deleteConfirm ? Math.max(0, this.state.activeSemester - 1) : this.state.activeSemester,
            activeCourse: -1,
            adding: 0,
            semesterDeleting: false,
            deleteConfirm: -1
        });
    }

}

export default App;


function devData() {
    let data = new Data();
    let first = data.newSemester("First");
    let mathexam = first.newCourse("Math 101").newGradeGroup("Exams");
    mathexam.newGrade("Midterm 1", 99, 100);
    mathexam.newGrade("Midterm 2", 92, 100);
    mathexam.newGrade("Final Exam", 98, 100);
    let mathhw = first.getCourse(0).newGradeGroup("Homework");
    mathhw.newGrade("Homework 1", 10, 10);
    mathhw.newGrade("Homework 2", 8, 10);
    mathhw.newGrade("Homework 3", 7, 10);
    mathhw.newGrade("Homework 4", 9, 10);
    mathhw.newGrade("Homework 5", 10, 10);
    first.getCourse(0).newScheme({
        "Exams": { drop: 0, weight: 2 },
        "Homework": { drop: 1, weight: 1 },
    });
    let englProj = first.newCourse("Engl 101").newGradeGroup("Projects");
    englProj.newGrade("Project 1", 88, 100);
    englProj.newGrade("Project 2", 93, 100);
    englProj.newGrade("Project 3", 91, 100);
    englProj.newGrade("Project 4", 99, 100);
    englProj.newGrade("Final Project", 96, 100);
    first.getCourse(1).newGradeGroup("Participation").newGrade("Participation", 100, 100);

    let second = data.newSemester("Second");
    let math2hw = second.newCourse("Math 201").newGradeGroup("Homework");
    for (let i = 1; i <= 10; i++) {
        math2hw.newGrade(`Homework ${i}`, 90 + i, 100);
    }
    second.getCourse(0).newGradeGroup("Final").newGrade("Final Exam", 97, 100);
    let chemlab = second.newCourse("Chem 101").newGradeGroup("Lab");
    for (let i = 1; i <= 4; i++) {
        chemlab.newGrade(`Lab ${i}`, 100, 100);
    }
    let chemexam = second.getCourse(1).newGradeGroup("Exams");
    chemexam.newGrade("Exam 1", 90, 100);
    chemexam.newGrade("Exam 2", 80, 100);
    chemexam.newGrade("Exam 3", 85, 100);
    chemexam.newGrade("Final Exam", 88, 100);

    return data;
}
