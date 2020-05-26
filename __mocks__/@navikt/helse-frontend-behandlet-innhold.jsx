import * as React from 'react';

class BehandletInnhold extends React.Component {
    static setAppElement = (string) => null;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Behandlet innhold</p>
                {this.props.children}
            </div>
        );
    }
}

export default BehandletInnhold;
