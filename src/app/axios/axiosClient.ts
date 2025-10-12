import Axios from 'axios';
import qs from 'qs';

export const customAxios = Axios.create({
    paramsSerializer: {
        // Repeter queryparametere som er arrays som de er i stedet for å legge til [] i navnet
        serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    },
});
