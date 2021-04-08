import { SpesialistPeriodetype } from 'external-types';
import { Periodetype } from 'internal-types';

export const tilPeriodetype = (type: SpesialistPeriodetype) => {
    switch (type) {
        case SpesialistPeriodetype.Forlengelse:
            return Periodetype.Forlengelse;
        case SpesialistPeriodetype.Førstegangsbehandling:
            return Periodetype.Førstegangsbehandling;
        case SpesialistPeriodetype.Infotrygdforlengelse:
            return Periodetype.Infotrygdforlengelse;
        case SpesialistPeriodetype.OvergangFraInfotrygd:
            return Periodetype.OvergangFraInfotrygd;
        case SpesialistPeriodetype.Stikkprøve:
            return Periodetype.Stikkprøve;
        case SpesialistPeriodetype.RiskQa:
            return Periodetype.RiskQa;
    }
};
