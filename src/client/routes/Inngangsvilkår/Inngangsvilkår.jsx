import React, { useContext, useState } from 'react';
import IconRow from '../../components/Rows/IconRow';
import ListRow from '../../components/Rows/ListRow';
import ItemMapper from '../../datamapping/inngangsvilkårMapper';
import TidligerePerioderModal from './TidligerePerioderModal';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { inngangsvilkårtekster as tekster } from '../../tekster';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';

const Inngangsvilkår = () => {
    const { valgtBehandling } = useContext(BehandlingerContext);
    const [visDetaljerboks, setVisDetaljerboks] = useState(false);

    const detaljerKnapp = (
        <button className="vis-modal-button" onClick={() => setVisDetaljerboks(true)} tabIndex={0}>
            Vis detaljer
        </button>
    );

    return (
        <Panel border>
            <Undertittel className="panel-tittel">{tekster(`tittel`)}</Undertittel>
            {visDetaljerboks && (
                <TidligerePerioderModal
                    perioder={valgtBehandling.inngangsvilkår.dagerIgjen.tidligerePerioder}
                    onClose={() => setVisDetaljerboks(false)}
                    førsteFraværsdag={valgtBehandling.inngangsvilkår.dagerIgjen.førsteFraværsdag}
                />
            )}
            <IconRow label="Inngangsvilkår oppfylt" bold />
            <ListRow
                label="Medlemskap"
                items={ItemMapper.medlemskap(valgtBehandling.inngangsvilkår.medlemskap)}
            />
            <ListRow
                label="Opptjening"
                items={ItemMapper.opptjening(valgtBehandling.inngangsvilkår.opptjening)}
            />
            <ListRow
                label="Mer enn 0,5G"
                items={ItemMapper.merEnn05G(valgtBehandling.inngangsvilkår.merEnn05G)}
            />
            <ListRow
                label="Søknadsfrist"
                items={ItemMapper.søknadsfrist(valgtBehandling.inngangsvilkår.søknadsfrist)}
            />
            <ListRow
                label="Dager igjen"
                labelProp={detaljerKnapp}
                items={ItemMapper.dagerIgjen(valgtBehandling.inngangsvilkår.dagerIgjen)}
            />
            <ListRow
                label="Under 67 år"
                items={ItemMapper.under67År(valgtBehandling.inngangsvilkår.dagerIgjen)}
            />
            <NavigationButtons previous="/sykdomsvilkår" next="/beregning" />
        </Panel>
    );
};

export default Inngangsvilkår;
