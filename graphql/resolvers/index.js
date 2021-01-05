const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');


const bindEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map( event => {
      return { 
        ...event._doc,
        date: new Date( event._doc.date ).toISOString(),
        creator: bindUser.bind( this, event.creator )
      }
    });
  }
  catch (err) {
    throw err;
  }
}
const bindUser = async (userId) => {
  try {
    const user = await User.findById( userId );
    return {
      ...user._doc,
      createdEvents: bindEvents.bind( this, user._doc.createdEvents )
    }

  }
  catch (err) {
    throw err;
  }
}

module.exports = {
  events: async (args) => {
    try {
      const allEvents = await Event.find().populate('creator');
      return allEvents.map( event => { 
        return { 
          ...event._doc,
          creator: bindUser.bind(this, event._doc.creator),
          date: new Date( event._doc.date ).toISOString()
        }
      })
    }
    catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    const { title, description, price, date } = args.eventInput;

    // create mongoose object
    const event = new Event({
      title: title,
      description: description,
      price: +price,
      date: new Date( date ),
      creator: '5ff406abf8fa2ce9c436c4d5'
    });

    try {
      const savedEvent = await event.save();
      
      let createdEvent = { 
        ...savedEvent._doc, 
        creator: bindUser.bind(this, savedEvent._doc.creator), 
        date: new Date( savedEvent._doc.date ).toISOString()
      }
      
      const creator = await User.findById('5ff406abf8fa2ce9c436c4d5');
      if (!creator) {
        throw new Error('User does not exist');
      }
      creator.createdEvents.push(event);
      await creator.save();
      
      return createdEvent;
    } 
    catch (err) {
      throw err;
    }
  },
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