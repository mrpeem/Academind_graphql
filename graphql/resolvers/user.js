const bcrypt = require('bcryptjs');

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
  }


}