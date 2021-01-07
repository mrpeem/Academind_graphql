import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';


class EventsPage extends Component {
  state = {
    showModal: false
  };

  startCreateEventHandler = () => {
    this.setState({ showModal: true }); 
  };

  modalConfirmHandler = () => {
    this.setState({ showModal: false });
  };

  modalCancelHandler = () => {
    this.setState({ showModal: false });
  }; 

  render() {
    return (
      <React.Fragment>
        {this.state.showModal && <Backdrop />}
        {this.state.showModal && (
          <Modal 
            title="Add Event" 
            canCancel 
            canConfirm 
            onConfirm={this.modalConfirmHandler}
            onCancel={this.modalCancelHandler} 
          >
            <p> modal content </p>
          </Modal>
        )}

        <div className="events-control">
          <p> Share you own events! </p>
          <button className="btn" onClick={this.startCreateEventHandler}> 
            Create Event 
          </button>
        </div>

      </React.Fragment>
    );
  }
} 

export default EventsPage;