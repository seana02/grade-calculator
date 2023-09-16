import { Component } from "react";

interface Props {
    name: string,
    onclick: () => void
}

export default class CourseElem extends Component<Props, {}> {

    render() {
        return (
            <div className="course-block" onClick={this.props.onclick}>
                {this.props.name}
            </div>
        );
    }
}