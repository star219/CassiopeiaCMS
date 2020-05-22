import React, { Component } from "react";
import axios from "axios";
import Navbar from './navbar';
import Footer from './footer'
import bstyles from './blog.module.css';
import renderHTML from 'react-render-html';
import ReactDisqusComments from 'react-disqus-comments';
import transformations from '../transformations.json';

class view extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      title: "",
      date: "",
      tag: "",
      content: "",
      image: ""
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.getPosts()
  }

  getPosts = () => {
    const path = this.props.location.pathname
    var cid = path.slice(6, path.lastIndexOf('/'))
    axios.get('/api/viewpost', {
      params: {
        title: path.slice(7 + cid.length).replace(/-/g,' '),
        cid: cid
      }
    })
      .then(res => {
        if (res.data) {
          this.setState({
            uid: res.data._id,
            title: res.data.title,
            date: res.data.date,
            tag: res.data.tag,
            content: res.data.content,
            image: res.data.imageurl
          })
        }
	else{
          this.props.history.push('/404')
        }
      })
      .catch(err => this.props.history.push('/404'))
  }

  render() {
    return (
      <div className={bstyles.blog} style={{ overflow: 'Hidden' }}>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-145139004-1"></script>
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-145139004-1');`}
        </script>
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <Navbar></Navbar>
        <div style={{ height: '100%' }}>
          <section className={`hero is-fullheight`}  >
            <h1 className={bstyles.sidebar}>AZIZSTARK'S BLOG</h1>
            <div className="columns is-desktop" >
              <div className="column" >
                <img alt="header" src={`https://res.cloudinary.com/azizcloud/image/upload/${transformations.transformations.header}${(this.state.image).slice(50)}`} className={bstyles.head1} />
              </div>
              <div className="column" style={{ maxWidth: '50%' }}>
                <div className={bstyles.adapt}>
                  <h1 className={bstyles.title1}>{this.state.title}</h1>
                  <p className={bstyles.title1} style={{ fontSize: 'calc(0.3vw + 12px)', paddingTop: 30, fontWeight: 300 }}>Posted on {this.state.date}</p>
                </div>
              </div>
            </div>
            <div className={`column ${bstyles.postbox} ${bstyles.slider}`}>
              <div className="container" style={{ minHeight: 400 }}>
                <div className={bstyles.contentArea} style={{ backgroundColor: "#00000000" }}>
                  {renderHTML(`${this.state.content}`)}
                </div>
              </div>
              <br /><br /><br />
              <ReactDisqusComments
                shortname="AzizStark"
                identifier={this.state.title + this.state.cid}
                title={this.state.title}
                url={window.location.href}   
                category_id={this.state.cid}
              />
            </div>
          </section>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}

export default view;
