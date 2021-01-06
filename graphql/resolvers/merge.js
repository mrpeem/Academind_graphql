const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const bindEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  }
  catch (err) {
    throw err;
  }
}
const bindEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
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

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString( event._doc.date ),
    creator: bindUser.bind( this, event.creator )
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