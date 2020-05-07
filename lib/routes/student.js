const Joi = require('joi');

const Students = require('../models/students');

const internals = {};

internals.studentSchema = Joi.object({
  name: Students.field('name'),
  email: Students.field('email'),
  profilepicture: Students.field('profilepicture'),
  googleuserid: Students.field('googleuserid'),
  center: Students.field('center'),
  githublink: Students.field('githublink'),
  linkedinlink: Students.field('linkedinlink'), 
  mediumlink: Students.field('mediumlink')
});

module.exports = [
  {
    method: 'GET',
    path: '/students',
    options: {
      auth:{
        strategy:'jwt'
      },
      description: 'Get the list of all the students.',
      tags: ['api'],
       handler: async (request) => {
        const { email } = request.auth.credentials;
        // const email='chirag18@navgurukul.org'
        const { studentService } = request.services();
        const role_data = await studentService.verifyrole(email);
        if(role_data ==="Admin" || role_data === "SuperAdmin"){
          const students_info = await studentService.findAll();
            return ({data:students_info})
        }else{
          const students_info = await studentService.findbyEmail(email);
          return ({data:students_info})
        }

      },
    },
  },
 
  {
    method: 'GET',
    path: '/students/{email}',
    options:{
      validate:{
        params:{
          email: Joi.string(),
        }
      },
      description:'get the student information by email',
      tags: ['api'],
      handler: async (request)=>{
        const { studentService } = request.services();
        const students = await studentService.findbyEmail(request.params.email);
        return {data:students}
      }
    }
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
  },
  {
    method: 'POST',
    path: '/students/login/google',
    options: {
      description: 'Login with google account.',
      tags: ['api'],
      validate: {
        payload: {
          idToken: Joi.string().required(),
        },
      },
      handler: async (request) => {
        const { studentService } = request.services();
        const user = await studentService.googleLogin(request.payload.idToken);
        const userToken = await studentService.createToken(user);
        
          return {
            user,
            userToken,
          };
      },
    },
  }
];
