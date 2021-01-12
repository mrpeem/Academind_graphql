const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
  return bindEvents(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
})

const bindEvent = async (eventId) => {
  try {
    const event =  await eventLoader.load( eventId.toString() );
    return event;
  }
  catch (err) {
    throw err;
  }
}
const bindEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a,b) => {
      return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString()); 
    });
    return events.map( event => {
      return transformEvent(event);
    });
  }
  catch (err) {
    throw err;
  }
}

const bindUser = async (userId) => {
  try {
    const user = await userLoader.load(userId);
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    }

  }
  catch (err) {
    throw err;
  }
};



const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString( event._doc.date ),
    creator:  bindUser.bind( this, event.creator )
  }
}

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: bindUser.bind(this, booking._doc.user),
    event: bindEvent.bind(this, booking._doc.event), 
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;