let ifNoError = require('./errors.handling');

module.exports = {
    searchFormSevenResponse: (data, response)=> {
        ifNoError(data, response).then(()=> {
            response.json({ parties: data });
        });
    },
    myCasesResponse: (cases, response)=> {
        ifNoError(cases, response).then(()=> {
            response.json({ cases: cases });
        });
    },
    createFormTwoResponse: (id, response)=> {
        ifNoError(id, response).then(()=> {
            response.statusCode = 201;
            response.setHeader('Location', '/forms/' + id );
            response.json({});
        });
    },
    updateFormTwoResponse: (id, response)=> {
        ifNoError(id, response).then(()=> {
            response.setHeader('Location', '/forms/' + id );
            response.json({});
        });
    },
    savePersonResponse: (id, response)=> {
        ifNoError(id, response).then(()=> {
            response.statusCode = 201;
            response.setHeader('Location', '/persons/' + id );
            response.json({});
        });
    },
    personInfoResponse: (person, response)=> {
        ifNoError(person, response).then(()=> {
            response.json(person);
        });
    },
    archiveCasesResponse: (data, response)=> {
        ifNoError(data, response).then(()=> {
            response.json({});
        });
    }
};