import React, { useContext } from 'react';
import Picker from '../Picker';
import { toDate } from '../../utils/date';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import './CasePicker.less';

const mapper = behandling => ({
    behandlingsId: behandling?.behandlingsId,
    fom: behandling?.originalSøknad.fom,
    tom: behandling?.originalSøknad.tom
});

const CasePicker = () => {
    const { valgtBehandling, behandlinger, velgBehandling } = useContext(BehandlingerContext);

    const itemsMapped = behandlinger?.map(mapper) ?? [];
    const currentItemMapped = mapper(valgtBehandling);

    return valgtBehandling ? (
        <Picker
            className="CasePicker"
            items={itemsMapped}
            currentItem={currentItemMapped}
            onSelectItem={velgBehandling}
            itemLabel={item => `${toDate(item.fom)} - ${toDate(item.tom)}`}
            placeholderLabel="Ingen saker for bruker"
        />
    ) : (
        <></>
    );
};

export default CasePicker;
