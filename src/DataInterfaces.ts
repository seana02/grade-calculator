export interface GradeData {
    name: string,
    ptsEarned: number,
    ptsPossible: number,
}

export interface GradeGroupData {
    name: string,
    grades: GradeData[]
}

export interface SchemeData {
    name: string,
    gradeGroups: GradeGroupData[],
    weights: {[key: string]: number}[],
    dropCounts: {[key: string]: number}[],
    numGradingSchemes: number
}

export interface CourseGroupsData {
    name: string,
    courses: SchemeData[]
}
