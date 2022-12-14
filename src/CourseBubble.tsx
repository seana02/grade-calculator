import { Component } from "react";
import GradeGroup from './GradeGroup';

interface CBProps {
    course: GradeGroup,
    index: number
    onClick: () => void;
}

class CourseBubble extends Component<CBProps, {}> {
    constructor(props: CBProps) {
        super(props);
    }

    render() {
        return (
            <div className="course-bubble" onClick={this.props.onClick}>
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
