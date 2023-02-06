import { Component, MouseEventHandler } from 'react';
import Grade from './Grade';
import GradeGroup from './GradeGroup';
import TopBar from './TopBar';
import CourseBubble from './CourseBubble';
import Sidebar from './Sidebar';
import GradeDetails from './GradeDetails';
import GradingScheme from './GradingScheme';
import EditSchemePopup from './EditSchemePopup';
import StorageManager from './StorageManager';
import { CourseGroupsData } from './DataInterfaces';

interface IState {
    popup: string,
    activeGroup: number,
    activeCourse: number,
    activeScheme: number
}

class App extends Component<{}, IState> {
    private courseGroups: Array<{title: string, courses: Array<GradingScheme>}>;
    private storageManager: StorageManager;

    constructor(props: {}) {
        super(props);

        this.storageManager = StorageManager.getObj();
        
        this.courseGroups = this.load();
        //this.courseGroups.unshift(getSpringSample());
        //this.courseGroups.unshift(getFallSample());

        this.state = {
            popup: "none",
            activeGroup: this.courseGroups.length > 0 ? 0 : -1,
            activeCourse: -1,
            activeScheme: -1,
        };

        this.getNewPopup = this.getNewPopup.bind(this);
        this.getConfirmationPopup = this.getConfirmationPopup.bind(this);
        this.getEditGradePopup = this.getEditGradePopup.bind(this);
        this.getEditSchemePopup = this.getEditSchemePopup.bind(this);
        this.getSchemeList = this.getSchemeList.bind(this);
        this.clickScheme = this.clickScheme.bind(this);
        this.getContent = this.getContent.bind(this);
        this.getCourseBubbles = this.getCourseBubbles.bind(this);
        this.addCourseGroup = this.addCourseGroup.bind(this);
        this.removeCourseGroup = this.removeCourseGroup.bind(this);
        this.addCourse = this.addCourse.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        this.addGradeGroup = this.addGradeGroup.bind(this);
        this.deleteGrade = this.deleteGrade.bind(this);
        this.activatePopup = this.activatePopup.bind(this);
        this.deactivatePopup = this.deactivatePopup.bind(this);
        this.confirm = this.confirm.bind(this);
        this.editGrade = this.editGrade.bind(this);
        this.addGrade = this.addGrade.bind(this);
        this.toJSON = this.toJSON.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);
    }

    /**
     * Returns currently active GradeScheme
     */
    get activeCourse(): GradingScheme {
        return this.courseGroups[this.state.activeGroup].courses[this.state.activeCourse];
    }

    /**
     * Returns a popoup div with a single Name input
     *
     * @param click Create button click event
     * @param id div id suffix string
     * @param text Popup header text
     */
    getNewPopup(click: MouseEventHandler, id: string, text: string) {
        return (
            <div className="popup" id={`popup-${id}`}>
                <div className="popup-header">{text}</div>
                <input className="popup-input popup-new-input" id={`popup-${id}-input`} type="text" placeholder="Name" />
                <div className="popup-submit" id={`popup-${id}-submit`} onClick={click}>Create</div>
            </div>

        );
    }

    /**
     * Returns confirmation popup
     */
    getConfirmationPopup() {
        return (
            <div className="popup" id="popup-confirm">
                <div className="popup-header">Are you sure?</div>
                <div className="popup-flex-wrapper">
                    <div className="popup-submit" id="popup-confirm-submit">Yes</div>
                    <div className="popup-submit" id="popup-confirm-cancel" onClick={this.deactivatePopup}>Cancel</div>
                </div>
            </div>

        );
    }

    /**
     * Return blank edit grade popup
     */
    getEditGradePopup() {
        return (
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
        );
    }

    /**
     * Returns EditSchemePopup for currently active course, or nothing if no course is active
     */
    getEditSchemePopup(schemeID: number) {
        if (this.state.activeCourse < 0) {
            return <></>;
        }
        return <EditSchemePopup
            activeCourse={this.activeCourse}
            schemeID={schemeID}
            deactivatePopup={this.deactivatePopup}
        />
    }

    /**
     * Returns grading scheme selection popup
     * Generates a row per grading scheme
     */
    getSchemeList() {
    let content: JSX.Element[] = [];
        for (let i = 0; i < this.activeCourse.numGradingSchemes; i++) {
            content.push(
                <div className="popup-flex-wrapper">
                    <div className={this.activeCourse.maxWeight === i ? "popup-label active-scheme" : "popup-label"}>{`Grading Scheme ${i+1}`}</div>
                    <svg className="popup-list-scheme-edit-svg" viewBox="0 0 24 24" onClick={() => this.clickScheme(i)} >
                        <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                    </svg>
                </div>
            );
        }
        return (
            <div className="popup" id="popup-list-scheme">
                <div className="popup-flex-wrapper">
                    <div className="popup-header">Grading Schemes</div>
                    <svg id="popup-list-schemes-plus-svg" viewBox="0 0 24 24" onClick={() => {this.activeCourse.addGradingScheme({"": 0}, {"": 0}); this.setState({});}}>
                        <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </div>
                {content}
            </div>
        );
    }

    /**
     * Opens grading scheme popup
     */
    clickScheme(schemeID: number) {
        (document.querySelector('#popup-list-scheme') as HTMLElement).classList.remove('active');
        this.setState({ activeScheme: schemeID });
        (document.querySelector('#popup-edit-scheme') as HTMLElement).classList.add('active');
    }

    /**
     * React render method
     */
    render() {
        return (
            <div className="App">
                <div id="overlay" onClick={this.deactivatePopup}></div>
                {this.getNewPopup(this.addCourseGroup, "new-course-group", "New Course Group")}
                {this.getNewPopup(this.addCourse, "new-course", "New Course")}
                {this.getNewPopup(this.addGradeGroup, "new-grade-group", "New Grade Group")}
                {this.getNewPopup(() => {}, "new-grade", "New Grade")}
                {this.getConfirmationPopup()}
                {this.getEditGradePopup()}
                {this.state.activeCourse >= 0 ? this.getSchemeList() : <></>}
                {this.state.activeScheme >= 0 ? this.getEditSchemePopup(this.state.activeScheme) : <></>}
                <Sidebar
                    add={() => this.activatePopup('new-course-group')}
                    remove={this.removeCourseGroup}
                    groupList={this.courseGroups.map(a => a.title)}
                    activeGroup={this.state.activeGroup}
                    changeActiveGroup={(id: number) => this.setState({ activeGroup: id, activeCourse: -1 })}
                />
                <div className="right-side">
                    <TopBar
                        onReturn={() => this.setState({ activeCourse: -1 })}
                        deleteCourse={this.removeCourse}
                    />
                    {this.getContent()}
                </div>
            </div>
        );
    }

    /**
     * Returns bottom right main content 
     */
    getContent() {
        if (this.state.activeCourse >= 0) {
            return (
                <div id="main-content">
                    <GradeDetails
                        add={() => this.activatePopup('new-grade-group')}
                        remove={(groupID: number) => this.removeGradeGroup(this.state.activeCourse, groupID)}
                        course={this.courseGroups[this.state.activeGroup].courses[this.state.activeCourse]}
                        addGrade={(i: number) => {
                            this.activatePopup('new-grade');
                            let popup = document.querySelector('#popup-new-grade-submit');
                            (popup as HTMLElement).onclick = () => this.addGrade(i);
                        }}
                        deleteGrade={this.deleteGrade}
                        editGrade={this.editGrade}
                        editSchemes={() => this.activatePopup('list-scheme')}
                    />
                </div>
            );
        }
        if (this.state.activeGroup >= 0) {
            return (
                <div id="bubbles">
                    {this.getCourseBubbles(this.state.activeGroup)}
                </div>
            );
        }
        return (
            <div id="bubbles">
                {this.state.activeGroup >= 0 ?
                    <div className="course-bubble" onClick={() => this.activatePopup('new-course')}>
                        <div className="bubble-header">Create New Course</div>
                    </div>
                    : <></>
                }
            </div>
        );
    }

    /**
     * Returns the course selection menu
     *
     * @param groupID selected GradingScheme group
     */
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
        bubbles.push(
            <div className="course-bubble" onClick={() => this.activatePopup('new-course')}>
                <div className="bubble-header">Create New Course</div>
            </div>
        );
        return bubbles;
    }

    /**
     * Gets entered name and creates new course group if not blank
     */
    addCourseGroup() {
        let name = (document.querySelector('#popup-new-course-group-input') as HTMLInputElement).value;
        (document.querySelector('#popup-new-course-group-input') as HTMLInputElement).value = '';
        if (name) {
            let newGroup = {
                title: name,
                courses: [] as GradingScheme[]
            };
            this.courseGroups.unshift(newGroup);
            this.save();
        }
        this.deactivatePopup();
        this.setState({ activeGroup: 0, activeCourse: -1 });
    }

    /**
     * Removed course group
     *
     * @param id the index of the course group to remove
     */
    removeCourseGroup(id: number) {
        this.courseGroups.splice(id, 1);
        this.save();
        if (this.state.activeGroup === id) {
            this.setState({ activeGroup: this.courseGroups.length ? 0 : -1, activeCourse: -1 });
        } else {
            this.setState({ popup: "none" });
        }
    }

    /**
     * Create new course
     */
    addCourse() {
        let name = (document.querySelector('#popup-new-course-input') as HTMLInputElement).value;
        (document.querySelector('#popup-new-course-input') as HTMLInputElement).value = '';
        if (name) {
            let newCourse = new GradingScheme(name);
            this.courseGroups[this.state.activeGroup].courses.push(newCourse);
            this.save();
        }
        this.deactivatePopup();
        this.setState({ activeCourse: this.courseGroups[this.state.activeGroup].courses.length - 1 });
    }

    /**
     * Remove course from current active Group
     */
    removeCourse() {
        this.confirm(() => {
            if (this.state.activeCourse >= 0) {
                this.courseGroups[this.state.activeGroup].courses.splice(this.state.activeCourse, 1);
                this.save();
            }
            this.deactivatePopup();
            this.setState({ activeCourse: -1 });
        });
    }

    /**
     * Gets entered name and creates new grade group for a course if not blank
     */
    addGradeGroup() {
        let name = (document.querySelector('#popup-new-grade-group-input') as HTMLInputElement).value;
        (document.querySelector('#popup-new-grade-group-input') as HTMLInputElement).value = '';
        if (name) {
            let newGroup = new GradeGroup(name);
            this.activeCourse.addGradeGroup(newGroup);
            this.save();
        }
        this.deactivatePopup();
        this.setState({ popup: "none" });
    }

    /**
     * Removes grade group with specified index from specified course
     *
     * @param activeCourse course index
     * @param groupID grade group index to remove
     */
    removeGradeGroup(activeCourse: number, groupID: number) {
        this.confirm(() => {
            (this.courseGroups[this.state.activeGroup].courses[activeCourse] as GradingScheme).removeGradeGroup(groupID);
            this.deactivatePopup();
            this.save();
            this.setState({ popup: "none" });
        });
    }

    /**
     * Removes grade from grade group
     *
     * @param groupID the index of the grade group to remove a grade from
     * @param gradeID the index of the grade to be removed
     */
    deleteGrade(groupID: number, gradeID: number) {
        this.confirm(() => {
            (this.activeCourse.gradesList[groupID] as GradeGroup).removeGrade(gradeID);
            this.deactivatePopup();
            this.save();
            this.setState({ popup: "none" });
        });
    }

    /**
     * Change the values of a specified grade
     *
     * @param groupID the index of the grade group to change 
     * @param gradeID the index of the grade to be changed
     */
    editGrade(groupID: number, gradeID: number) {
        this.activatePopup('grade');
        let grade = this.activeCourse.gradesList[groupID].gradesList[gradeID];
        let title = document.querySelector('#popup-grade-title') as HTMLInputElement;
        title.value = grade.desc;
        let earned = document.querySelector('#popup-grade-score') as HTMLInputElement;
        earned.value = '' + grade.ptsEarned;
        let max = document.querySelector('#popup-grade-max') as HTMLInputElement;
        max.value = '' + grade.ptsPossible;
        const submit = document.querySelector('#popup-grade-submit') as HTMLElement;
        submit.onclick = () => {
            if (
                   title.value
                && !isNaN(+earned.value)
                && !isNaN(+max.value)
            ) {
                let gradeObj = grade as Grade;
                gradeObj.desc = title.value;
                gradeObj.ptsEarned = +earned.value;
                console.log(earned.value, +earned.value);
                gradeObj.ptsPossible = +max.value;
                this.activeCourse.gradesList[groupID].gradesList[gradeID] = gradeObj;
                this.save();
            }
            this.deactivatePopup();
            this.setState({ popup: "none" });
        };
    }

    /**
     * Add new grade to grade group
     *
     * @param groupID the index of the grade group to add a grade to
     */
    addGrade(groupID: number) {
        let name = (document.querySelector('#popup-new-grade-input') as HTMLInputElement).value;
        (document.querySelector('#popup-new-grade-input') as HTMLInputElement).value = '';
        if (name) {
            let newGrade = new Grade(name, 0, 100);
            (this.activeCourse.gradesList[groupID] as GradeGroup).addGrade(newGrade);
            this.save();
        }
        this.deactivatePopup();
        this.setState({ popup: "none" });
    }

    /**
     * Makes a popup visible
     *
     * @param id the popup id suffix string to activate
     */
    activatePopup(id: string) {
        (document.querySelector(`#popup-${id}`) as HTMLElement).classList.add('active');
        (document.querySelector('#overlay') as HTMLElement).classList.add('active');
    }

    /**
     * Makes all popups invisible
     */
    deactivatePopup() {
        document.querySelectorAll('.popup').forEach(popup => {
            (popup as HTMLElement).classList.remove('active');
        });
        (document.querySelector('#overlay') as HTMLElement).classList.remove('active');
        this.setState({ activeScheme: -1 });
    }

    /**
     * Loads a confirmation box before an action
     *
     * @param callback the function to call on confirmation
     */
    confirm(callback: Function) {
        (document.querySelector('#popup-confirm') as HTMLElement).classList.add('active');
        const submit = document.querySelector('#popup-confirm-submit') as HTMLElement;
        submit.onclick = () => {
            callback();
            submit.onclick = () => {};
        };
        (document.querySelector('#overlay') as HTMLElement).classList.add('active');
    }

    /**
     * Return JSON object
     */
    toJSON() {
        let data: any = [];
        this.courseGroups.forEach(cg => {
            let schemes: any = [];
            cg.courses.forEach(s => { schemes.push(s.toJSON()) });
            data.push({
                name: cg.title,
                courses: schemes
            });
        });
        return data;
    }

    /**
     * Creates data object for localstorage
     */
    save() {
        this.storageManager.save(this.toJSON());
    }

    /**
     * Loads data from data object
     */
    load() {
        let data = this.storageManager.load();
        let out : { title: string, courses: GradingScheme[] }[] = [];
        for (let c of data) {
            let sch: GradingScheme[] = [];
            c.courses.forEach(s => {
                sch.push(GradingScheme.load(s));
            });
            out.push({
                title: c.name,
                courses: sch
            });
        }
        return out;
    }

}

/*
function getFallSample() {
    let diffyQ: GradingScheme = getDiffyQSample();
    let obdes: GradingScheme = getObDesSample();

    let fall = {
        title: "Fall '22",
        courses: [diffyQ, obdes],
    };
    return fall;
}

function getSpringSample() {
    let discrete: GradingScheme = getDiscreteSample();
    let cs: GradingScheme = getCSSample();

    let spring = {
        title: "Spring '21",
        courses: [discrete, cs]
    }
    return spring;
}

function getDiffyQSample() {
    let weights = [
        {
            Homework: 5,
            Quizzes: 30,
            Midterms: 34,
            Final: 31
        },
        {
            Homework: 5,
            Quizzes: 24,
            Midterms: 34,
            Final: 37
        },
        {
            Homework: 5,
            Quizzes: 30,
            Midterms: 17,
            Final: 37
        },
    ];
    let drops = [
        {
            Homework: 0,
            Quizzes: 0,
            Midterms: 0,
            Final: 0
        },
        {
            Homework: 0,
            Quizzes: 1,
            Midterms: 0,
            Final: 0
        },
        {
            Homework: 0,
            Quizzes: 0,
            Midterms: 1,
            Final: 0
        },
    ];
    let diffyQ: GradingScheme = new GradingScheme('DiffyQ');
    for (let i = 0; i < 3; i++) {
        diffyQ.addGradingScheme(weights[i], drops[i]);
    }
    let groups: Array<GradeGroup> = [
        new GradeGroup('Homework'),
        new GradeGroup('Quizzes'),
        new GradeGroup('Midterms'),
        new GradeGroup('Final'),
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
    groups.forEach(gg => diffyQ.addGradeGroup(gg));
    return diffyQ;
}

function getDiscreteSample() {
    let weight = {
        Participation: 8,
        Quizzes: 12,
        Homeworks: 20,
        Exams: 60,
    };
    let drop = {
        Participation: 0,
        Quizzes: 1,
        Homeworks: 1,
        Exams: 1
    };
    let discrete: GradingScheme = new GradingScheme('Discrete');
    discrete.addGradingScheme(weight, drop);
    let discretegroups: Array<GradeGroup> = [
        new GradeGroup('Participation'),
        new GradeGroup('Quizzes'),
        new GradeGroup('Homeworks'),
        new GradeGroup('Exams'),
    ];
    discretegroups[0].addGrade(new Grade('Participation', 100, 100, 1));
    let dquizzes: Array<Grade> = [
        new Grade('Quiz 1', 8, 10),
        new Grade('Quiz 2', 10, 10),
        new Grade('Quiz 3', 8, 10),
        new Grade('Quiz 4', 9, 10),
    ];
    dquizzes.forEach(g => discretegroups[1].addGrade(g));
    let dhwt = [0, 66.5, 91, 97, 97, 74.84, 96.75, 85.5, 90];
    for (let i = 1; i < dhwt.length; i++) {
        discretegroups[2].addGrade(new Grade(`Homework ${i}`, dhwt[i], 100));
    }
    discretegroups[3].addGrade(new Grade('Midterm 1', 30, 30));
    discretegroups[3].addGrade(new Grade('Midterm 2', 27, 30));
    discretegroups[3].addGrade(new Grade('Final', 0, 30));
    discretegroups.forEach(gg => discrete.addGradeGroup(gg));
    return discrete;
}

function getCSSample() {
    let weight = {
        Participation: 2,
        Homeworks: 14,
        Exams: 60,
        Final: 24,
    };
    let drop = {
        Participation: 0,
        Homeworks: 0,
        Exams: 0,
        Final: 0,
    };
    let CS: GradingScheme = new GradingScheme('Data Structures and Algorithms');
    CS.addGradingScheme(weight, drop);
    let csgroups: Array<GradeGroup> = [
        new GradeGroup('Participation'),
        new GradeGroup('Homeworks'),
        new GradeGroup('Exams'),
        new GradeGroup('Final'),
    ];
    csgroups[0].addGrade(new Grade('Participation', 100, 100));
    let cshwt = [0, 100,90,100,91,91,94,97,92,130,91];
    for (let i = 1; i < cshwt.length; i++) {
        csgroups[1].addGrade(new Grade(`Homework ${(`0` + i).slice(-2)}`, cshwt[i], 100));
    }
    csgroups[2].addGrade(new Grade('Exam 1', 98, 100));
    csgroups[2].addGrade(new Grade('Exam 2', 89, 100));
    csgroups[2].addGrade(new Grade('Exam 3', 92.5, 100));
    csgroups[3].addGrade(new Grade('Final', 90, 100));
    csgroups.forEach(gg => CS.addGradeGroup(gg));
    return CS;
}

function getObDesSample() {
    let weight = {
        "Project Setup": 2,
        Sprints: 45,
        "Peer Review": 12,
        Survey: 1,
        Participation: 5,
        "Mini-Assessments": 5,
        Midterm: 15,
        Final: 15,
    };
    let drop = {
        "Project Setup": 0,
        Sprints: 0,
        "Peer Review": 0,
        Survey: 0,
        Participation: 0,
        "Mini-Assessments": 0,
        Midterm: 0,
        Final: 0,
    };
    let obdes: GradingScheme = new GradingScheme('Objects and Design');
    obdes.addGradingScheme(weight, drop);
    let obdesgroups: Array<GradeGroup> = [
        new GradeGroup('Project Setup'),
        new GradeGroup('Sprints'),
        new GradeGroup('Peer Review'),
        new GradeGroup('Survey'),
        new GradeGroup('Participation'),
        new GradeGroup('Mini-Assessments'),
        new GradeGroup('Midterm'),
        new GradeGroup('Final')
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
    obdesgroups.forEach(gg => obdes.addGradeGroup(gg));
    return obdes;
}
*/

export default App;
