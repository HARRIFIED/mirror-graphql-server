const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { RegisterValidation } = require('../../utils/validation');
const { LoginValidation } = require('../../utils/validation')

const generateToken = (user) => {
   return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    },
        process.env.JWT_SECRET,
        {expiresIn: '9999hr'}
    )
}

module.exports = {
    Mutation: {
        async login (
            parent,
            {username, password}
        ) {
            const {valid, errors} = LoginValidation(username, password);
            if (!valid) {
                throw new UserInputError('Errors', {errors})
            }
            
            //check if a user is in DB
            const user = await User.findOne({username});
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found with this credentials', {errors})
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.general = 'Wrong password'
                throw new UserInputError('Wrong password', {errors})
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register (parent, 
            {registerInput: {username, email, password, confirmPassword}}, //args
            context, 
            info
        ) 
        {
            
            const {valid, errors} = RegisterValidation(
                username,
                email,
                password,
                confirmPassword
            )

            if (!valid) {
                throw new UserInputError('Error', {errors})
            }

            //check if user exists
            const user = await User.findOne({username})
            if (user) {
                throw new UserInputError('User already exists', {
                    errors: {
                        username: 'Username is already taken as User already exists'
                    }
                })
            }

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
            });

            const res = await newUser.save();
        
            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}