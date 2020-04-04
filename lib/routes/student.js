const Joi = require('joi');

const Students = require('../models/students');

const internals = {};

internals.studentSchema = Joi.object({
  name: Students.field('name'),
  mobile: Students.field('mobile')
});

module.exports = [
  {
    method: 'GET',
    path: '/students',
    options: {
      description: 'Get the list of all the students.',
      tags: ['api'],
      handler: async (request) => {
        const { studentService } = request.services();

        const students = await studentService.findAll();
        return { data: students };
      },
    },
  },
  {
    method: 'POST',
    path: '/students',
    options: {
      description: 'Create a new student.',
      tags: ['api'],
      validate: {
        payload: internals.studentSchema
      },
      handler: async (request) => {
        const { studentService } = request.services();

        const student = await studentService.create(request.payload);
        return { data: student };
      }
    }
  }
];
