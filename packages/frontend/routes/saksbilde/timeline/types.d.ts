declare type GhostPeriode = import('@io/graphql').GhostPeriode;
declare type BeregnetPeriode = import('@io/graphql').BeregnetPeriode;
declare type UberegnetPeriode = import('@io/graphql').UberegnetPeriode;

declare type TimelineWindow = {
    fom: Dayjs;
    tom: Dayjs;
    label: string;
};

declare type DatePeriod = {
    fom: DateString;
    tom: DateString;
};

declare type InfotrygdPeriod = DatePeriod & {
    grad: string;
    dagsats: number;
    typetekst: string;
};

declare type TimelinePeriod = GhostPeriode | BeregnetPeriode | UberegnetPeriode | InfotrygdPeriod | DatePeriod;

declare type PeriodCategory = 'attention' | 'success' | 'error' | 'old' | 'legacy' | 'blank';

declare type PeriodState =
    | 'tilUtbetaling'
    | 'utbetalt'
    | 'oppgaver'
    | 'venter'
    | 'venterPåKiling'
    | 'avslag'
    | 'ingenUtbetaling'
    | 'kunFerie'
    | 'kunPermisjon'
    | 'feilet'
    | 'revurderingFeilet'
    | 'ukjent'
    | 'tilInfotrygd'
    | 'annullert'
    | 'tilAnnullering'
    | 'annulleringFeilet'
    | 'utbetaltAutomatisk'
    | 'tilUtbetalingAutomatisk'
    | 'revurderes'
    | 'revurdert'
    | 'revurdertIngenUtbetaling'
    | 'utenSykefravær'
    | 'utenSykefraværDeaktivert'
    | 'infotrygdUtbetalt'
    | 'infotrygdFerie'
    | 'infotrygdUkjent';
