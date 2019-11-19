import React, { useContext } from 'react';
import Row from '../components/Row/Row';
import ListItem from '../components/ListItem';
import Subheader from '../components/Subheader';
import SubheaderWithList from '../components/SubheaderWithList';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import { toKronerOgØre } from '../utils/locale';

const Inntektskilder = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling;

    return (
        <Panel className="tekstbolker">
            {inntektskilder && (
                <SubheaderWithList label="Hentet fra inntektsmeldingen">
                    <ListItem label="Beregnet månedsinntekt">{`${toKronerOgØre(
                        inntektskilder.månedsinntekt
                    )} kr`}</ListItem>
                    <ListItem label="Omregnet årsinntekt">{`${toKronerOgØre(
                        inntektskilder.årsinntekt
                    )} kr`}</ListItem>
                </SubheaderWithList>
            )}
            <Subheader label="A-ordningen må sjekkes manuelt" iconType="advarsel" />
            <Row label="Refusjon til arbeidsgiver" value={inntektskilder.refusjon} />
            <Row label="Betaler arbeidsgiverperiode" value={inntektskilder.forskuttering} />
            <NavigationButtons previous={pages.INNGANGSVILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
        </Panel>
    );
};

export default Inntektskilder;
