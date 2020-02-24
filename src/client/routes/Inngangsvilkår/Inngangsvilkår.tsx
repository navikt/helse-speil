import React, { useContext, useState } from 'react';
import Vilkårsgruppe from '../../components/Vilkårsgruppe';
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
import Vilkårsgrupperad from '../../components/Vilkårsgruppe/Vilkårsgrupperad';

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
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const [visDetaljerModal, setVisDetaljerModal] = useState(false);
    const detaljerKnapp = <VisDetaljerKnapp onClick={() => setVisDetaljerModal(true)} />;

    if (!aktivVedtaksperiode?.inngangsvilkår) return null;

    const { inngangsvilkår, sykepengegrunnlag } = aktivVedtaksperiode;

    return (
        <>
            <Toppvarsel text="Enkelte inngangsvilkår må vurderes manuelt" type="advarsel" />
            <Container kolonner={2}>
                <Panel>
                    <Vilkårsgruppe
                        tittel="Arbeidsuførhet må vurderes manuelt"
                        paragraf="§8-4"
                        ikontype="advarsel"
                    />
                    <Vilkårsgruppe
                        tittel="Medlemskap må vurderes manuelt"
                        paragraf="§2"
                        ikontype="advarsel"
                    />
                    <Vilkårsgruppe tittel="Under 70 år" paragraf="§8-51" ikontype="ok">
                        <Vilkårsgrupperad label="Alder">
                            {inngangsvilkår.alderISykmeldingsperioden}
                        </Vilkårsgrupperad>
                    </Vilkårsgruppe>
                    <Vilkårsgruppe
                        tittel="Søknadsfrist"
                        paragraf="§8-X"
                        ikontype={inngangsvilkår.søknadsfrist.innen3Mnd ? 'ok' : 'advarsel'}
                    >
                        <Vilkårsgrupperad label="Sendt NAV">
                            {toDate(inngangsvilkår.søknadsfrist.sendtNav!)}
                        </Vilkårsgrupperad>
                        <Vilkårsgrupperad label="Siste sykepengedag">
                            {toDate(inngangsvilkår.søknadsfrist.søknadTom!)}
                        </Vilkårsgrupperad>
                        <Vilkårsgrupperad label="Innen 3 mnd">
                            {inngangsvilkår.søknadsfrist.innen3Mnd ? 'Ja' : 'Nei'}
                        </Vilkårsgrupperad>
                    </Vilkårsgruppe>

                    {inngangsvilkår.opptjening ? (
                        <Vilkårsgruppe
                            tittel="Opptjeningstid"
                            paragraf="§8-2"
                            ikontype={inngangsvilkår.opptjening.harOpptjening ? 'ok' : 'advarsel'}
                        >
                            <Vilkårsgrupperad label="Første sykdomsdag">
                                {toDate(inngangsvilkår.dagerIgjen.førsteFraværsdag)}
                            </Vilkårsgrupperad>
                            <Vilkårsgrupperad label="Opptjening fra">
                                {inngangsvilkår.opptjening.opptjeningFra || '-'}
                            </Vilkårsgrupperad>
                            <Vilkårsgrupperad label="Antall dager (>28)">
                                {`${inngangsvilkår.opptjening.antallOpptjeningsdagerErMinst}`}
                            </Vilkårsgrupperad>
                        </Vilkårsgruppe>
                    ) : (
                        <Vilkårsgruppe
                            tittel="Opptjening må vurderes manuelt"
                            ikontype="advarsel"
                            paragraf="§8-2"
                        />
                    )}
                </Panel>
                <Panel>
                    <Vilkårsgruppe
                        tittel="Krav til minste sykepengegrunnlag"
                        paragraf="§8-X"
                        ikontype="ok"
                    >
                        <Vilkårsgrupperad label="Sykepengegrunnlaget">
                            {`${toKronerOgØre(sykepengegrunnlag.årsinntektFraInntektsmelding!)} kr`}
                        </Vilkårsgrupperad>
                        <Normaltekst>{`0,5G er ${toKronerOgØre(99858 / 2)} kr`}</Normaltekst>
                    </Vilkårsgruppe>
                    <Vilkårsgruppe tittel="Dager igjen" paragraf="§8-11" ikontype="ok">
                        <Vilkårsgrupperad label="Første fraværsdag">
                            {toDate(inngangsvilkår.dagerIgjen.førsteFraværsdag)}
                        </Vilkårsgrupperad>
                        <Vilkårsgrupperad label="Første sykepengedag">
                            {inngangsvilkår.dagerIgjen.førsteSykepengedag
                                ? toDate(inngangsvilkår.dagerIgjen.førsteSykepengedag)
                                : 'Ikke funnet'}
                        </Vilkårsgrupperad>
                        <Vilkårsgrupperad label="Yrkesstatus">Arbeidstaker</Vilkårsgrupperad>
                        <Vilkårsgrupperad label="Dager brukt">
                            {inngangsvilkår.dagerIgjen.dagerBrukt}
                        </Vilkårsgrupperad>
                        <Vilkårsgrupperad label="Dager igjen">
                            {248 - inngangsvilkår.dagerIgjen.dagerBrukt}
                        </Vilkårsgrupperad>
                        <Vilkårsgrupperad label="Maks dato">
                            {toDate(inngangsvilkår.dagerIgjen.maksdato)}
                        </Vilkårsgrupperad>
                    </Vilkårsgruppe>

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
                <Vilkårsgruppe tittel="Yrkesskade må vurderes manuelt" ikontype="advarsel" />
            </Container>
            <Footer previous={pages.SYKMELDINGSPERIODE} next={pages.INNTEKTSKILDER} />
        </>
    );
};

export default Inngangsvilkår;
