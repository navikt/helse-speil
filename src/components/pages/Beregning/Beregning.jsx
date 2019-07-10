import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import Bolk from '../../widgets/Bolk';
import { withBehandlingContext } from '../../../context/withBehandlingContext';
import ItemMapper from '../../../datamapping/beregningMapper';
import EnkelBolk from '../../widgets/EnkelBolk';

const Beregning = withBehandlingContext(({ behandling }) => {
    /* eslint-disable */
    console.log({ behandling });
    /* eslint-enable */
    return (
        <Panel border>
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
            <EnkelBolk title="Utregnet avvik" value={'100 %'} />
            <Bolk title="Sykepengegrunnlag" titleValue={'321000 kr'} />

            <Navigasjonsknapper previous="/inngangsvilkår" next="/periode" />
        </Panel>
    );
});

export default Beregning;
