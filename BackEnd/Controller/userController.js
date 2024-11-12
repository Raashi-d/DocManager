const bcrypt = require('bcrypt');
const User = require('../Models/UserModel');

const signup = async (req, res) => {
    try {
        //Extract the name, email, and password from the request body
        const { name, email, password } = req.body;

        if( !name || !email || !password ){
            return res.status(400).json({message: 'All fields are required'});
        }

        //Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(409).json({message:'User already exists'});
        }

        //Hash the password using bcrypt
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        //Create a new user instance with the hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(200).json({message:'User Registered Successfully'});
    } catch (error){
        res.status(500).json({ message: 'Server error', error: error.message });

    }
}

module.exports = { signup };