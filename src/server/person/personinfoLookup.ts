import personinfoMapping from './personinfoMapping';
import { SparkelClient } from '../adapters/sparkelClient';
import { StsClient } from '../auth/stsClient';
import { AktørIdLookup } from '../aktørid/aktørIdLookup';
import { UnmappedPersoninfo } from '../../types';

interface PersoninfoLookupParameters {
    stsClient: StsClient;
    sparkelClient: SparkelClient;
    aktørIdLookup: AktørIdLookup;
}

let sparkelClient: SparkelClient;
let stsClient: StsClient;
let aktørIdLookup: AktørIdLookup;

const init = ({
    stsClient: _stsClient,
    sparkelClient: _sparkelClient,
    aktørIdLookup: _aktørIdLookup
}: PersoninfoLookupParameters) => {
    stsClient = _stsClient;
    sparkelClient = _sparkelClient;
    aktørIdLookup = _aktørIdLookup;
};

const hentPersoninfo = async (aktørId: string) => {
    return stsClient
        .hentAccessToken()
        .then(token => sparkelClient.hentPersoninfo(aktørId, token))
        .then(async (person: UnmappedPersoninfo) => {
            const fnr = await aktørIdLookup.hentFnr(aktørId);
            return personinfoMapping.map({ ...person, fnr });
        });
};
module.exports = {
    init,
    hentPersoninfo
};

export default {
    init,
    hentPersoninfo
};
