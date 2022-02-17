export const tilPeriodetype = (type: ExternalPeriodetype): Periodetype => {
    switch (type) {
        case 'FORLENGELSE':
            return 'forlengelse';
        case 'FØRSTEGANGSBEHANDLING':
            return 'førstegangsbehandling';
        case 'INFOTRYGDFORLENGELSE':
            return 'infotrygdforlengelse';
        case 'OVERGANG_FRA_IT':
            return 'overgangFraIt';
        case 'STIKKPRØVE':
            return 'stikkprøve';
        case 'RISK_QA':
            return 'riskQa';
        case 'REVURDERING':
            return 'revurdering';
        case 'FORTROLIG_ADRESSE':
            return 'fortroligAdresse';
        case 'UTBETALING_TIL_SYKMELDT':
            return 'utbetalingTilSykmeldt';
        case 'DELVIS_REFUSJON':
            return 'delvisRefusjon';
    }
};
