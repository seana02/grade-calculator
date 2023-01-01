import React, { Component } from 'react';
import Grade from './Grade';
import GradeGroup from './GradeGroup';
import TopBar from './TopBar';
import CourseBubble from './CourseBubble';
import Sidebar from './Sidebar';

interface IState {
    popup: string,
    activeGroup: number,
}

class App extends Component<{}, IState> {
    private courseGroups: Array<{title: string, courses: Array<GradeGroup>}>;
    //private courseList: Array<GradeGroup>;

    constructor(props: {}) {
        super(props);
        
        this.courseGroups = [];
        this.courseGroups.unshift(getSpringSample());
        this.courseGroups.unshift(getFallSample());

        //this.courseList = [];
        //this.courseList.push(getDiffyQSample());
        //this.courseList.push(getDiscreteSample());

        /*this.courseList.forEach(c => {
            console.log(c.percent);
            console.log(JSON.stringify(c));
        });*/

        this.state = {
            popup: "none",
            activeGroup: 0
        };

        this.getCourseBubbles = this.getCourseBubbles.bind(this);
        this.addCourseGroup = this.addCourseGroup.bind(this);
        this.removeCourseGroup = this.removeCourseGroup.bind(this);
        this.activatePopup = this.activatePopup.bind(this);
        this.deactivatePopup = this.deactivatePopup.bind(this);
        this.changeActiveGroup = this.changeActiveGroup.bind(this);
    }


    render() {
        return (
            <div className="App">
                <div id="overlay" onClick={this.deactivatePopup}></div>
                <div className="popup" id="popup-new-group">
                    <div className="popup-header">New Group</div>
                    <input type="text" placeholder="Name" id="popup-new-group-input" />
                    <div className="popup-submit" id="popup-new-group-submit" onClick={this.addCourseGroup}>Create</div>
                </div>
                <Sidebar
                    add={this.activatePopup}
                    remove={this.removeCourseGroup}
                    groupList={this.courseGroups.map(a => a.title)}
                    changeActiveGroup={this.changeActiveGroup}
                />
                <div className="right-side">
                    <TopBar />
                    <div id="bubbles">
                        {this.getCourseBubbles(this.state.activeGroup)}
                    </div>
                </div>
            </div>
        );
    }

    getCourseBubbles(groupID: number) {
        let bubbles: any[] = [];
        this.courseGroups[groupID].courses.forEach(category => {
            bubbles.push(<CourseBubble course={category}/>);
        });
        return bubbles;
    }

    addCourseGroup() {
        console.log((document.querySelector('#popup-new-group-input') as HTMLInputElement).value);
    }

    removeCourseGroup() {
        console.log("remove course group");
    }

    activatePopup() {
        (document.querySelector('#popup-new-group') as HTMLElement).classList.add('active');
        (document.querySelector('#overlay') as HTMLElement).classList.add('active');
    }

    deactivatePopup() {
        (document.querySelector('#popup-new-group') as HTMLElement).classList.remove('active');
        (document.querySelector('#overlay') as HTMLElement).classList.remove('active');
    }

    changeActiveGroup(id: number) {
        this.setState({ activeGroup: id });
    }

}

function getFallSample() {
    let diffyQ: GradeGroup = getDiffyQSample();
    let obdes: GradeGroup = getObDesSample();

    let fall = {
        title: "Fall '22",
        courses: [diffyQ, obdes],
    };
    return fall;
}

function getSpringSample() {
    let discrete: GradeGroup = getDiscreteSample();
    let cs: GradeGroup = getCSSample();

    let spring = {
        title: "Spring '21",
        courses: [discrete, cs]
    }
    return spring;
}

function getDiffyQSample() {
    let diffyQ: GradeGroup = new GradeGroup('DiffyQ');
    let groups: Array<GradeGroup> = [
        new GradeGroup('Homework', 5),
        new GradeGroup('Quizzes', 30),
        new GradeGroup('Midterms', 34),
        new GradeGroup('Final', 31),
    ];
    for (let i = 1; i <= 15; i++) {
        groups[0].addGrade(new Grade(`HW ${i}`, i === 8 ? 0 : 3, 3, 1));
    }
    let quiz: Array<Grade> = [
        new Grade('Quiz 1', 58, 60),
        new Grade('Quiz 2', 60, 60),
        new Grade('Quiz 3', 54, 60),
        new Grade('Quiz 4', 59, 60),
        new Grade('Quiz 5', 59, 60),
    ];
    quiz.forEach(g => groups[1].addGrade(g));
    groups[2].addGrade(new Grade('Midterm 1', 76, 80, 1));
    groups[2].addGrade(new Grade('Midterm 2', 80, 80, 1));
    groups[3].addGrade(new Grade('Final', 193, 200, 1));
    groups.forEach(gg => diffyQ.addGrade(gg));
    return diffyQ;
}

function getDiscreteSample() {
    let discrete: GradeGroup = new GradeGroup('Discrete');
    let discretegroups: Array<GradeGroup> = [
        new GradeGroup('Participation', 8),
        new GradeGroup('Quizzes', 12),
        new GradeGroup('Homeworks', 20),
        new GradeGroup('Midterms', 60),
    ];
    discretegroups[0].addGrade(new Grade('Participation', 100, 100, 1));
    let dquizzes: Array<Grade> = [
        new Grade('Quiz 1', 8, 10),
        new Grade('Quiz 2', 10, 10),
        new Grade('Quiz 4', 9, 10),
    ];
    dquizzes.forEach(g => discretegroups[1].addGrade(g));
    let dhwt = [0, 66.5, 91, 97, 97, 74.84, 96.75, 85.5, 90];
    for (let i = 2; i < dhwt.length; i++) {
        discretegroups[2].addGrade(new Grade(`Homework ${i}`, dhwt[i], 100));
    }
    discretegroups[3].addGrade(new Grade('Midterm 1', 30, 30));
    discretegroups[3].addGrade(new Grade('Midterm 2', 27, 30));
    discretegroups.forEach(gg => discrete.addGrade(gg));
    return discrete;
}

function getCSSample() {
    let CS: GradeGroup = new GradeGroup('Data Structures and Algorithms');
    let csgroups: Array<GradeGroup> = [
        new GradeGroup('Partitipation', 2),
        new GradeGroup('Homeworks', 14),
        new GradeGroup('Exams', 60),
        new GradeGroup('Final', 24),
    ];
    csgroups[0].addGrade(new Grade('Participation', 100, 100));
    let cshwt = [0, 100,90,100,91,91,94,97,92,130,91];
    for (let i = 1; i < cshwt.length; i++) {
        csgroups[1].addGrade(new Grade(`Homework ${i}`, cshwt[i], 100));
    }
    csgroups[2].addGrade(new Grade('Exam 1', 98, 100));
    csgroups[2].addGrade(new Grade('Midterm 2', 89, 100));
    csgroups[2].addGrade(new Grade('Exam 3', 92.5, 100));
    csgroups[3].addGrade(new Grade('Final', 90, 100));
    csgroups.forEach(gg => CS.addGrade(gg));
    return CS;
}

function getObDesSample() {
    let obdes: GradeGroup = new GradeGroup('Objects and Design');
    let obdesgroups: Array<GradeGroup> = [
        new GradeGroup('Project Setup', 2),
        new GradeGroup('Sprints', 45),
        new GradeGroup('Peer Review', 12),
        new GradeGroup('Survey', 1),
        new GradeGroup('Participation', 5),
        new GradeGroup('Mini-Assessments', 5),
        new GradeGroup('Midterm', 15),
        new GradeGroup('Final', 15)
    ];
    obdesgroups[0].addGrade(new Grade('Project Setup', 55, 55));
    let sprints: Array<number> = [100, 99, 98.5, 98.3];
    for (let i = 0; i < sprints.length; i++) {
        obdesgroups[1].addGrade(new Grade(`Sprint ${i + 1}`, sprints[i], 100));
    }
    obdesgroups[2].addGrade(new Grade('Peer Review', 2, 2));
    obdesgroups[3].addGrade(new Grade('Survey', 1, 1));
    obdesgroups[4].addGrade(new Grade('Participation', 92, 101));
    obdesgroups[5].addGrade(new Grade('Mini-Assessment 1', 95, 100));
    obdesgroups[5].addGrade(new Grade('Mini-Assessment 2', 95, 100));
    obdesgroups[6].addGrade(new Grade('Midterm', 95.25, 100));
    obdesgroups[7].addGrade(new Grade('Final', 103.15, 100));
    obdesgroups.forEach(gg => obdes.addGrade(gg));
    return obdes;
}


export default App;
