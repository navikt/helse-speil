import { item } from './mappingUtils';
import { toDate } from '../utils/date';
import { sykdomsvilkårtekster as tekster } from '../tekster';

const mindreEnnÅtteUker = data => [
    item(tekster('første_sykdomsdag'), toDate(data.førsteSykdomsdag))
];

export default {
    mindreEnnÅtteUker
};
