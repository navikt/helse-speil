import React, { useContext } from 'react';
import BehandlingerContext from '../../context/BehandlingerContext';
import './JsonView.css';

const JsonView = () => {
    const behandlingerCtx = useContext(BehandlingerContext);

    return (
        <div>
            <pre>{JSON.stringify(behandlingerCtx.state, null, 2)}</pre>
        </div>
    );
};

export default JsonView;
