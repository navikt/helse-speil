import { Dagtype } from 'internal-types';
import React from 'react';

import { IconAnnullert } from '../../table/icons/IconAnnullert';
import { IconArbeidsdag } from '../../table/icons/IconArbeidsdag';
import { IconArbeidsgiverperiode } from '../../table/icons/IconArbeidsgiverperiode';
import { IconEgenmelding } from '../../table/icons/IconEgenmelding';
import { IconFailure } from '../../table/icons/IconFailure';
import { IconFerie } from '../../table/icons/IconFerie';
import { IconPermisjon } from '../../table/icons/IconPermisjon';
import { IconSyk } from '../../table/icons/IconSyk';

interface DagtypeIconProps {
    type: Dagtype;
}

export const DagtypeIcon = ({ type }: DagtypeIconProps) => {
    switch (type) {
        case Dagtype.Syk:
            return <IconSyk />;
        case Dagtype.Ferie:
            return <IconFerie />;
        case Dagtype.Avvist:
        case Dagtype.Foreldet:
            return <IconFailure />;
        case Dagtype.Arbeidsdag:
            return <IconArbeidsdag />;
        case Dagtype.Egenmelding:
            return <IconEgenmelding />;
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
