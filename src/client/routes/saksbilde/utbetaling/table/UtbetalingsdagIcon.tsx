import { Dagtype } from 'internal-types';
import React from 'react';

import { IconAnnullert } from './icons/IconAnnullert';
import { IconArbeidsdag } from './icons/IconArbeidsdag';
import { IconArbeidsgiverperiode } from './icons/IconArbeidsgiverperiode';
import { IconEgenmelding } from './icons/IconEgenmelding';
import { IconFailure } from './icons/IconFailure';
import { IconFerie } from './icons/IconFerie';
import { IconPermisjon } from './icons/IconPermisjon';
import { IconSyk } from './icons/IconSyk';

interface UtbetalingsdagIconProps {
    type: Dagtype;
}

export const UtbetalingsdagIcon = ({ type }: UtbetalingsdagIconProps) => {
    switch (type) {
        case Dagtype.Syk:
            return <IconSyk />;
        case Dagtype.Ferie:
            return <IconFerie />;
        case Dagtype.Avvist:
        case Dagtype.Foreldet:
            return <IconFailure />;
        case Dagtype.Egenmelding:
            return <IconEgenmelding />;
        case Dagtype.Arbeidsdag:
            return <IconArbeidsdag />;
        case Dagtype.Arbeidsgiverperiode:
            return <IconArbeidsgiverperiode />;
        case Dagtype.Annullert:
            return <IconAnnullert />;
        case Dagtype.Permisjon:
            return <IconPermisjon />;
        case Dagtype.Ubestemt:
        case Dagtype.Helg:
        default:
            return null;
    }
};
