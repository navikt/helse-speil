import React, { useContext, useState } from 'react';
import ListItem from '../../components/ListItem';
import Subheader from '../../components/Subheader';
import SubheaderWithList from '../../components/SubheaderWithList';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import TidligerePerioderModal from './TidligerePerioderModal';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { toDate } from '../../utils/date';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import { toKronerOgØre } from '../../utils/locale';
import './Inngangsvilkår.less';
import VisDetaljerKnapp from '../../components/VisDetaljerKnapp';
import styled from '@emotion/styled';
import Grid from '../../components/Grid';
import Varsel from '@navikt/helse-frontend-varsel';

const Toppvarsel = styled(Varsel)`
    border-radius: 0;
`;

const Container = styled(Grid)`
    margin: 0 2rem;
`;

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

const Inngangsvilkår = () => {
    const { inngangsvilkår, sykepengegrunnlag } = useContext(PersonContext).aktivVedtaksperiode!;
    const [visDetaljerModal, setVisDetaljerModal] = useState(false);
    const detaljerKnapp = <VisDetaljerKnapp onClick={() => setVisDetaljerModal(true)} />;

    if (!inngangsvilkår) return null;

    return (
        <>
            <Toppvarsel text="Enkelte inngangsvilkår må vurderes manuelt" type="advarsel" />
            <Container kolonner={2}>
                <Panel>
                    <Subheader label="Arbeidsuførhet må vurderes manuelt" ikontype="advarsel" />
                    <Subheader label="Medlemskap må vurderes manuelt" ikontype="advarsel" />
                    <SubheaderWithList label="Under 70 år" iconType="ok">
                        <ListItem label="Alder">
                            {inngangsvilkår.alderISykmeldingsperioden}
                        </ListItem>
                    </SubheaderWithList>
                    <SubheaderWithList
                        label="Søknadsfrist"
                        iconType={inngangsvilkår.søknadsfrist.innen3Mnd ? 'ok' : 'advarsel'}
                    >
                        <ListItem label="Sendt NAV">
                            {toDate(inngangsvilkår.søknadsfrist.sendtNav!)}
                        </ListItem>
                        <ListItem label="Siste sykepengedag">
                            {toDate(inngangsvilkår.søknadsfrist.søknadTom!)}
                        </ListItem>
                        <ListItem label="Innen 3 mnd">
                            {inngangsvilkår.søknadsfrist.innen3Mnd ? 'Ja' : 'Nei'}
                        </ListItem>
                    </SubheaderWithList>

                    {inngangsvilkår.opptjening ? (
                        <SubheaderWithList
                            label="Opptjeningstid"
                            iconType={inngangsvilkår.opptjening.harOpptjening ? 'ok' : 'advarsel'}
                        >
                            <ListItem label="Første sykdomsdag">
                                {toDate(inngangsvilkår.dagerIgjen.førsteFraværsdag)}
                            </ListItem>
                            <ListItem label="Opptjening fra">
                                {inngangsvilkår.opptjening.opptjeningFra || '-'}
                            </ListItem>
                            <ListItem label="Antall dager (>28)">
                                {`${inngangsvilkår.opptjening.antallOpptjeningsdagerErMinst}`}
                            </ListItem>
                        </SubheaderWithList>
                    ) : (
                        <Subheader label="Opptjening må vurderes manuelt" ikontype="advarsel" />
                    )}
                </Panel>
                <Panel>
                    <SubheaderWithList label="Krav til minste sykepengegrunnlag" iconType="ok">
                        <ListItem label="Sykepengegrunnlaget">
                            {`${toKronerOgØre(sykepengegrunnlag.årsinntektFraInntektsmelding!)} kr`}
                        </ListItem>
                        <Normaltekst>{`0,5G er ${toKronerOgØre(99858 / 2)} kr`}</Normaltekst>
                    </SubheaderWithList>
                    <SubheaderWithList label="Dager igjen" iconType="ok" labelProp={detaljerKnapp}>
                        <ListItem label="Første fraværsdag">
                            {toDate(inngangsvilkår.dagerIgjen.førsteFraværsdag)}
                        </ListItem>
                        <ListItem label="Første sykepengedag">
                            {inngangsvilkår.dagerIgjen.førsteSykepengedag
                                ? toDate(inngangsvilkår.dagerIgjen.førsteSykepengedag)
                                : 'Ikke funnet'}
                        </ListItem>
                        <ListItem label="Yrkesstatus">Arbeidstaker</ListItem>
                        <ListItem label="Dager brukt">
                            {inngangsvilkår.dagerIgjen.dagerBrukt}
                        </ListItem>
                        <ListItem label="Dager igjen">
                            {248 - inngangsvilkår.dagerIgjen.dagerBrukt}
                        </ListItem>
                        <ListItem label="Maks dato">
                            {toDate(inngangsvilkår.dagerIgjen.maksdato)}
                        </ListItem>
                    </SubheaderWithList>

                    {visDetaljerModal && (
                        <TidligerePerioderModal
                            perioder={inngangsvilkår.dagerIgjen.tidligerePerioder}
                            onClose={() => setVisDetaljerModal(false)}
                            førsteFraværsdag={inngangsvilkår.dagerIgjen.førsteFraværsdag}
                        />
                    )}
                </Panel>
            </Container>
            <Container>
                <Subheader label="Yrkesskade må vurderes manuelt" ikontype="advarsel" />
            </Container>
            <Footer previous={pages.SYKMELDINGSPERIODE} next={pages.INNTEKTSKILDER} />
        </>
    );
};

export default Inngangsvilkår;
