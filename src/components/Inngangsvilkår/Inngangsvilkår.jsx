import React from 'react';
import './Inngangsvilkår.css';
import Personinfo from '../widgets/Personinfo';
import { Panel } from 'nav-frontend-paneler';

const Inngangsvilkår = () => {
    return (
        <div>
            <Personinfo />

            <Panel border>Innhold her --></Panel>
        </div>
    );
};

export default Inngangsvilkår;
