import { ArbeidsgiverFragment, BeregnetPeriodeFragment } from '@io/graphql';

export type TestBehandling = ArbeidsgiverFragment['behandlinger'][0];
export type TestDag = BeregnetPeriodeFragment['tidslinje'][0];
