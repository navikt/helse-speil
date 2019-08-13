import { item } from './mappingUtils';
import { toDate } from '../utils/date';
import { capitalize } from '../utils/locale';

const medlemskap = behandling => [
    item('Bostedsland', behandling.bostedsland.toUpperCase())
];

const opptjening = behandling => [
    item('Første sykdomsdag', toDate(behandling.førsteSykdomsdag)),
    item('Startdato', toDate(behandling.startdato)),
    item(
        'Sluttdato',
        behandling.sluttdato ? toDate(behandling.sluttdato) : '-'
    ),
    item('Antall dager (>28)', `${behandling.antallDager}`)
];

const søknadsfrist = behandling => [
    item('Sendt NAV', toDate(behandling.sendtNav)),
    item('Siste sykdomsdag', toDate(behandling.sisteSykdomsdag)),
    item('Innen 3 mnd', behandling.innen3Mnd ? 'Ja' : 'Nei')
];

const dagerIgjen = behandling => [
    item('Første fraværsdag', toDate(behandling.førsteFraværsdag)),
    item('Første sykepengedag', toDate(behandling.førsteSykepengedag)),
    item('Yrkesstatus', capitalize(behandling.yrkesstatus)),
    item('Tidligere perioder', behandling.tidligerePerioder.length || '-'),
    item('Max dato', toDate(behandling.maxDato))
];

const under67År = behandling => [item('Alder', `${behandling.alder}`)];

export default {
    medlemskap,
    opptjening,
    søknadsfrist,
    dagerIgjen,
    under67År
};
