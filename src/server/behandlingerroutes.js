'use strict';

const fs = require('fs');
const mapping = require('./mapping');
const api = require('./behandlingerlookup');

const setup = app => {
    app.get('/behandlinger/:aktorId', (req, res) => {
        if (process.env.NODE_ENV === 'development') {
            const filename =
                req.params.aktorId.charAt(0) < 5
                    ? 'behandlinger.json'
                    : 'behandlinger_mapped.json';
            fs.readFile(`__mock-data__/${filename}`, (err, data) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
                res.header('Content-Type', 'application/json; charset=utf-8');
                if (filename.indexOf('mapped') > -1) {
                    res.send(data);
                } else {
                    res.send(
                        JSON.parse(data).behandlinger.map(behandling =>
                            mapping.alle(behandling)
                        )
                    );
                }
            });
            return;
        }
        const accessToken = req.session.spadeToken;
        const aktorId = req.params.aktorId;
        api.behandlingerFor(aktorId, accessToken, apiresponse => {
            if (apiresponse.status !== 200) {
                res.status(apiresponse.status).send(apiresponse.data);
            } else {
                res.send(
                    JSON.parse(apiresponse.data).behandlinger.map(behandling =>
                        mapping.alle(behandling)
                    )
                );
            }
        });
    });
};

module.exports = {
    setup: setup
};
