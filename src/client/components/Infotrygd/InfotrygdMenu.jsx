import React from 'react';
import InfotrygdMenuItem from './InfotrygdMenuItem';

const InfotrygdMenu = () => {
    return (
        <span className="Infotrygd__content">
            <ul className="InfotrygdMenu">
                <InfotrygdMenuItem abbreviation="SP" label="Sykmeldingsperiode" />
                <InfotrygdMenuItem abbreviation="SV" label="Sykdomsvilkår" />
                <InfotrygdMenuItem abbreviation="IV" label="Inngangsvilkår" />
                <InfotrygdMenuItem abbreviation="IK" label="Inntektskilder" />
                <InfotrygdMenuItem abbreviation="SG" label="Sykepengegrunnlag" />
                <InfotrygdMenuItem abbreviation="FO" label="Fordeling" disabled />
                <InfotrygdMenuItem abbreviation="UO" label="Utbetalingsoversikt" />
                <InfotrygdMenuItem abbreviation="OS" label="Oppsummering" />
            </ul>
        </span>
    );
};

export default InfotrygdMenu;
