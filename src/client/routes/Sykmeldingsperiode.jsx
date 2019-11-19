import React, { useContext } from 'react';
import Timeline from '../components/Timeline';
import Subheader from '../components/Subheader';
import Navigasjonsknapper from '../components/NavigationButtons';
import { pages } from '../hooks/useLinks';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { sykmeldingsperiodetekster } from '../tekster';

const Sykmeldingsperiode = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <Panel className="Sykmeldingsperiode">
            {person.arbeidsgivere ? (
                <>
                    <Subheader label={sykmeldingsperiodetekster('dager')} iconType="ok" />
                    <Timeline person={person} showDagsats={false} />
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
            <Navigasjonsknapper next={pages.SYKDOMSVILKÅR} />
        </Panel>
    );
};

export default Sykmeldingsperiode;
