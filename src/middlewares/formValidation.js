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
        max: 255
    },
    email : {
        type: 'email',
    },
    password : {
        type: 'string',
        min: 8,
        max: 255
    },
    phone_number : {
        type: 'string',
        min: 10,
        max: 13
    },
    is_admin: {
        type: 'boolean',
        optional: true
    }
}

const schemaLogin = {
    email : {
        type: 'email',
    },
    password : {
        type: 'string',
        min: 8,
        max: 255
    }
}

const schemaUpdateProfile = {
    fullName : {
        type: 'string',
        min: 5,
        max: 255,
        optional: true
    },
    password : {
        type: 'string',
        min: 8,
        max: 255,
        optional: true
    },
    phone_number : {
        type: 'string',
        min: 10,
        max: 13,
        optional: true
    },
}

const schemaCreateItem = {
    item_name: {
        type: 'string',
        min: 5,
        max: 255,
    },
    price: {
        type: 'number',
        min: 1,
    },
    stock: {
        type: 'number',
        min: 1,
    },
    description: {
        type: 'string',
        min: 10,
        max: 255,
    },
}

const schemaUpdateItem = {
    item_name: {
        type: 'string',
        min: 5,
        max: 255,
        optional: true,
    },
    price: {
        type: 'number',
        min: 1,
        optional: true,
    },
    stock: {
        type: 'number',
        min: 1,
        optional: true,
    },
    description: {
        type: 'string',
        min: 10,
        max: 255,
        optional: true,
    },
}

const userRegister = async (req, res, next) => {
    const errors = await validate(schemaRegister, req.body);

    if (errors.length) {
        return res.status(400).json({ errors });
    }
    next();
}

const userLogin= async (req, res, next) => {
    const errors = await validate(schemaLogin, req.body);

    if (errors.length) {
        return res.status(400).json({ errors });
    }
    next();
}

const userProfile= async (req, res, next) => {
    const errors = await validate(schemaUpdateProfile, req.body);

    if (errors.length) {
        return res.status(400).json({ errors });
    }
    next();
}

const itemCreate = async (req, res, next) => {
    const data = {
        item_name: req.body.item_name,
        price: parseInt(req.body.price),
        stock: parseInt(req.body.stock),
        image_url: req.body.item_image,
        description: req.body.description
    }
    const errors = await validate(schemaCreateItem, data);

    if (errors.length) {
        return res.status(400).json({ errors });
    }
    next();
}

const itemUpdate = async (req, res, next) => {
    const data = req.body;
    if (data.price != null || data.stock != null ) {
        data.price = parseInt(req.body.price);
        data.stock = parseInt(req.body.stock);

        const errors = await validate(schemaUpdateItem, data);

        if (errors.length) {
            return res.status(400).json({ errors });
        }
        next();
    } else {
        const errors = await validate(schemaUpdateItem, data);

        if (errors.length) {
            return res.status(400).json({ errors });
        }
        next();
    }
}

module.exports = {
    userRegister,
    userLogin,
    userProfile,
    itemCreate,
    itemUpdate
}