import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import logo from '../blog/Polygon.svg'
import bstyles from '../blog/blog.module.css';
import forest from './forest.jpg'
import Footer from '../blog/footer';

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }



    requireAuth = () => {
        axios.get('/api/isLogged').catch(err => {
            if (err.response.status === 401) {
                this.props.history.push('/admin/login');
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/api/login", {},
            {
                auth: {
                    username: this.state.username,
                    password: this.state.password
                }
            })
            .then(res => {
                if (res.data) {
                    this.props.history.push('/admin/dashboard');
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="columns">
                <div className="column">
                    <img alt="header" className={bstyles.sideimg} style={{ width: '50%', height: '100vh', position: 'fixed', objectFit: 'cover' }} src={forest} />
                    <img src={logo} alt="logo" style={{ width: 80, margin: 20, zIndex: 99, position: 'fixed' }} />
                </div>
                <div className="column" >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 0, minHeight: '100vh' }} >
                        <form className={bstyles.holder}>
                            <h1 className='title' style={{ fontSize: 50, color: 'white', textAlign: 'center', fontWeight: 700, letterSpacing: '0.1em' }} > Login </h1> <br />
                            <p className="control has-icons-left">
                                <input onChange={(e) => { this.setState({ username: e.target.value }) }} className={bstyles.inputarea} type="email" placeholder="Email" required />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faEnvelope} size="1x" />
                                </span>
                            </p><br /><br />
                            <p className="control has-icons-left">
                                <input onChange={(e) => { this.setState({ password: e.target.value }) }} className={bstyles.inputarea} type="password" placeholder="Password" required />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock} size="1x" />
                                </span>
                            </p>
                            <br /><br />
                            <center>
                                <button className={bstyles.nbutton} onClick={this.handleSubmit}>
                                    Login
                                </button>
                            </center>
                        </form>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        )
    }
}

export default login;