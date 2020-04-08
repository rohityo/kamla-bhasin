const Joi = require('joi');

const Students_details = require('../models/user_details');

const internals = {};

internals.k_details_Schema = Joi.object({
  name: Students_details.field('name'),
  parents_name: Students_details.field('parents_name'),
  address: Students_details.field('address'),
  city: Students_details.field('city'),
  state: Students_details.field('state'),
  pin_code: Students_details.field('pin_code')
});

module.exports = [
  {
    method: 'GET',
    path: '/students/details',
    options: {
      description: 'Get the list of all the students.',
      tags: ['api'],
      handler: async (request) => {
        const { kDetailsService } = request.services();
        const students_inof = await kDetailsService.findAll();
        return { data: students_inof };
      },
    },
  },
  {
    method: 'POST',
    path: '/students/details',
    options: {
      description: 'Create a new student details.',
      tags: ['api'],
      validate: {
        payload: internals.k_details_Schema
      },
      handler: async (request) => {
        const { kDetailsService } = request.services();
        // const students_inof = await kDetailsService.create(request.payload);
        // return { data: students_inof };
        const token_data = await kDetailsService.verifyToken(request.payload.token)
        return token_data
      }
    }
  }
];