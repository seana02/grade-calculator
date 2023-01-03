import { Component } from "react";
import GradeGroup from "./GradeGroup";
import IGrade from './IGrade';
import Grade from './Grade';

interface GDProps {
    course: GradeGroup
}

class GradeDetails extends Component<GDProps, {}> {
    constructor(props: GDProps) {
        super(props);

        this.getGroups = this.getGroups.bind(this);
    }

    render() {
        return (
            <div className="course-details">
                {this.getGroups()}
            </div>
        );
    }

    getGroups() {
        let groups: JSX.Element[] = [];

        for (let i = 0; i < this.props.course.gradesList.length; i++) {
            groups.push(
                <div className="grade-category">
                    <div className="grade-category-desc">
                        {this.props.course.gradesList[i].desc}
                    </div>
                    <div className="down-arrow">
                        <svg className="down-arrow-svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M1 3H23L12 22" />
                        </svg>
                    </div>
                </div>
            );
        }

        return groups;
    }
}

export default GradeDetails;
