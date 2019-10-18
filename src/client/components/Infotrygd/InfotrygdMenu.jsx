import React from 'react';
import InfotrygdMenuItem from './InfotrygdMenuItem';

const InfotrygdMenu = () => {
    return (
        <span className="Infotrygd__content">
            <ul className="InfotrygdMenu">
                <InfotrygdMenuItem abbreviation="SV" label="Sykdomsvilkår" />
                <InfotrygdMenuItem abbreviation="IV" label="Inngangsvilkår" />
                <InfotrygdMenuItem abbreviation="SG" label="Sykepengegrunnlag" />
                <InfotrygdMenuItem abbreviation="SP" label="Sykepengeperiode" />
                <InfotrygdMenuItem abbreviation="UB" label="Utbetaling" />
                <InfotrygdMenuItem abbreviation="OS" label="Oppsummering" />
            </ul>
        </span>
    );
};

export default InfotrygdMenu;
