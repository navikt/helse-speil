import React, { useContext } from 'react';
import Row from '../components/Row';
import ListItem from '../components/ListItem';
import Subheader from '../components/Subheader';
import SubheaderWithList from '../components/SubheaderWithList';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import { toKronerOgØre } from '../utils/locale';
import { Person } from '../context/types';

const Inntektskilder = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling as Person;

    return (
        <Panel className="tekstbolker">
            {inntektskilder && (
                <SubheaderWithList label="Hentet fra inntektsmeldingen">
                    <ListItem label="Beregnet månedsinntekt">
                        {`${toKronerOgØre(inntektskilder.månedsinntekt)} kr`}
                    </ListItem>
                    <ListItem label="Omregnet årsinntekt">
                        {`${toKronerOgØre(inntektskilder.årsinntekt)} kr`}
                    </ListItem>
                </SubheaderWithList>
            )}
            <Subheader label="A-ordningen må sjekkes manuelt" iconType="advarsel" />
            <Row label="Refusjon til arbeidsgiver">{inntektskilder.refusjon}</Row>
            <Row label="Betaler arbeidsgiverperiode">{inntektskilder.forskuttering}</Row>
            <NavigationButtons previous={pages.INNGANGSVILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
        </Panel>
    );
};

export default Inntektskilder;
