import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { vedtaksperioderTilVisningState } from '../state/notater';

export const useSetVedtaksperiodeReferanserForNotater = (vedtaksperiodeIder: string[]) => {
    const setNotatVedtaksperioder = useSetRecoilState(vedtaksperioderTilVisningState);

    useEffect(() => {
        setNotatVedtaksperioder(vedtaksperiodeIder);
    }, [JSON.stringify(vedtaksperiodeIder)]);
};
