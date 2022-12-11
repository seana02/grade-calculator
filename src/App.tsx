import React, { Component } from 'react';
import './App.css';
import Grade from './Grade';
import GradeGroup from './GradeGroup';

class App extends Component {
    render() {
        let diffyQ = getDiffyQSample();
        console.log(diffyQ.percent);
        console.log(JSON.stringify(diffyQ));
        
        let discrete = getDiscreteSample();
        console.log(discrete.percent);
        console.log(JSON.stringify(discrete));
        return (
            <div>Hi</div>
        );
    }
}

function getDiffyQSample() {
    let diffyQ: GradeGroup = new GradeGroup('DiffyQ');
    let groups: Array<GradeGroup> = [
        new GradeGroup('Homework', 5),
        new GradeGroup('Quiz', 30),
        new GradeGroup('Midterm', 34),
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
    groups[3].addGrade(new Grade('Final', 76, 90, 1));
    groups.forEach(gg => diffyQ.addGrade(gg));
    return diffyQ;
}

function getDiscreteSample() {
    let discrete: GradeGroup = new GradeGroup('Discrete');
    let discretegroups: Array<GradeGroup> = [
        new GradeGroup('Participation', 8),
        new GradeGroup('Quiz', 12),
        new GradeGroup('Homework', 20),
        new GradeGroup('Midterm', 60),
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


export default App;
