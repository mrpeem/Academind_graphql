import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';


class EventsPage extends Component {
  state = {
    showModal: false,
    events: []
  };

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
    this.setState({ showModal: true }); 
  };

  modalConfirmHandler = () => {
    this.setState({ showModal: false });
    
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

    // sign up
    const body = {
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}",
            date: "${date}",
            price: ${price},
            description: "${description}"
          }) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
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
      this.fetchEvents();
    })
    .catch(err => {
      throw err;
    });

  };

  modalCancelHandler = () => {
    this.setState({ showModal: false });
  }; 

  fetchEvents() {
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
      this.setState({ events: events });
    })
    .catch(err => {
      throw err;
    });
  };

  render() {
    const eventList = this.state.events.map( event => {
      return (
        <li key={event._id} className="events-list-item"> {event.title} </li>
      );
    });

    return (
      <React.Fragment>

        {/* Modal */}
        {this.state.showModal && <Backdrop />}
        {this.state.showModal && (
          <Modal 
            title="Add Event" 
            canCancel 
            canConfirm 
            onConfirm={this.modalConfirmHandler}
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
        <ul className="events-list">
          {eventList}
        </ul>


      </React.Fragment>
    );
  }
} 

export default EventsPage;