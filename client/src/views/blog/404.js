import React, { Component } from 'react';
import Footer from './footer';
import Navba from './navbar';

class contact extends Component {

  render() {
    return (
      <div>
        <div className="columns">
          <div className="column" >
            <Navba></Navba>
            <div style={{height: '90vh', marginTop: '15%'}}>
                <h1 style={{fontSize: 80, textAlign: "center"}}> 404 </h1>
                <h1 style={{fontSize: 50, textAlign: "center"}}> Page not found </h1>
            </div>
            <Footer></Footer>
          </div>
        </div>
      </div>
    )
  }
}

export default contact;