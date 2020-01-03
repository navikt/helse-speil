import { useHistory } from 'react-router';
import useLinks, { pages } from '../../hooks/useLinks';
import { useContext, useEffect, useState } from 'react';
import { PersonContext } from '../../context/PersonContext';

export const useNavigateAfterSearch = () => {
    const history = useHistory();
    const links = useLinks();
    const { personTilBehandling } = useContext(PersonContext);
    const [shouldNavigate, setShouldNavigate] = useState(false);

    const doNavigate =
        personTilBehandling &&
        links &&
        shouldNavigate &&
        history.location.pathname.indexOf(pages.SYKMELDINGSPERIODE) < 0;

    useEffect(() => {
        if (doNavigate && links) {
            history.push(links[pages.SYKMELDINGSPERIODE]);
            setShouldNavigate(false);
        }
    }, [doNavigate]);

    return { setShouldNavigate };
};