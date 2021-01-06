const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async (args) => {
    try {
      const allEvents = await Event.find().populate('creator');
      return allEvents.map(transformEvent);
      // return allEvents.map( event => { 
      //   return transformEvent(event);
      // })
    }
    catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const { title, description, price, date } = args.eventInput;

    // create mongoose object
    const event = new Event({
      title: title,
      description: description,
      price: +price,
      date: new Date( date ),
      creator: req.userId
    });

    try {
      const savedEvent = await event.save();
      
      let createdEvent = transformEvent(savedEvent);
      
      const creator = await User.findById(req.userId);
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
  }


}