import { Component } from "react";
import GradeGroup from './GradeGroup';

class CourseBubble extends Component<{course: GradeGroup}, {}> {
    constructor(props: {course: GradeGroup}) {
        super(props);
    }

    render() {
        return (
            <div className="course-bubble">
                <div className="bubble-header">
                    {this.props.course.desc}
                </div>
                <div className="bubble-summary">
                    {Math.round(this.props.course.percent * 10000) / 100 + '%'}
                </div>
            </div>
        );
    }
}

export default CourseBubble;
