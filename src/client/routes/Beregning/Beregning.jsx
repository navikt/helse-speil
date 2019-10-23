import React, { useContext, useState } from 'react';
import IconRow from '../../components/Rows/IconRow';
import ListRow from '../../components/Rows/ListRow';
import ItemMapper from '../../datamapping/beregningMapper';
import ListSeparator from '../../components/ListSeparator/ListSeparator';
import Navigasjonsknapper from '../../components/NavigationButtons';
import SykepengegrunnlagModal from './SykepengegrunnlagModal';
import { Panel } from 'nav-frontend-paneler';
import { toKroner } from '../../utils/locale';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { beregningstekster, tekster } from '../../tekster';
import { BehandlingerContext } from '../../context/BehandlingerContext';

const Beregning = () => {
    const { personTilBehandling } = useContext(BehandlingerContext);
    const { sykepengeberegning } = personTilBehandling;
    const [visDetaljerboks, setVisDetaljerboks] = useState(false);

    const detaljerKnapp = (
        <button className="vis-modal-button" onClick={() => setVisDetaljerboks(true)} tabIndex={0}>
            Vis detaljer
        </button>
    );

    return (
        <Panel className="Beregning">
            <Undertittel className="panel-tittel">{beregningstekster('tittel')}</Undertittel>
            {visDetaljerboks && (
                <SykepengegrunnlagModal
                    sammenligningsperioden={sykepengeberegning.sammenligningsperioden}
                    beregningsperioden={sykepengeberegning.beregningsperioden}
                    sammenligningsgrunnlag={sykepengeberegning.sammenligningsgrunnlag}
                    totaltIBeregningsperioden={sykepengeberegning.totaltIBeregningsperioden}
                    onClose={() => setVisDetaljerboks(false)}
                />
            )}
            {/* TODO: send inn riktig beløp til inntektsmeldingbolken */}
            <ListRow
                label={beregningstekster('inntektsmeldinger')}
                items={ItemMapper.inntektsmelding(sykepengeberegning.inntektsmelding)}
            />
            <ListRow
                label={beregningstekster('aordningen')}
                labelProp={detaljerKnapp}
                items={ItemMapper.aordning(personTilBehandling.sykepengeberegning)}
                bold
            />
            <IconRow
                label={beregningstekster('avvik')}
                value={`${sykepengeberegning.avvik.toLocaleString('nb-NO', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })} %`}
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
            <ListSeparator />
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
};

export default Beregning;
