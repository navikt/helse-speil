import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import IkkeVurderteVilkår from './Vilkårsgrupper/IkkeVurderteVilkår';
import Aktivitetsplikt from './Aktivitetsplikt';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import Vilkårsvisning from './Vilkårsvisning';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import { Sykepengegrunnlag, Vilkår as VilkårData } from '../../context/types';
import Feilikon from '../../components/Ikon/Feilikon';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

const alder = (vilkår: VilkårData) => <Vilkårsgrupper.Alder alder={vilkår.alderISykmeldingsperioden} key="alder" />;
const søknadsfrist = (vilkår: VilkårData) => (
    <Vilkårsgrupper.Søknadsfrist
        innen3Mnd={vilkår.søknadsfrist?.innen3Mnd}
        sendtNav={vilkår.søknadsfrist?.sendtNav!}
        sisteSykepengedag={vilkår.søknadsfrist?.søknadTom!}
        key="søknadsfrist"
    />
);
const opptjeningstid = (vilkår: VilkårData) => (
    <Vilkårsgrupper.Opptjeningstid
        harOpptjening={vilkår.opptjening!.harOpptjening}
        førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
        opptjeningFra={vilkår.opptjening!.opptjeningFra}
        antallOpptjeningsdagerErMinst={vilkår.opptjening!.antallOpptjeningsdagerErMinst}
        key="opptjeningstid"
    />
);
const kravTilSykepengegrunnlag = (sykepengegrunnlag: Sykepengegrunnlag) => (
    <Vilkårsgrupper.KravTilSykepengegrunnlag
        sykepengegrunnlag={sykepengegrunnlag.årsinntektFraInntektsmelding!}
        key="kravtilsykepengegrunnlag"
    />
);
const dagerIgjen = (vilkår: VilkårData) => (
    <Vilkårsgrupper.DagerIgjen
        førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
        førsteSykepengedag={vilkår.dagerIgjen?.førsteSykepengedag}
        dagerBrukt={vilkår.dagerIgjen?.dagerBrukt}
        maksdato={vilkår.dagerIgjen?.maksdato}
        key="dagerigjen"
    />
);

const Vilkår = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.vilkår || personTilBehandling === undefined) return null;

    const { vilkår, sykepengegrunnlag } = aktivVedtaksperiode;
    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);

    let vurderteVilkår = [alder(vilkår)];
    const ikkeOppfylteVilkår = [];
    if (vilkår.søknadsfrist?.innen3Mnd) {
        vurderteVilkår.push(søknadsfrist(vilkår));
    } else {
        ikkeOppfylteVilkår.push(søknadsfrist(vilkår));
    }
    vurderteVilkår = [
        ...vurderteVilkår,
        opptjeningstid(vilkår),
        kravTilSykepengegrunnlag(sykepengegrunnlag),
        dagerIgjen(vilkår)
    ];

    return (
        <>
            {periodeStatus === VedtaksperiodeStatus.Behandlet && (
                <BehandletVedtaksperiode
                    aktivVedtaksperiode={aktivVedtaksperiode}
                    førsteVedtaksperiode={førsteVedtaksperiode}
                />
            )}
            {periodeStatus !== VedtaksperiodeStatus.Behandlet && (
                <>
                    {ikkeOppfylteVilkår.length > 0 && (
                        <Varsel type={Varseltype.Feil}>Vilkår er ikke oppfylt i deler av perioden</Varsel>
                    )}
                    <Varsel type={Varseltype.Advarsel}>Enkelte vilkår må vurderes manuelt</Varsel>
                    {periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                        <>
                            {ikkeOppfylteVilkår.length > 0 && (
                                <Vilkårsvisning
                                    tittel="Ikke oppfylte vilkår"
                                    ikon={<Feilikon />}
                                    vilkår={ikkeOppfylteVilkår}
                                />
                            )}
                            <IkkeVurderteVilkår />
                            <Vilkårsvisning
                                tittel="Vurderte vilkår"
                                ikon={<GrøntSjekkikon />}
                                vilkår={vurderteVilkår}
                            />
                        </>
                    ) : (
                        <>
                            <IkkeVurderteVilkår />
                            <PåfølgendeVedtaksperiode
                                aktivVedtaksperiode={aktivVedtaksperiode}
                                førsteVedtaksperiode={førsteVedtaksperiode}
                            />
                        </>
                    )}
                </>
            )}
            <Aktivitetsplikt />
            <Footer />
        </>
    );
};

export default Vilkår;
