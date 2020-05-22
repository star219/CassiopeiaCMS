import React, { Component } from "react";
import axios from "axios";
import Navba from './navbar';
import Footer from './footer';
import './bulma.css';
import './imagehover.min.css';
import bstyles from './blog.module.css';
import { Link } from 'react-router-dom';
import field from './field.jpg';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import transformations from '../transformations.json';

class Blog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pivot: 0,
      active: true,
      email: ""
    };
  }
  showIt = (elementId) => {
    var el = document.getElementById(elementId);
    el.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  componentDidMount() {
    this.getPosts()
  }

  getPosts = () => {
    const limit = 6
    axios.get('/api/postitles', {
      params: {
        skip: this.state.pivot,
        limit: limit
      }
    })
      .then(res => {
        if (res.data.length !== 0) {
          this.setState({
            posts: this.state.posts.concat(res.data),
            pivot: this.state.pivot + limit,
            active: true,
          })
        }
        else {
          this.setState({
            active: false,
          })
        }
      })
      .catch(err => console.log(err))
  }

  loadMore = () => {
    this.getPosts()
  }


  subscribe = (e) => {
    e.preventDefault()
    axios.post("/api/subscribe",
      {
        mail: this.state.email,
      }
    )
      .then(res => {
        if (res.data) {
          window.alert("Subscribed!")
        }
        else {
          window.alert("Unable to subscribe")
        }
      })
      .catch(err => console.log(err));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.posts.length === this.state.posts.length) {
      if (this.state.active === false) {
        return false;
      }
      if (nextState.active === false) {
        return true
      }
      return false;
    }
    return true;
  }


  render() {

    return (
      <div className={bstyles.blog} style={{ overflow: 'Hidden' }}>
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta name="description" content="Explore more on Aziz Stark's blog" />
        <Navba></Navba>
        <div style={{ height: '100%' }}>
          <h1 className={bstyles.sidebar}>AZIZSTARK'S BLOG</h1>
          <section className={`hero is-fullheight`}  >
            <div className="columns is-desktop" >
              <div className="column" >
                <img  effect="blur" alt="header" src={field} className={`${bstyles.head1}`} />
              </div>
              <div className={`column ${bstyles.htitle}`}>
                <div className={bstyles.adapt}>
                  <h1 className={bstyles.title1}>Welcome to Cassiopeia CMS</h1>
                </div>
              </div>
            </div>
            <div className="hero" style={{ paddingBottom: 30 }}>

              {
                deck(this.state.posts)
              }

            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 60 }} >
              {(this.state.pivot > 0 && this.state.active) && <center ><div title="Load more" className={bstyles.loader} onClick={() => this.loadMore()}></div></center>}
            </div>
            <div className={`container ${bstyles.holder}`}>
              <form onSubmit={(e) => this.subscribe(e)}>
                <br/>
                <h1 className='title' style={{ color: 'white', textAlign: 'center' }} >Join my blog</h1><br />
                <center><input className={`${bstyles.inputarea} ${bstyles.inputx}`} onChange={(e) => this.setState({ email: e.target.value })} name="user_email" placeholder="Your email address" type='email' required /></center><br />
                <br />
                <center><input className={bstyles.nbutton} type='submit' value="Subscribe" /></center>
              </form>
            </div>
          </section>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}

function box(wtype, title, cid, date, index, image, tag) {
  return (<div className={`column is-full-touch ${bstyles.wrapper} ${wtype} ${bstyles.slider}`} key={index}>
    <Link to={{ pathname: `blog/${cid}/${title.replace(/ /g, "-")}` }} style={{ color: 'inherit' }}>
    <LazyLoadComponent>
      <div className={`${bstyles.box}`} style={{ backgroundImage: `linear-gradient(42.51deg, rgba(3, 3, 3, 0.55) -3.51%, rgba(86, 85, 85, 0.51) 97.42%),url(https://res.cloudinary.com/azizcloud/image/upload/${transformations.transformations.cards}${image.slice(50)})` }}>
        <h1 className={bstyles.htext}>{title}</h1>
        <br />
        <h1 className={bstyles.stext}>{date}</h1>
        <h1 className={bstyles.tag}>{tag}</h1>
      </div>
    </LazyLoadComponent>
    </Link>
  </div>)
}


function deck(nposts) {
  var sliced = []
  var rnum = 2;
  var j = 0;
  for (var i = 0; i < (nposts.length); i++) {
    sliced[i] = nposts.slice(j, (j + rnum))
    j = j + rnum
    rnum = Math.floor(Math.random() * 2) + 2;
  }
  var dual = 0;

  function change(a) {
    if (dual === 0) {
      dual = dual + 1
    }
    else {
      dual = dual - 1
    }
  }

  return (
    sliced.map((user, index) =>
      <div className={`columns is-desktop ${bstyles.deck}`} key={index}>
        {sliced[index].map((user, inde) =>
          box(((sliced[index].length === 2 && inde === dual) ? ("is-one-third") : (sliced[index].length === 2 ? ("is-two-thirds") : (sliced[index].length === 3 ? ("is-one-third") : ("")))), sliced[index][inde].title, sliced[index][inde].cid, sliced[index][inde].date, inde, sliced[index][inde].imageurl, sliced[index][inde].tag)
        )}
        {change(dual)}
      </div>)
  )
}



export default Blog;
