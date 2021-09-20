import { SpesialistPeriodetype } from 'external-types';

export const tilPeriodetype = (type: SpesialistPeriodetype): Periodetype => {
    switch (type) {
        case SpesialistPeriodetype.Forlengelse:
            return 'forlengelse';
        case SpesialistPeriodetype.Førstegangsbehandling:
            return 'førstegangsbehandling';
        case SpesialistPeriodetype.Infotrygdforlengelse:
            return 'infotrygdforlengelse';
        case SpesialistPeriodetype.OvergangFraInfotrygd:
            return 'overgangFraIt';
        case SpesialistPeriodetype.Stikkprøve:
            return 'stikkprøve';
        case SpesialistPeriodetype.RiskQa:
            return 'riskQa';
    }
};
