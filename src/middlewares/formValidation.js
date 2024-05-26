const validator = require('fastest-validator');
const { ResponseError } = require('../error/response-error');

const v = new validator();

const validate = (schema, request) =>{
    const check = v.compile(schema);
    const result = check (request);

    return result;
}

const schemaRegister = {
    fullName : {
        type: 'string',
        min: 5,
        max: 255,
        required: true
    },
    email : {
        type: 'email',
        required: true,
    },
    password : {
        type: 'string',
        min: 8,
        max: 255,
        required: true
    },
    phone_number : {
        type: 'string',
        min: 10,
        max: 13,
        required: true
    },
    is_admin: {
        type: 'boolean',
        required: false
    }
}

const schemaLogin = {
    email : {
        type: 'email',
        required: true,
    },
    password : {
        type: 'string',
        min: 8,
        max: 255,
        required: true
    }
}

const schemaUpdateProfile = {
    fullName : {
        type: 'string',
        min: 5,
        max: 255,
        required: true
    },
    password : {
        type: 'string',
        min: 8,
        max: 255,
        required: true
    },
    phone_number : {
        type: 'string',
        min: 10,
        max: 13,
        required: true
    },
}

const validateRegister = async (req, res, next) => {
    const errors = await validate(schemaRegister, req.body);

    if (errors.length) {
        return res.status(400).json({ errors });
    }
    next();
}

const validateLogin= async (req, res, next) => {
    const errors = await validate(schemaLogin, req.body);

    if (errors.length) {
        return res.status(400).json({ errors });
    }
    next();
}

const validateProfile= async (req, res, next) => {
    const errors = await validate(schemaUpdateProfile, req.body);

    if (errors.length) {
        return res.status(400).json({ errors });
    }
    next();
}

module.exports = {
    validateRegister,
    validateLogin,
    validateProfile
}