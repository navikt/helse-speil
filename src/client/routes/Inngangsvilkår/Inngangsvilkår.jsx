import React, { useContext, useState } from 'react';
import IconRow from '../../components/Rows/IconRow';
import ListRow from '../../components/Rows/ListRow';
import ItemMapper from '../../datamapping/inngangsvilkårMapper';
import TidligerePerioderModal from './TidligerePerioderModal';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';

const Inngangsvilkår = () => {
    const { personTilBehandling } = useContext(PersonContext);
    const [visDetaljerboks, setVisDetaljerboks] = useState(false);

    const detaljerKnapp = (
        <button className="vis-modal-button" onClick={() => setVisDetaljerboks(true)} tabIndex={0}>
            Vis detaljer
        </button>
    );

    return (
        <Panel>
            {personTilBehandling.Inngangsvilkår ? (
                <>
                    {visDetaljerboks && (
                        <TidligerePerioderModal
                            perioder={
                                personTilBehandling.inngangsvilkår.dagerIgjen.tidligerePerioder
                            }
                            onClose={() => setVisDetaljerboks(false)}
                            førsteFraværsdag={
                                personTilBehandling.inngangsvilkår.dagerIgjen.førsteFraværsdag
                            }
                        />
                    )}
                    <IconRow label="Inngangsvilkår oppfylt" bold />
                    <ListRow
                        label="Medlemskap"
                        items={ItemMapper.medlemskap(personTilBehandling.inngangsvilkår.medlemskap)}
                    />
                    <ListRow
                        label="Opptjening"
                        items={ItemMapper.opptjening(personTilBehandling.inngangsvilkår.opptjening)}
                    />
                    <ListRow
                        label="Mer enn 0,5G"
                        items={ItemMapper.merEnn05G(personTilBehandling.inngangsvilkår.merEnn05G)}
                    />
                    <ListRow
                        label="Søknadsfrist"
                        items={ItemMapper.søknadsfrist(
                            personTilBehandling.inngangsvilkår.søknadsfrist
                        )}
                    />
                    <ListRow
                        label="Dager igjen"
                        labelProp={detaljerKnapp}
                        items={ItemMapper.dagerIgjen(personTilBehandling.inngangsvilkår.dagerIgjen)}
                    />
                    <ListRow
                        label="Under 67 år"
                        items={ItemMapper.under67År(personTilBehandling.inngangsvilkår.dagerIgjen)}
                    />
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
            <NavigationButtons previous="/sykmeldingsperiode" next="/inntektskilder" />
        </Panel>
    );
};

export default Inngangsvilkår;
