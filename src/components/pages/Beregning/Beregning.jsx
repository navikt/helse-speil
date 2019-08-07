import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import ItemMapper from '../../../datamapping/beregningMapper';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import Bolk from '../../widgets/Bolk/Bolk';
import { beregningstekster } from '../../../tekster';
import './Beregning.css';

const Beregning = withBehandlingContext(({ behandling }) => {
    return (
        <Panel border className="Beregning">
            <Undertittel className="panel-tittel">
                {beregningstekster('tittel')}
            </Undertittel>
            {/* TODO: send inn riktig beløp til inntektsmeldingbolken */}
            <Bolk
                title={beregningstekster('inntektsmeldinger')}
                items={ItemMapper.inntektsmelding([321000])}
                ikon={false}
            />
            <Bolk
                title={beregningstekster('aordningen')}
                items={ItemMapper.aordning(
                    behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
                        .sykepengegrunnlagNårTrygdenYter.fastsattVerdi
                )}
                ikon={false}
            />
            {/* TODO: send inn riktig avvik til titleValue */}
            <Bolk
                title={beregningstekster('avvik')}
                titleValue={'100 %'}
                ikon={false}
            />
            <Bolk
                title={beregningstekster('sykepengegrunnlag')}
                titleValue={'321000 kr'}
                ikon={false}
            />

            <Navigasjonsknapper previous="/inngangsvilkår" next="/periode" />
        </Panel>
    );
});

export default Beregning;
