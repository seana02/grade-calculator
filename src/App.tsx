import { Component } from 'react';
import Grade from './Grade';
import GradeGroup from './GradeGroup';
import TopBar from './TopBar';
import CourseBubble from './CourseBubble';
import Sidebar from './Sidebar';
import GradeDetails from './GradeDetails';

interface IState {
    popup: string,
    activeGroup: number,
    activeCourse: number
}

class App extends Component<{}, IState> {
    private courseGroups: Array<{title: string, courses: Array<GradeGroup>}>;

    constructor(props: {}) {
        super(props);
        
        this.courseGroups = [];
        this.courseGroups.unshift(getSpringSample());
        this.courseGroups.unshift(getFallSample());

        this.state = {
            popup: "none",
            activeGroup: 0,
            activeCourse: 0
        };

        this.getContent = this.getContent.bind(this);
        this.getCourseBubbles = this.getCourseBubbles.bind(this);
        this.addCourseGroup = this.addCourseGroup.bind(this);
        this.removeCourseGroup = this.removeCourseGroup.bind(this);
        this.deleteGrade = this.deleteGrade.bind(this);
        this.activatePopup = this.activatePopup.bind(this);
        this.deactivatePopup = this.deactivatePopup.bind(this);
        this.confirm = this.confirm.bind(this);
        this.editGrade = this.editGrade.bind(this);
    }


    render() {
        return (
            <div className="App">
                <div id="overlay" onClick={this.deactivatePopup}></div>
                <div className="popup" id="popup-new-group">
                    <div className="popup-header">New Group</div>
                    <input className="popup-input" id="popup-new-group-input" type="text" placeholder="Name" />
                    <div className="popup-submit" id="popup-new-group-submit" onClick={this.addCourseGroup}>Create</div>
                </div>
                <div className="popup" id="popup-confirm">
                    <div className="popup-header">Are you sure?</div>
                    <div className="popup-flex-wrapper">
                        <div className="popup-submit" id="popup-confirm-submit">Yes</div>
                        <div className="popup-submit" id="popup-confirm-cancel" onClick={this.deactivatePopup}>Cancel</div>
                    </div>
                </div>
                <div className="popup" id="popup-grade">
                    <div className="popup-header">Edit Grade</div>
                    <div className="popup-flex-wrapper">
                        <label className="popup-label" id="popup-grade-title-label" htmlFor="popup-grade-title">Name:</label>
                        <input className="popup-input" id="popup-grade-title" type="text" />
                    </div>
                    <div className="popup-flex-wrapper">
                        <label className="popup-label" id="popup-grade-score-label" htmlFor="popup-grade-score">Score:</label>
                        <input className="popup-input" id="popup-grade-score" type="number" placeholder="Pts Earned" />
                        <div id="popup-grade-slash">/</div>
                        <input className="popup-input" id="popup-grade-max" type="number" placeholder="Pts Possible" />
                    </div>
                    <div className="popup-flex-wrapper">
                        <div className="popup-submit" id="popup-grade-submit">Done</div>
                        <div className="popup-submit" id="popup-grade-cancel" onClick={this.deactivatePopup}>Cancel</div>
                    </div>
                </div>
                <Sidebar
                    add={this.activatePopup}
                    remove={this.removeCourseGroup}
                    groupList={this.courseGroups.map(a => a.title)}
                    activeGroup={this.state.activeGroup}
                    changeActiveGroup={(id: number) => this.setState({ activeGroup: id, activeCourse: -1 })}
                />
                <div className="right-side">
                    <TopBar onReturn={() => this.setState({ activeCourse: -1 })}/>
                    {this.getContent()}
                </div>
            </div>
        );
    }

    getContent() {
        if (this.state.activeCourse >= 0) {
            return (
                <div id="main-content">
                    <GradeDetails
                        course={this.courseGroups[this.state.activeGroup].courses[this.state.activeCourse]}
                        deleteGrade={this.deleteGrade}
                        editGrade={this.editGrade}
                    />
                </div>
            );
        }
        return (
            <div id="bubbles">
                {this.getCourseBubbles(this.state.activeGroup)}
            </div>
        );
    }

    getCourseBubbles(groupID: number) {
        if (!this.courseGroups.length) {
            return <></>;
        }
        let bubbles: any[] = [];
        for (let i = 0; i < this.courseGroups[groupID].courses.length; i++) {
            bubbles.push(
                <CourseBubble
                    course={this.courseGroups[groupID].courses[i]}
                    index={i}
                    onClick={() => this.setState({ activeCourse: i })}
                />);
        }
        return bubbles;
    }

    addCourseGroup() {
        let name = (document.querySelector('#popup-new-group-input') as HTMLInputElement).value;
        if (name) {
            let newGroup = {
                title: name,
                courses: [] as GradeGroup[]
            };
            this.courseGroups.unshift(newGroup);
        }
        this.deactivatePopup();
        this.setState({ popup: "none" });
    }

    removeCourseGroup(id: number) {
        this.courseGroups.splice(id, 1);
        this.setState({ popup: "none" });
    }

    deleteGrade(groupID: number, gradeID: number) {
        this.confirm(() => {
            (this.courseGroups[this.state.activeGroup].courses[this.state.activeCourse].gradesList[groupID] as GradeGroup).removeGrade(gradeID);
            this.deactivatePopup();
            this.setState({ popup: "none" });
        });
    }

    editGrade(groupID: number, gradeID: number) {
        (document.querySelector('#popup-grade') as HTMLElement).classList.add('active');
        (document.querySelector('#overlay') as HTMLElement).classList.add('active');
        let grade = this.courseGroups[this.state.activeGroup].courses[this.state.activeCourse].gradesList[groupID].gradesList[gradeID];
        let title = document.querySelector('#popup-grade-title') as HTMLInputElement;
        title.value = grade.desc;
        let earned = document.querySelector('#popup-grade-score') as HTMLInputElement;
        earned.value = '' + grade.ptsEarned;
        let max = document.querySelector('#popup-grade-max') as HTMLInputElement;
        max.value = '' + grade.ptsPossible;
        const submit = document.querySelector('#popup-grade-submit') as HTMLElement;
        submit.onclick = () => {
            
        };
    }

    activatePopup() {
        (document.querySelector('#popup-new-group') as HTMLElement).classList.add('active');
        (document.querySelector('#overlay') as HTMLElement).classList.add('active');
    }

    deactivatePopup() {
        (document.querySelector('#popup-new-group') as HTMLElement).classList.remove('active');
        document.querySelectorAll('.popup').forEach(popup => {
            (popup as HTMLElement).classList.remove('active');
        });
        (document.querySelector('#overlay') as HTMLElement).classList.remove('active');
    }

    confirm(callback: Function) {
        (document.querySelector('#popup-confirm') as HTMLElement).classList.add('active');
        const submit = document.querySelector('#popup-confirm-submit') as HTMLElement;
        submit.onclick = () => {
            callback();
            submit.onclick = () => {};
        };
        (document.querySelector('#overlay') as HTMLElement).classList.add('active');
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
        groups[0].addGrade(new Grade(`HW ${(`0` + i).slice(-2)}`, i === 8 ? 0 : 3, 3, 1));
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
        csgroups[1].addGrade(new Grade(`Homework ${(`0` + i).slice(-2)}`, cshwt[i], 100));
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
