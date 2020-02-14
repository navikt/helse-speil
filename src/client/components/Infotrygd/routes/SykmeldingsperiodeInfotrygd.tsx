import React, { useContext } from 'react';
import { PersonContext } from '../../../context/PersonContext';
import './SykmeldingsperiodeInfotrygd.less';

const SykmeldingsperiodeInfotrygd = () => {
    const { personTilBehandling: person } = useContext(PersonContext);
    return <span className="SykmeldingsperiodeInfotrygd"></span>;
};

export default SykmeldingsperiodeInfotrygd;
