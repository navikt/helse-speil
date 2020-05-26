import * as React from 'react';

class BehandletAvInfotrygd extends React.Component {
    static setAppElement = (string) => null;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Behandlet av infotrygd</p>
                {this.props.children}
            </div>
        );
    }
}

export default BehandletAvInfotrygd;
