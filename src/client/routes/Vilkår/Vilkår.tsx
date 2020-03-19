import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import UbehandletVedtaksperiode from './UbehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Toppvarsel from '../../components/Toppvarsel';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import IkkeVurderteVilkår from './IkkeVurderteVilkår';
import Aktivitetsplikt from './Aktivitetsplikt';

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

const Innhold = styled.div`
    .delinnhold:not(:last-of-type) {
        border-bottom: 1px solid #c6c2bf;
    }
`;

const Vilkår = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.vilkår) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);

    return (
        <>
            <Innhold>
                {periodeStatus === VedtaksperiodeStatus.Behandlet ? (
                    <div className="delinnhold">
                        <BehandletVedtaksperiode
                            aktivVedtaksperiode={aktivVedtaksperiode}
                            førsteVedtaksperiode={førsteVedtaksperiode}
                        />
                    </div>
                ) : (
                    <>
                        <Toppvarsel text="Enkelte vilkår må vurderes manuelt" type="advarsel" />

                        <IkkeVurderteVilkår className="delinnhold" />
                        <div className="delinnhold">
                            {periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                                <UbehandletVedtaksperiode aktivVedtaksperiode={aktivVedtaksperiode} />
                            ) : (
                                <PåfølgendeVedtaksperiode
                                    aktivVedtaksperiode={aktivVedtaksperiode}
                                    førsteVedtaksperiode={førsteVedtaksperiode}
                                />
                            )}
                        </div>
                    </>
                )}
                <Aktivitetsplikt className="delinnhold" />
            </Innhold>
            <Footer />
        </>
    );
};

export default Vilkår;
