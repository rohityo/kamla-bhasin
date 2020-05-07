const Joi = require('joi');
const { Readable } = require('stream');
const Helpers = require('../helpers');

const Students_details = require('../models/user_details');

const internals = {};

internals.k_details_Schema = Joi.object({
  email: Students_details.field('email'),
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
      auth:{
        strategy:'jwt'
      },
      description: 'Get the list of all the students.',
      tags: ['api'],
      handler: async (request) => {
        const { email } = request.auth.credentials;
        // const email='tarique19@navgurukul.org'
        const { kDetailsService } = request.services();
        const role_data = await kDetailsService.verifyrole(email);
        if(role_data ==="Admin" || role_data === "SuperAdmin"){
          const students_info = await kDetailsService.findAll();
            return ({data:students_info})
        }else{
          const students_info = await kDetailsService.findbyEmail(email);
          return ({data:students_info})
        }

      },
    },
  },
  
  {
    method: 'POST',
    path: '/students/details',
    options: {
      auth:{
        strategy:'jwt'
      },
      description: 'Create a new user details.',
      tags: ['api'],
      validate: {
        payload: internals.k_details_Schema
      },
      handler: async (request) => {        
        // const { email } = request.auth.credentials;
        const payload_email=request.payload['email'];
        console.log(payload_email);
        
        const email='viresh19@navgurukul.org'
        const { kDetailsService } = request.services();
        const role_data = await kDetailsService.verifyrole(email);
        console.log(email);       
        if(role_data ==="Admin" || role_data==="SuperAdmin"){
          const students_info = await kDetailsService.findbyEmail(payload_email)
          if(students_info.length === 0){            
            const user = await kDetailsService.create(request.payload);
            return { data: user };
          }
          else{
            await kDetailsService.userUpdate(payload_email, request.payload);
            const user = await kDetailsService.findbyEmail(payload_email);
            return { data: user }; 
          }
        }
        else if(role_data === "student"){
          get_email = email.trim();
          if(get_email == payload_email){
            const students_info = await kDetailsService.findbyEmail(payload_email)
            if(students_info.length === 0){            
              const user = await kDetailsService.create(request.payload);
              return { data: user };
            }
            else{
              await kDetailsService.userUpdate(payload_email, request.payload);
              const user = await kDetailsService.findbyEmail(payload_email);
              return { data: user }; 
            }
          }          
        }
        }
    }
  },
  
  {
    method: 'POST',
    path: '/students/details/upload_file/{uploadType}',
    options: {
      description: 'Upload file to S3. Upload type like CSV, PDF or images need to be specified.',
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 2 * 10000 * 10000,
        allow: 'multipart/form-data',
      },
      tags: ['api'],
      validate: {
        params: {
          uploadType: Joi.string().valid('IMG', 'CSV', 'PDF'),
        },
        payload: {
          file: Joi.object().type(Readable).required().meta({ swaggerType: 'file' }),
        },
      },
      plugins: {
        'hapi-swagger': { payloadType: 'form' },
      },
      handler: async (request) => {
        const fileS3URL = await Helpers.uploadToS3(request.payload.file, request.params.uploadType);
        return { fileUrl: fileS3URL };
      },
    },
  },
];