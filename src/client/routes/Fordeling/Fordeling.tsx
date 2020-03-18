import React from 'react';
import NavigationButtons from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';

const Fordeling = () => {
    return (
        <Panel>
            <Normaltekst>Ingen data</Normaltekst>
            <NavigationButtons />
        </Panel>
    );
};

export default Fordeling;
