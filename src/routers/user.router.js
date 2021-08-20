/**
*@swagger
* components:
*  securitySchemes:
*   bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*  schemas:
*   user:
*       type: object
*       required:
*           - dev_email
*           - dev_name
*           - password
*       properties:
*           id:
*               type: string
*               description: autogenerated by DB
*           dev_name: 
*               type: string
*               description: User name
*           dev_email:
*               type: string
*           password:
*               type: string
*               default: password
*               description: autogenerated by the express app
*           role:
*               type: string
*               default: developer
*               description: distinguishes between admin and developers
*           profile_pic:
*               filename: 
*                   type: string
*                   description: name of the file as stored in local storage
*               filepath: 
*                   type: string
*                   description: location of the file as stored in the DB
*               filetype:
*                   type: string
*                   description: type of file so that it can be appended while retrieving
*           feedbacks_received:
*                   type: array
*                   description: Stores the feedbacks received
*           feedbacks_to_send:
*                   type: Array
*                   description: Stores the object id feedback forms to be submitted 
*       example:
*           id: ded23onn32nnlmn3l2n3
*           dev_name: John Doe
*           dev_email: john@neoscrum.com
*           password: mlmdslmsd
*           role: developer
*           profile_pic:
*               filename: profile-imageJohn_1243434343
*               filepath: /home/users/neoscrums/images
*               filetype: jpeg/png
*           feedbacks_received: [{}]
*           feedbacks_to_send: ['kmm22km3k2m32mk23m2']
*/

const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');
const upload = require('../helpers/uploadPic.helper');

const userRouter = new express.Router();

/**
*@swagger
*path:
* /login:
*  post:
*   tags: [User]
*   summary: For developers and Admin to login to the platform
*   requestBody:
*       description: email id and password of the user
*       required: true
*       content:
*           application/json:
*               schema:
*                   $ref: '#/components/schemas/user'
*               example:
*                   email: test1@neoscrum.com
*                   password: KIRrxsSr
*   responses:
*    200:
*     description: User is logged in and token is received
*     content:
*      application/json:
*       schema:
*        type: object
*        items:
*         $ref: '#/components/schemas/user'
*/

userRouter.post('/login', auth.generateToken, userController.login, (req, res) => {
    res.json({ res });
})


/**
*@swagger
*path:
* /dashboard:
*  get:
*   security:
*       - bearerAuth: []
*   tags: [User]
*   summary: Get the details to be displayed on user dashboard
*   responses:
*    200:
*     description: Get the user details
*     content:
*      application/json:
*       schema:
*        type: object
*        items:
*          $ref: '#/components/schemas/user'
*/

userRouter.get('/dashboard', auth.verifyToken, userController.getUserDashboard, (req, res) => {
    res.json({ res });
})

/**
*@swagger
*path:
* /register:
*  post:
*   security:
*       - bearerAuth: []
*   tags: [User]
*   summary: Add a new user to the platform
*   requestBody:
*       description: provide Name, Email id and upload profile picture of the new user
*       required: true
*       content:
*           multipart/form-data:
*               schema:
*                   type: object
*                   properties:
*                      name:
*                          type: string
*                      email:
*                          type: string
*                      profile-pic:
*                          type: string
*                          format: binary
*   responses:
*    200:
*     description: Get the user details
*     content:
*      application/json:
*       schema:
*        type: object
*        items:
*          $ref: '#/components/schemas/user'
*/

//for admin - need to add verification for Admin
userRouter.post('/register', auth.verifyToken, upload.single('profile-pic'), userController.generatePassword, userController.createUser, (req, res) => {
    res.json({ res });
})

userRouter.post('/logout', auth.verifyToken, userController.logout, (req, res) => {
    res.json({ res });
})


//************************************Other apis

//for admin - need to add verification for Admin
userRouter.get('/allUsers', auth.verifyToken, userController.getAllUsers, (req, res) => {
    res.json({ res });
});

userRouter.get('/findUser', auth.verifyToken, userController.findUser, (req, res) => {
    res.json({ res });
});


userRouter.post('/upload', upload.single('picture'), userController.uploadPicture, (req, res) => {
    res.json({ res });
})

module.exports = userRouter;