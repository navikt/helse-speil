import { ArbeidsgiverFragment, BeregnetPeriodeFragment, FetchPersonQuery } from '@io/graphql';

export type TestGenerasjon = ArbeidsgiverFragment['generasjoner'][0];
export type TestDag = BeregnetPeriodeFragment['tidslinje'][0];
