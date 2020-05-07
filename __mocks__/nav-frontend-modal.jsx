import * as React from 'react';

class Modal extends React.Component {
    static setAppElement = string => null;

    constructor(props) {
        super(props);
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default Modal;
