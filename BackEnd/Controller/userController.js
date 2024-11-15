const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');


// signup function to register a new user
const signup = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if( !name || !email || !password ){
            return res.status(400).json({message: 'All fields are required'});
        }

        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(409).json({message:'User already exists'});
        }

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

// signin function to login a user
const signin = async (req, res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({message: 'Email and Passwod Required'});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({message: 'Invalid Password'});
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(200).json({
            message: 'Sign-in successful',
            token,
        });
    }catch(error){
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}



module.exports = { signup, signin };