import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import './Events.css';


class EventsPage extends Component {
  state = {
    showCreateEventModal: false,
    events: [],
    isLoading: false,
    selectedEvent: null 
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElemRef = React.createRef();
    this.priceElemRef = React.createRef();
    this.dateElemRef  = React.createRef();
    this.descriptionElemRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }


  startCreateEventHandler = () => {
    this.setState({ showCreateEventModal: true }); 
  };

  modalConfirmHandler = () => {
    this.setState({ showCreateEventModal: false });
    
    const title = this.titleElemRef.current.value;
    const price = +this.priceElemRef.current.value;
    const date = this.dateElemRef.current.value;
    const description = this.descriptionElemRef.current.value;
    const event = { title, price, date, description };

    if (
      title.trim().length === 0 || 
      price <= 0 || 
      date.trim().length === 0 || 
      description.trim().length === 0 
    ) {
      return; 
    }

    const body = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {
            title: $title,
            date: $date,
            price: $price,
            description: $desc
          }) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed');
      }
      return res.json();
    })
    .then(res => {
      this.setState(prevState => {
        const updatedEvents = [...prevState.events];
        updatedEvents.push({
          _id: res.data.createEvent._id,
          title: res.data.createEvent.title,
          description: res.data.createEvent.description,
          date: res.data.createEvent.data,
          price: res.data.createEvent.price,
          creator: { 
            _id: this.context.userId,
          }
        });
        return {events: updatedEvents};
      });
    })
    .catch(err => {
      throw err;
    });

  };

  modalCancelHandler = () => {
    this.setState({ showCreateEventModal: false, selectedEvent: null });
  }; 

  fetchEvents() {
    this.setState({ isLoading: true });

    const body = {
      query: `
        query {
          events {
            _id
            date
            title
            price
            creator {
              _id
              email
            }
          }
        } `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed');
      }
      return res.json();
    })
    .then(res => {
      const events = res.data.events;
      if (this.isActive)
        this.setState({ events: events, isLoading: false });
    })
    .catch(err => {
      this.setState({ isLoading: false });
      throw err;
    });
  };

  showDetailHandler = (eventId) => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent }
    });
  }

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent:null });
      return;

    }
    const body = {
      query: `
        mutation BookEvent($id: ID!){
          bookEvent (eventId: $id){
            _id
            createdAt
            updatedAt
          }
        } 
      `,
      variables: {
        id: this.state.selectedEvent._id
      }
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed');
      }
      return res.json();
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      throw err;
    });
  };

  componentWillUnmount() {
    this.isActive = false;
  }
  render() {

    return (
      <React.Fragment>

        {/* Backdrop for modal */ }
        {(this.state.showCreateEventModal || this.state.selectedEvent) && <Backdrop />}

        {/* Modal for creating events */}
        {this.state.showCreateEventModal && (
          <Modal 
            title="Add Event" 
            canCancel 
            canConfirm 
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
            onCancel={this.modalCancelHandler} 
          >
            <form>       
              <div className="form-control">
                <label htmlFor="title"> Title </label>
                <input type="text" id="title" ref={this.titleElemRef}/>
              </div>

              <div className="form-control">
                <label htmlFor="price"> price </label>
                <input type="number" id="price" ref={this.priceElemRef}/>
              </div>

              <div className="form-control">
                <label htmlFor="date"> Date </label>
                <input type="datetime-local" id="date" ref={this.dateElemRef}/>
              </div>

              <div className="form-control">
                <label htmlFor="description"> Description </label>
                <textarea id="description" rows="4" ref={this.descriptionElemRef}/>
              </div>
            </form>

          </Modal>
        )}


        { /* Modal for viewing details and booking */ }
        {this.state.selectedEvent && (
          <Modal 
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? "Book" : "Confirm"}
          >
            <h1> {this.state.selectedEvent.title} </h1>
            <h2> ${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleString()} </h2>
            <p> {this.state.selectedEvent.description} </p>
          </Modal>
        )}


        {/* Create event box; only visible if authenticated */}
        {this.context.token && (
          <div className="events-control">
            <p> Share you own events! </p>
            <button className="btn" onClick={this.startCreateEventHandler}> 
              Create Event 
            </button>
          </div>
        )}

        {/* List of events */}
        {this.state.isLoading ? 
          <Spinner /> : 
          <EventList 
            events={this.state.events} 
            authUserId={this.context.userId} 
            onViewDetail={this.showDetailHandler}
          />
        }
        
        


      </React.Fragment>
    );
  }
} 

export default EventsPage;