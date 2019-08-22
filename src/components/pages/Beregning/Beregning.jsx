import React, { useState } from 'react';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import ItemMapper from '../../../datamapping/beregningMapper';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { beregningstekster, tekster } from '../../../tekster';
import ListRow from '../../widgets/rows/ListRow';
import IconRow from '../../widgets/rows/IconRow';
import { toKroner } from '../../../utils/locale';
import ListeSeparator from '../../widgets/ListeSeparator';
import DetaljerBoks from './DetaljerBoks';

const Beregning = withBehandlingContext(({ behandling }) => {
    const { sykepengeberegning } = behandling;

    const [visDetaljerboks, setVisDetaljerboks] = useState(false);

    const onVisDetaljerClick = () => {
        setVisDetaljerboks(true);
    };
    const onLukkDetaljerClick = () => {
        setVisDetaljerboks(false);
    };

    const detaljerLenke = (
        <a
            className="DetaljerBoks__link"
            onClick={onVisDetaljerClick}
            tabIndex={0}
        >
            {' (Vis detaljer)'}
        </a>
    );

    return (
        <Panel border className="Beregning">
            <Undertittel className="panel-tittel">
                {beregningstekster('tittel')}
            </Undertittel>
            {visDetaljerboks && (
                <DetaljerBoks
                    perioder={sykepengeberegning.utbetalingsperioder}
                    beregningsperioden={sykepengeberegning.beregningsperioden}
                    sammenligningsgrunnlag={
                        sykepengeberegning.sammenligningsgrunnlag
                    }
                    onClose={onLukkDetaljerClick}
                />
            )}
            {/* TODO: send inn riktig beløp til inntektsmeldingbolken */}
            <ListRow
                label={beregningstekster('inntektsmeldinger')}
                items={ItemMapper.inntektsmelding(
                    sykepengeberegning.inntektsmelding
                )}
            />
            <ListRow
                label={beregningstekster('aordningen')}
                labelProp={detaljerLenke}
                items={ItemMapper.aordning(behandling.sykepengeberegning)}
                bold
            />
            <IconRow
                label={beregningstekster('avvik')}
                value={`${toKroner(sykepengeberegning.avvik)} %`}
                bold
            />
            <IconRow
                label={beregningstekster('sykepengegrunnlag')}
                value={`${toKroner(sykepengeberegning.sykepengegrunnlag)} kr`}
                bold
            />
            <IconRow
                label={beregningstekster('dagsats')}
                value={`${toKroner(sykepengeberegning.dagsats)} kr`}
                bold
            />
            <ListeSeparator />
            <Element className="mvp-tittel">{tekster('mvp')}</Element>
            <IconRow label="Arbeidstaker" />
            <IconRow label="Kun 1 arbeidsforhold" />
            <IconRow label="Ingen andre ytelser" />
            <IconRow label="Ingen studier" />
            <IconRow label="Ingen utenlandsopphold" />
            <IconRow label="Ingen permisjon" />
            <IconRow label="Ikke 25% avvik" />
            <Navigasjonsknapper previous="/inngangsvilkår" next="/periode" />
        </Panel>
    );
});

export default Beregning;
