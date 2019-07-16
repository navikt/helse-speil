import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import ItemMapper from '../../../datamapping/beregningMapper';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import Bolk from '../../widgets/Bolk/Bolk';
import './Beregning.css';

const Beregning = withBehandlingContext(({ behandling }) => {
    return (
        <Panel border className="Beregning">
            <Undertittel className="panel-tittel">
                Beregning av sykepengegrunnlag og dagsats
            </Undertittel>
            {/* TODO: send inn riktig beløp til inntektsmeldingbolken */}
            <Bolk
                title="Hentet fra inntektsmeldinger"
                items={ItemMapper.inntektsmelding([321000])}
                ikon={false}
            />
            <Bolk
                title="Hentet fra A-Ordningen"
                items={ItemMapper.aordning(
                    behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
                        .sykepengegrunnlagNårTrygdenYter.fastsattVerdi
                )}
                ikon={false}
            />
            {/* TODO: send inn riktig avvik til titleValue */}
            <Bolk title="Utregnet avvik" titleValue={'100 %'} ikon={false} />
            <Bolk
                title="Sykepengegrunnlag"
                titleValue={'321000 kr'}
                ikon={false}
            />

            <Navigasjonsknapper previous="/inngangsvilkår" next="/periode" />
        </Panel>
    );
});

export default Beregning;
