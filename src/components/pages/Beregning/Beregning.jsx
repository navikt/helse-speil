import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import ItemMapper from '../../../datamapping/beregningMapper';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { beregningstekster } from '../../../tekster';
import ListRow from '../../widgets/rows/ListRow';
import IconRow from '../../widgets/rows/IconRow';
import { toKroner } from '../../../utils/locale';

const Beregning = withBehandlingContext(({ behandling }) => {
    return (
        <Panel border className="Beregning">
            <Undertittel className="panel-tittel">
                {beregningstekster('tittel')}
            </Undertittel>
            {/* TODO: send inn riktig beløp til inntektsmeldingbolken */}
            <ListRow
                label={beregningstekster('inntektsmeldinger')}
                items={ItemMapper.inntektsmelding([321000])}
            />
            <ListRow
                label={beregningstekster('aordningen')}
                items={ItemMapper.aordning(
                    behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
                        .sykepengegrunnlagNårTrygdenYter.fastsattVerdi
                )}
                bold
            />
            {/* TODO: send inn riktig avvik til titleValue */}
            <IconRow label={beregningstekster('avvik')} value={'100 %'} bold />
            <IconRow
                label={beregningstekster('sykepengegrunnlag')}
                value={`${toKroner(321000)} kr`}
                bold
            />
            <IconRow
                label={beregningstekster('dagsats')}
                value={`${toKroner(behandling.beregning.dagsats)} kr`}
                bold
            />
            <Navigasjonsknapper previous="/inngangsvilkår" next="/periode" />
        </Panel>
    );
});

export default Beregning;
