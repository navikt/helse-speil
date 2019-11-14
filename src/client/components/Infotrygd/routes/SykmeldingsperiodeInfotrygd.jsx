import React, { useContext } from 'react';
import Timeline from '../../Timeline';
import { PersonContext } from '../../../context/PersonContext';
import './SykmeldingsperiodeInfotrygd.less';

const SykmeldingsperiodeInfotrygd = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <span className="SykmeldingsperiodeInfotrygd">
            <Timeline person={person} showDagsats={false} />
        </span>
    );
};

export default SykmeldingsperiodeInfotrygd;
