import React, { Component } from 'react';
import './App.css';
import Data from './Data';
import SemesterElem from './SemesterElem';
import CourseElem from './CourseElem';
import GradeDetails from './GradeDetails';

interface Props {

}

interface State {
  activeSemester: number,
  activeCourse: number,
}

class App extends Component<Props, State> {
  private data: Data;

  constructor (props: Props) {
    super(props);

    this.state = {
      activeSemester: 0,
      activeCourse: -1
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
  }
  
  render() {
    return (
      <div className="App">
        {this.getLeftColumn()}
        <div id="right-wrapper">
          {this.getTitleBar()}
          {this.state.activeCourse === -1 ? this.getCourses() : this.getGradeDetails()}
        </div>
      </div>
    );
  }

  getCourses() {
    let content = [];
    let semester = this.data.getSemester(this.state.activeSemester);
    for (let i = 0; i < semester.courseCount; i++) {
      content.push(
        <CourseElem
          name={semester.getCourse(i).name}
          onclick={() => this.setState({activeCourse: i})}
        />
      );
    }
    content.push(
      <CourseElem
        name={"Add New Course"}
        onclick={() => console.log("Add New Course Menu")}
      />
    )
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
      />
    );
  }

  getLeftColumn() {
    let content = [];
    for (let i = 0; i < this.data.semesterCount; i++) {
      content.push(
        <SemesterElem
          name={this.data.getSemester(i).name}
          selected={this.state.activeSemester === i}
          onclick={() => {this.setState({activeSemester: i, activeCourse: -1})}}
          key={i}
        />
      );
    }
    return (
      <div id="left-column">
        <div>Placeholder</div>
        {content}
      </div>
    );
  }

  getTitleBar() {
    return (
      <div id="title-bar">
        <div id="return-button" onClick={() => {this.setState({activeCourse: -1})}}>
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
    math2hw.newGrade(`Homework {i}`, 90 + i, 100);
  }
  second.getCourse(0).newGradeGroup("Final").newGrade("Final Exam", 97, 100);
  let chemlab = second.newCourse("Chem 101").newGradeGroup("Lab");
  for (let i = 1; i <= 4; i++) {
    chemlab.newGrade(`Lab {i}`, 100, 100);
  }
  let chemexam = second.getCourse(1).newGradeGroup("Exams");
  chemexam.newGrade("Exam 1", 90, 100);
  chemexam.newGrade("Exam 2", 80, 100);
  chemexam.newGrade("Exam 3", 85, 100);
  chemexam.newGrade("Final Exam", 88, 100);


  return data;
}