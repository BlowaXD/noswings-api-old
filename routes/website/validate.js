'use strict';
const sql = require('mssql');
const validator = require('validator');

const REQUEST_CHECK_ACCOUNT = 'SELECT TOP 1 Authority FROM [dbo].[Account] WHERE [VerificationToken] = @verifToken;';
const REQUEST_VALIDATE_ACCOUNT = "UPDATE [Account] SET [Authority]='0' WHERE [VerificationToken] = @verifToken;";

async function validate(req, res) {
    let validationToken = req.params.validationtoken;

    if (!validator.isAlphanumeric(validationToken))
        return res.status(403).send({success: false, error: global.translate.WRONG_USERNAME});
    let recordset;
    try {
        let request = new sql.Request();
        request.input('verifToken', sql.VarChar, validationToken);
        recordset = await request.query(`${REQUEST_CHECK_ACCOUNT}`);
    }
    catch (error) {
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }
    recordset = recordset.recordset;

    if (recordset.length === 0)
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});

    if (recordset[0].Authority !== -1)
        return res.status(403).send({error: global.translate.ACCOUNT_VALIDATION_ALREADY});

    try {
        const request = new sql.Request();
        request.input('verifToken', sql.VarChar, validationToken);
        await request.query(`${REQUEST_VALIDATE_ACCOUNT}`);
    }
    catch (error) {
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }
    sql.close();
    return res.status(200).send({success: true, data: global.translate.ACCOUNT_VALIDATION_SUCCESS});
}

module.exports = validate;