import React, { useState } from 'react';
import IconRow from '../../widgets/rows/IconRow';
import ListRow from '../../widgets/rows/ListRow';
import ItemMapper from '../../../datamapping/inngangsvilkårMapper';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { inngangsvilkårtekster as tekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import TidligerePerioderModal from './TidligerePerioderModal';

const Inngangsvilkår = withBehandlingContext(({ behandling }) => {
    const [visDetaljerboks, setVisDetaljerboks] = useState(false);

    const detaljerKnapp = (
        <button
            className="vis-modal-button"
            onClick={() => setVisDetaljerboks(true)}
            tabIndex={0}
        >
            {' (Vis detaljer)'}
        </button>
    );
    return (
        <Panel border>
            <Undertittel className="panel-tittel">{tekster(`tittel`)}</Undertittel>
            {visDetaljerboks && (
                <TidligerePerioderModal
                    perioder={behandling.inngangsvilkår.dagerIgjen.tidligerePerioder}
                    dagerBrukt={behandling.inngangsvilkår.dagerIgjen.dagerBrukt.antallDagerBrukt}
                    onClose={() => setVisDetaljerboks(false)}
                    førsteFraværsdag={behandling.inngangsvilkår.dagerIgjen.førsteFraværsdag}
                />
            )}
            <IconRow label="Inngangsvilkår oppfylt" bold />
            <ListRow
                label="Medlemskap"
                items={ItemMapper.medlemskap(behandling.inngangsvilkår.medlemskap)}
            />
            <ListRow
                label="Opptjening"
                items={ItemMapper.opptjening(behandling.inngangsvilkår.opptjening)}
            />
            <ListRow
                label="Mer enn 0,5G"
                items={ItemMapper.merEnn05G(
                    behandling.inngangsvilkår.merEnn05G
                )}
            />
            <ListRow
                label="Søknadsfrist"
                items={ItemMapper.søknadsfrist(
                    behandling.inngangsvilkår.søknadsfrist
                )}
            />
            <ListRow
                label="Dager igjen"
                labelProp={detaljerKnapp}
                items={ItemMapper.dagerIgjen(behandling.inngangsvilkår.dagerIgjen)}
            />
            <ListRow
                label="Under 67 år"
                items={ItemMapper.under67År(behandling.inngangsvilkår.dagerIgjen)}
            />
            <Navigasjonsknapper previous="/" next="/beregning" />
        </Panel>
    )
});

export default Inngangsvilkår;
