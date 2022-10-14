import { AppConfig, OnBehalfOf } from '../types';

export interface SetupParameters {
    config: AppConfig;
    onBehalfOf: OnBehalfOf;
}

const personIdHeaderName = 'nav-person-id';
let spesialistId: string;

let onBehalfOf: OnBehalfOf;

const setup = ({ config, onBehalfOf: _onBehalfOf }: SetupParameters) => {
    spesialistId = config.oidc.clientIDSpesialist;
    onBehalfOf = _onBehalfOf;
};

module.exports = {
    setup,
    personIdHeaderName,
};

export default {
    setup,
    personIdHeaderName,
};
