const Validator = require('fastest-validator');
// const { ResponseError } = require('../error/response-error');

const v = new Validator();

const validate = (schema, request) => {
  const check = v.compile(schema);
  const result = check(request);

  return result;
};

const schemaRegister = {
  fullName: {
    type: 'string',
    min: 5,
    max: 255,
  },
  email: {
    type: 'email',
  },
  password: {
    type: 'string',
    min: 8,
    max: 255,
  },
  phone_number: {
    type: 'string',
    min: 10,
    max: 13,
  },
  is_admin: {
    type: 'boolean',
    optional: true,
  },
};

const schemaLogin = {
  email: {
    type: 'email',
  },
  password: {
    type: 'string',
    min: 8,
    max: 255,
  },
};

const schemaUpdateProfile = {
  fullName: {
    type: 'string',
    min: 5,
    max: 255,
    optional: true,
  },
  password: {
    type: 'string',
    min: 8,
    max: 255,
    optional: true,
  },
  phone_number: {
    type: 'string',
    min: 10,
    max: 13,
    optional: true,
  },
};

const schemaCreateItem = {
  item_name: {
    type: 'string',
    min: 5,
    max: 255,
  },
  price: {
    type: 'number',
    min: 1,
    convert: true,
  },
  stock: {
    type: 'number',
    min: 1,
    convert: true,
  },
  description: {
    type: 'string',
    min: 10,
    max: 255,
  },
};

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
    convert: true,
    optional: true,
  },
  stock: {
    type: 'number',
    min: 1,
    convert: true,
    optional: true,
  },
  description: {
    type: 'string',
    min: 10,
    max: 255,
    optional: true,
  },
};

const userRegister = async (req, res, next) => {
  const errors = await validate(schemaRegister, req.body);

  if (errors.length) {
    return res.status(400).json({ errors });
  }
  next();
};

const userLogin = async (req, res, next) => {
  const errors = await validate(schemaLogin, req.body);

  if (errors.length) {
    return res.status(400).json({ errors });
  }
  next();
};

const userProfile = async (req, res, next) => {
  const errors = await validate(schemaUpdateProfile, req.body);

  if (errors.length) {
    return res.status(400).json({ errors });
  }
  next();
};

const itemCreate = async (req, res, next) => {
  const errors = await validate(schemaCreateItem, req.body);

  if (errors.length) {
    return res.status(400).json({ errors });
  }
  next();
};

const itemUpdate = async (req, res, next) => {
  const errors = await validate(schemaUpdateItem, req.body);

  if (errors.length) {
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = {
  userRegister,
  userLogin,
  userProfile,
  itemCreate,
  itemUpdate,
};
