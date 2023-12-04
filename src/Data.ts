import Semester, { regenerateSemester } from "./Semester";

export default class Data {
    private _data: Semester[];

    constructor () {
        this._data = loadExistingData() || [];
    }

    commit() {
        console.log(JSON.stringify({data: this._data}));
        localStorage.data = JSON.stringify({data: this._data});
        //console.log("Dev data not saved");
    }

    newSemester(name: string) {
        this._data.unshift(new Semester(name, []));
        return this.getSemester(this._data.length - 1);
    }

    addSemester(sem: Semester) {
        this._data.push(sem);
    }

    getSemester(semesterID: number): Semester {
        return this._data[semesterID];
    }

    deleteSemester(semesterID: number) {
        this._data.splice(semesterID, 1);
    }

    get semesterCount() { return this._data.length; }

}


function loadExistingData() {
    if (typeof(Storage) == 'undefined' || !localStorage.data) {
        return null;
    }

    let obj = JSON.parse(localStorage.data);
    if (!obj.data) { return null; }
    let semesters: Semester[] = [];

    obj.data.forEach((semObj: any) => {
        semesters.push(regenerateSemester(semObj));
    });

    return semesters;
}

/* 
 * Structure of localstorage
 * data: [{
 *      name: Semester name,
 *      courses: [{
 *          name: Course name,
 *          schemes: [{
 *              sch: [{   
 *                  groupName: corresponding Grade Group name,
 *                  weight: number
 *              }] list of Weights
 *          }...] list of Grading Scheme objects,
 *          gradeGroups: [{
 *              name: Grade Group name,
 *              grades: [{
 *                  name: Grade name,
 *                  ptsEarned: number,
 *                  ptsPossible: number
 *              }] list of Grade objects
 *          }] list of Grade Group objects
 *      },...] list of course objects
 * }] list of schemes
 * 
*/
