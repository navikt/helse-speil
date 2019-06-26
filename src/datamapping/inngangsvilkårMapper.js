import { item } from './mappingUtils';
import { toDate } from '../utils/date';
import { capitalize } from '../utils/locale';

const medlemskap = behandling => [
    item('Bostedsland', behandling.bostedsland.toUpperCase())
];

const opptjening = behandling => [
    item('Første sykdomsdag', toDate(behandling.førsteSykdomsdag)),
    item('Antall dager', `${behandling.antallDager}`),
    item('Startdato', toDate(behandling.startdato)),
    item('Sluttdato', behandling.sluttdato ? toDate(behandling.sluttdato) : '-')
];

const søknadsfrist = behandling => [
    item('Sendt NAV', toDate(behandling.sendtNav)),
    item('Siste sykdomsdag', toDate(behandling.sisteSykdomsdag)),
    item('Innen 3 mnd', behandling.innen3Mnd ? 'Ja' : 'Nei')
];

const dagerIgjen = behandling => [
    item('Første fraværsdag', toDate(behandling.førsteFraværsdag)),
    item('Første sykepengedag', toDate(behandling.førsteSykepengedag)),
    item('Alder', `${behandling.alder}`),
    item('Yrkesstatus', capitalize(behandling.yrkesstatus)),
    item('Tidligere perioder', behandling.tidligerePerioder.length || '-'),
    item('Max dato', toDate(behandling.maxDato))
];

export default {
    medlemskap,
    opptjening,
    søknadsfrist,
    dagerIgjen
};
