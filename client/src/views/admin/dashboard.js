import React, {Component} from "react";
import axios from "axios";
import loading from "./loading.gif";
import dstyles from '../blog/blog.module.css';
import forest from './forest.jpg';
import Footer from '../blog/footer'
import logo from '../blog/Polygon.svg'

class Dashboard extends Component{

constructor(props) {
    super(props);
    this.state = {
      id: "",
      ctitle: "",
      scontent: [],
      modalstate: "",
      modalstate2: "",
      target: "",
      space: "loading",
      pivot: 0,
      active: true,
    }
  }

  componentDidMount(){
    axios.get('/api/isLogged')
     .then(res => {
      this.getSpace()
      this.getPosts()
     }).catch( err => {
         if(err.response.status === 401){
             this.props.history.push('/admin/login');
         } 
     })   
  }

  loadMore = () => {
    this.getPosts()
  }

getPosts = () => {
  const limit = 6
  axios.get('/api/postitles',{
    params: {
      skip: this.state.pivot,
      limit: limit
    }
  })
    .then(res => {
      if(res.data.length !== 0){
        this.setState({
          scontent: this.state.scontent.concat(res.data),
          pivot: this.state.pivot + limit,
          active: true,
        })
      }
      else{
        this.setState({
          active: false,
        })
      }
    })
    .catch(err => console.log(err))
}

clearCache = () => {
  axios.delete('/api/clear')
       .then(res => {
          window.alert('Cache cleared')
          this.setState({
            modalstate2: ""
          })
       }).catch( err => {
          window.alert("Failed to clear cache")
       })   
}

getSpace = () => {
  axios.get('/api/usedspace')
  .then(res => {
    if(res.data){
      this.setState({
        space: res.data,
      })
    }
  })
  .catch(err => console.log(err))
}

deletePost = (e) => {
  const refer = this.state;
  const post = refer.scontent[refer.target]
  if(refer.ctitle === post.title){
    axios.delete('/api/deletepost', {
      headers: {
        Authorization: 'authorizationToken'
      },
      data: {
        id: post._id
      }
    }).then(res => {
      if(res.data){
        window.alert("Post has been deleted")
        const content = this.state.scontent;
        content.splice(refer.target,1)
        this.setState({
          ctitle : "",
          modalstate: "",
          scontent: content,
        })
      }
    })
    ;
  }
  else{
    window.alert("Please enter matching title")
  }
}

toggleModal = (e) => {
  e.preventDefault()
  if(this.state.modalstate === ''){
    this.setState({
      modalstate: "is-active is-clipped"
    })
  }
  else{
    this.setState({
      modalstate: ""
    })
  }
}



toggleModal2 = (e) => {
  e.preventDefault()
  if(this.state.modalstate2 === ''){
    this.setState({
      modalstate2: "is-active is-clipped"
    })
  }
  else{
    this.setState({
      modalstate2: ""
    })
  }
}

logout = () => {
  localStorage.removeItem('content')
  axios.get('/api/logout')
  .then(res => {
      this.props.history.push("login")
  })
  .catch(err => console.log(err))
}

updateTitle = (e) => {
  this.setState({
      ctitle: e.target.value
  })
}

loader = () => {
  return(
    <center><img src={loading} alt="loading" style={{width: 40, margin: 18}}/></center>
  )
}

  render() {
    const { scontent } = this.state;
      return (
      <div className={`columns ${dstyles.dashboard}`} style={{paddingBottom: 0}}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <div className="column" >
              <h2 style={{fontSize: 40,color: 'white', textAlign: 'center', fontWeight: 700, letterSpacing: '0.05em'}} className="title"> Dashboard </h2>
              <div style={{minWidth: '68vw'}}>
              <div className="card" style={{ borderRadius: 6, backgroundSize: 'cover', backgroundImage: `url(${forest})`}}>
                  <div className="card-content columns" style={{borderRadius: 6,margin: 0,backdropFilter: 'blur(5px)',}}>     
                    <div className="column" style={{ flexDirection: 'column', backgroundColor: '#444449', padding: 10, borderRadius: 8}}>
                      { this.state.space !== 'loading' ? (
                          <div style={{color: '#fff', paddingBottom: 12}}>
                            <p>Database used: {(this.state.space.MStorage/1024).toFixed(2)}/500 MB</p>
                            <p>CDN storage used: {(this.state.space.CStorage/1048576).toFixed(2)} MB</p>
                            <p>CDN service used: {this.state.space.Credits} %</p>
                          </div>) : this.loader()
                      }
                      <div style={{backgroundColor: '#222227',borderRadius: 8, width: '100%'}}>
                        <button className={dstyles.cbutton} style={{width: '50%'}} onClick={()=>{this.setState({space: 'loading'}) || this.getSpace()}}>Refresh</button>   
                        <button className={dstyles.cbutton} style={{width: '50%'}} onClick={(e)=>{this.toggleModal2(e)}}>Clear Cache</button> 
                      </div>
                    </div>

                    <div className="column" style={{display: 'flex', flexDirection: 'column',justifyContent: 'center'}}>
                    <center><img src={logo} alt="logo" style={{width: 100}}/></center>
                    </div>

                    <div className="column columns" style={{flexDirection: 'column',backgroundColor: '#444449', padding: 10, borderRadius: 8, margin: 0}}>
                      <button style={{marginBottom: 10}} className={`${dstyles.cbutton2} column`} onClick={()=>{window.open('editor#new')}}>Create Post</button>                         
                      <button className={`${dstyles.cbutton2} column`} onClick={(e)=>{this.logout()}}>Log out</button>  
                    </div>
                  
                  </div>
              </div>
            <br/>
            {this.state.pivot !== 0 ? (
            <div className="columns" style={{marginTop: 20,margin: 0,padding: 8,flexDirection: 'column',borderRadius: 8, width: '100%', backgroundColor: "#3B3B40", color: '#fff'}}>

            {scontent.map((post,index)  =>
                <div className="column" style={{margin: 10, backgroundColor: '#222227', borderRadius: 8}} key={index}>
                      <nav className="level">
                
                        <div className={`level-left ${dstyles.dtitle}`}>
                          <p style={{fontSize: 20, padding: 10}} >{index + 1}</p>
                          <div style={{paddingLeft: 15}}>
                            <p style={{wordBreak: 'break-word', fontSize: 22}}>{post.title}</p>
                            <p style={{fontSize: 14, color: '#AAAAAA'}}>{post.date}</p> 
                            <p style={{fontSize: 14, color: '#AAAAAA'}}>{post.tag}</p>
                          </div>
                        </div>
                      
                        <div className="level-right" >
                          <p style={{backgroundColor: '#3B3B40', borderRadius: 8, padding: 10, height: 50}} className="level-item">{post.vcount} views</p>

                          <div className="level-item" style={{backgroundColor: '#3B3B40', borderRadius: 8, minWidth: 200}}>
                            <input type='button' className={dstyles.cbutton} value="View" onClick={() => {window.open(`/blog/${post.cid}/${post.title}`)}} />

                            <input type='button' className={dstyles.cbutton} value="Edit" onClick={() => {window.open(`/admin/editor/${post.cid}/${post.title}?m=edit`)}} />

                            <input type='button' className={dstyles.cbutton} value="Delete" onClick={(e) => {this.setState({target: index}) || this.toggleModal(e)}} />
                          </div>
                          
                        </div>

                      </nav>
                </div>
            )}
            </div>): this.loader()}
            <div style={{ margin: 25,display: 'flex', flexDirection: 'column',justifyContent: 'center',height: 60}} >
             {(this.state.pivot > 0 && this.state.active) && <center ><div title="Load more" className={dstyles.loader} onClick={() => this.loadMore()}></div></center>}
            </div>
            </div>
           
            <div className={`modal ${this.state.modalstate}`}>
              <div className="modal-background"></div>
              <div className="modal-content">
              <div className={`card ${dstyles.card}`} style={{borderRadius: 6, backgroundColor: '#222227'}}>
                <div className="card-content" > 
                  <p className="title" style={{color: '#fff'}}>
                    Are you sure you want to permanently delete this post?
                  </p>
                  <br/>
                  <input className={dstyles.inputarea} onChange={this.updateTitle} type="text" value={this.state.ctitle} placeholder="Enter title to confirm" />
                </div>
                <footer className="card-footer" style={{borderColor: '#574b4b'}}>
                  <div style={{backgroundColor: '#222227',borderRadius: 8, width: '100%'}}>
                    <button className={dstyles.cbutton} style={{width: '50%'}} onClick = {(e) => {this.deletePost(e)}}>Delete Post</button>   
                    <button className={dstyles.cbutton} style={{width: '50%'}} onClick = {(e) => {this.toggleModal(e)}}>Cancel</button> 
                  </div>
                </footer>
              </div>
              </div>
              <button className="modal-close is-large" onClick = {(e) => {this.toggleModal(e)}} aria-label="close"></button>
            </div>


            <div className={`modal ${this.state.modalstate2}`}>
              <div className="modal-background"></div>
              <div className="modal-content">
              <div className={`card ${dstyles.card}`} style={{borderRadius: 6, backgroundColor: '#222227'}}>
                <div className="card-content">
                  <p className="subtitle" style={{color: '#fff'}}>
                    <span style={{color: 'red'}}>Warning:</span> Clearing the cache while writting a post will cause data loss.
                    Make sure there is no pending posts to submit.
                  </p>
                  <br/>
                  <p className="subtitle" style={{color: '#fff'}}>
                    Are you sure you want to clear cache?
                  </p>
                  <br/>
                </div>
                <footer className="card-footer" style={{borderColor: '#574b4b'}}>
                  <div style={{backgroundColor: '#222227',borderRadius: 8, width: '100%'}}>
                    <button className={dstyles.cbutton} style={{width: '50%'}} onClick = {(e) => {this.clearCache(e)}}>Clear cache</button>   
                    <button className={dstyles.cbutton} style={{width: '50%'}} onClick = {(e) => {this.toggleModal2(e)}} >Cancel</button> 
                  </div>
                </footer>
              </div>
              </div>
              <button className="modal-close is-large" onClick = {(e) => {this.toggleModal2(e)}} aria-label="close"></button>
            </div>
            <Footer></Footer>
        </div>
      </div>
      );
  }
}

export default Dashboard;