import React, { Component } from 'react';
import bstyles from './blog.module.css';
import ReCAPTCHA from "react-google-recaptcha";
import Footer from './footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import mount from './mount.jpg'
import axios from "axios";

class contact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      capvalue: null,
      sendinfo: "Send",
      emaildata: {
        "user_name": "",
        "user_email": "",
        "message": ""
      }
    };
  }

  onChange = (value) => {
    this.setState({
      capvalue: value,
      sendinfo: "Send",
    });
  }

  sendEmail = (e) => {
    e.preventDefault();
    console.log(this.state.emaildata)
    if (this.state.capvalue !== null && this.state.capvalue !== "sent") {
      this.setState({
        sendinfo: "Sending"
      });
      axios.post('/api/sendmail', this.state.emaildata)
        .then(res => {
          this.setState({
            sendinfo: "Message Sent",
            capvalue: "sent",
          });
        })
        .catch(err => {
          this.setState({
            sendinfo: "Sending Failed!",
          });
        })
    }
    else {
      if (this.state.capvalue !== "sent") {
        this.setState({
          sendinfo: "Please verify captcha",
        });
      }
    }
  }


  formChanger = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    var data = this.state.emaildata;
    console.log(data)
    data[nam] = val
    this.setState({ emaildata: data });
  }


  render() {
    return (
      <div>
        <div className="columns">
          <div className="column" >
            <img alt="header" className={bstyles.sideimg} style={{ width: '50%', height: '100vh', position: 'fixed', objectFit: 'cover' }} src={mount} />
          </div>
          <div className="column" style={{ paddingTop: 18 }}>
            <a className='title' style={{ color: 'white', fontSize: 18, margin: 20, fontWeight: 700, letterSpacing: '0.08em' }} href="/blog" ><FontAwesomeIcon style={{ color: '#888888', paddingTop: 15 }} icon={faChevronLeft} size="2x" />Back to blog</a>
            <div className={`container ${bstyles.holder}`} style={{width: '90%'}}>
              <form onSubmit={this.sendEmail}>
                <h1 className='title' style={{ fontSize: 50, color: 'white', textAlign: 'center', fontWeight: 700, letterSpacing: '0.1em', margin: 20 }} > Contact </h1>
                <h1 className='title' style={{ color: 'white', textAlign: 'center', fontSize: 22, padding: 12, fontWeight: 700, letterSpacing: '0.08em' }} >Let's talk!</h1>
                <input onChange={this.formChanger} className={bstyles.inputarea} name="user_name" placeholder="Your name" type='text' required /><br /><br />
                <input onChange={this.formChanger} className={bstyles.inputarea} name="user_email" placeholder="Your email address" type='email' required /><br /><br />
                <textarea onChange={this.formChanger} className={bstyles.textarea} name="message" placeholder="Your message" type='textarea' required /><br />
                <br /><center><ReCAPTCHA
                  sitekey="6LcHgMkUAAAAAFJHIMlbY2m2N0wSchYl5Ga2wJXU"
                  theme="dark"
                  onChange={this.onChange}
                /></center><br />
                <center><input className={bstyles.nbutton} type='submit' value={this.state.sendinfo} /></center>
              </form>
            </div>
            <Footer></Footer>
          </div>
        </div>
      </div>
    )
  }
}

export default contact;