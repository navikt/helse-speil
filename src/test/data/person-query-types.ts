import { ApiArbeidsgiver, ApiBeregnetPeriode } from '@io/rest/generated/spesialist.schemas';

export type TestBehandling = ApiArbeidsgiver['behandlinger'][0];
export type TestDag = ApiBeregnetPeriode['tidslinje'][0];
