'use strict';
const sql = require('mssql');

const GET_PACKS = 'SELECT PackId, Name, Image, Description, Price FROM _GF_CS_Packs';

async function get(req, res)
{
    const server = global.config.servers[req.query.server || global.config.default_server];

    /* Some checks */
    if (!server)
        return res.status(403).send({ success: false, error: global.translate.WRONG_SERVER });

    /* Get packs */
    let recordset;
    try
    {
        const request = await server.db.request()
            .query(GET_PACKS);
        recordset = request.recordset || [];
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error: global.translate.ERROR_IN_DATABASE });
    }
    res.send(recordset);
}

module.exports = get;