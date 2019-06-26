import React, { useContext } from 'react';
import BehandlingerContext from '../../../context/BehandlingerContext';
import './Sykdomsvilkår.css';

const Sykdomsvilkår = () => {
    const behandlingerCtx = useContext(BehandlingerContext);

    return (
        <div>
            <pre>{JSON.stringify(behandlingerCtx.state, null, 2)}</pre>
        </div>
    );
};

export default Sykdomsvilkår;
