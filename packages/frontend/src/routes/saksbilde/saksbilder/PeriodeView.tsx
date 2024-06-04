import dynamic from 'next/dynamic';

import { onLazyLoadFail } from '@utils/error';

export const GhostPeriodeView = dynamic(() =>
    import('./GhostPeriodeView').then((res) => ({ default: res.GhostPeriodeView })).catch(onLazyLoadFail),
);
export const UberegnetPeriodeView = dynamic(() =>
    import('./UberegnetPeriodeView').then((res) => ({ default: res.UberegnetPeriodeView })).catch(onLazyLoadFail),
);
export const BeregnetPeriodeView = dynamic(() =>
    import('./BeregnetPeriodeView').then((res) => ({ default: res.BeregnetPeriodeView })).catch(onLazyLoadFail),
);
