const Event = require('../../models/event');
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
      
      let createdEvent = transformEvent(savedEvent);
      
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
  }


}