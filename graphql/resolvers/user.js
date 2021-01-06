const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async (args) => {
    const { email, password } = args.userInput;

    try {  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = new User({email, password: bcrypt.hashSync(password, 12)});
      const result = await user.save();
      return { ...result._doc, password: null };
    } 
    catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist');
    }

    const validPassword = await bcrypt.compare( password, user.password );
    if (!validPassword) {
      throw new Error('Password is incorrect');
    }

    const token = jwt.sign({ 
        userId: user.id, 
        email: user.email 
      },'secretkey', { 
        expiresIn: '1h'
    });

    return { userId: user.id, token: token, tokenExpiration: 1 };

  }


}