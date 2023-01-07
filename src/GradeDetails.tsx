import { Component } from "react";
import GradeGroup from "./GradeGroup";
import IGrade from './IGrade';
import Grade from './Grade';

interface GDProps {
    course: GradeGroup;
    deleteGrade: (groupID: number, gradeID: number) => void;
    editGrade: (groupID: number, gradeID: number) => void;
}

interface GDState {
    openCategories: boolean[]
}

class GradeDetails extends Component<GDProps, GDState> {
    constructor(props: GDProps) {
        super(props);

        let openCategories: boolean[] = [];
        for (let i = 0; i < this.props.course.gradesList.length; i++) {
            openCategories.push(false);
        }

        this.state = {
            openCategories: openCategories,
        }

        this.getGroups = this.getGroups.bind(this);
        this.getCategoryDetails = this.getCategoryDetails.bind(this);
    }

    render() {
        return (
            <div className="course-details">
                <div className="course-details-header">
                    <div className="course-details-header-title">
                        {this.props.course.desc}
                    </div>
                    <div className="course-details-header-percent">
                        {`${Math.round(this.props.course.percent * 10000) / 100}%`}
                    </div>
                </div>
                {this.getGroups()}
            </div>
        );
    }

    getGroups() {
        let groups: JSX.Element[] = [];

        for (let i = 0; i < this.props.course.gradesList.length; i++) {
            groups.push(
                <details className="grade-category">
                    <summary className="grade-category-header">
                        <div className="grade-category-header-title">
                            {this.props.course.gradesList[i].desc}
                        </div>
                        <div className="grade-category-header-percent">
                            {`${Math.round(this.props.course.gradesList[i].percent * 10000) / 100}%`}
                        </div>
                    </summary>
                    <div className="grade-category-details">
                        {this.getCategoryDetails(i)}
                    </div>
                </details>
            );
        }
        return groups;
    }

    getCategoryDetails(groupID: number) {
        let group = this.props.course.gradesList[groupID];
        let groups: JSX.Element[] = [];
        
        for (let i = 0; i < group.gradesList.length; i++) {
            groups.push(
                <div className="grade-individual">
                    <div className="grade-individual-title">
                        {group.gradesList[i].desc}
                    </div>
                    <div className="grade-individual-points">
                        {`${group.gradesList[i].ptsEarned} / ${group.gradesList[i].ptsPossible}`}
                    </div>
                    <div className="grade-individual-percent">
                        {`${(group.gradesList[i].percent * 100).toFixed(2)}%`}
                    </div>
                    <div className="grade-individual-edit" onClick={() => this.props.editGrade(groupID, i)}>
                        <svg className="grade-individual-edit-svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>
                    </div>
                    <div className="grade-individual-delete" onClick={() => this.props.deleteGrade(groupID, i)}>
                        <svg className="grade-individual-delete-svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                    </div>
                </div>
            );
        }
        return groups;
    }

}

export default GradeDetails;





