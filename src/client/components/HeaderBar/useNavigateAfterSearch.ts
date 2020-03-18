import { useHistory } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { PersonContext } from '../../context/PersonContext';
import { Location, useNavigation } from '../../hooks/useNavigation';

export const useNavigateAfterSearch = () => {
    const history = useHistory();
    const { navigateTo } = useNavigation();
    const { personTilBehandling } = useContext(PersonContext);
    const [shouldNavigate, setShouldNavigate] = useState(false);

    const doNavigate = personTilBehandling && shouldNavigate;

    useEffect(() => {
        if (doNavigate) {
            navigateTo(Location.Sykmeldingsperiode, personTilBehandling);
            setShouldNavigate(false);
        }
    }, [doNavigate, navigateTo, personTilBehandling]);

    return { setShouldNavigate };
};
