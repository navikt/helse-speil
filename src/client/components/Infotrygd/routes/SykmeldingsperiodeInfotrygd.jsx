import React, { useContext } from 'react';
import Timeline from '../../Timeline';
import { PersonContext } from '../../../context/PersonContext';
import './SykmeldingsperiodeInfotrygd.less';

const SykmeldingsperiodeInfotrygd = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <>
            <h2>Sykmeldingsperiode</h2>
            <span className="Infotrygd__content SykmeldingsperiodeInfotrygd">
                <Timeline person={person} showDagsats={false} />
            </span>
        </>
    );
};

export default SykmeldingsperiodeInfotrygd;
