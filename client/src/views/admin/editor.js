import React, { Component } from "react";
import axios from "axios";
import './react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ImageUploader from 'react-images-upload';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import bstyles from '../blog/blog.module.css';
import renderHTML from 'react-render-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEdit, faEye, faCode } from '@fortawesome/free-solid-svg-icons'
import forest from '../blog/mount.jpg';
import loading from "./loading.gif";
import Footer from '../blog/footer'

class editor extends Component {
  
constructor(props) {
  super(props);
  this.state = {
    editmode: "Create Post",
    simage: "",
    otitle: "",
    ocid: 0,
    stitle: "",
    stag: "",
    uploadedFileCloudinaryUrl: [],
    uploadedFileCloudinaryId: [],
    editorState: EditorState.createEmpty(),
    htmlcontent: "",
    pictures: [],
    buttonUrl: "Copy URL",
    uploadStatus: 'NotStarted',
    uploadCount: 0,
    modalstate: '',
    uindex: 0,
    utotal: 0,
    udone: 0,
    tab: ["is-active","",""],
    space: ''
  }
}

componentDidMount() {
  axios.get('/api/isLogged')
     .then(res => {
       var searchParams = new URLSearchParams(this.props.location.search).get("m");
       const content = localStorage.getItem('content');

       if(searchParams === 'edit'){
        this.setState({
          editmode: 'Edit Post',
        })
        this.getPost()
      }else{
        this.editHtml(content)
        this.interval = setInterval(() => this.local(), 60000);
      }

     }).catch( err => {
         if(err.response.status === 401){
            this.props.history.push('/admin/login');
         } 
     })   
}

componentWillUnmount() {
  clearInterval(this.interval);
}

local = () => {
  localStorage.setItem('content', draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
}


onEditorStateChange: Function = (editorState) => {
  if(editorState.getCurrentContent().getPlainText('').length < 500001){
    this.setState({
      editorState
    });
  }
  else{
    window.alert("Warning: Maximum content size reached")
  }
};


putPost = () => { 
  this.setState({space: "loading"})
  const content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    if(this.state.stitle.length && this.state.stag.length && this.state.simage.length && content.length > 0){
      axios.post('/api/posts',{
          imageurl: this.state.simage,
          title: this.state.stitle,
          tag: this.state.stag,
          content: content,
          cimages: this.state.uploadedFileCloudinaryId,        
      })
        .then(res => {
          
          //Remove ids from unused stack
          axios.delete('/api/deleteused',{
            headers: {
              Authorization: 'authorizationToken'
            },
            data: {
              imgids: this.state.uploadedFileCloudinaryId
            }  
          }).catch( err => console.log(err))

          if(res){
            window.alert("Posted Successfully!")
            localStorage.removeItem('content')
            this.setState({
              modalstate: "",
            })
            this.props.history.push(`/blog/${res.data.cid}/${res.data.title}`);
          }
        })
        .catch(err => window.alert('Post creation failed'))
    }else {
      window.alert('Input field required')
    }
}

getPost = () => {
  const path = this.props.location.pathname
  const cid = path.slice(14,path.lastIndexOf('/'));
  const title = path.slice(15 + cid.length).replace(/-/g,' ');
  axios.get('/api/viewpost',{
    params: {
      title: title,
      cid: cid
    }
  })
    .then(res => {
      if(res.data){

        const blocksFromHtml = htmlToDraft(res.data.content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);

        this.setState({
          otitle: title,
          ocid: cid,
          stitle: res.data.title,
          simage: res.data.imageurl,
          stag: res.data.tag,
          uploadedFileCloudinaryId: res.data.cimages,
          udone: res.data.cimages.length,
          //Editor state conversion
          editorState: editorState
        })
      }
    })
    .catch(err => console.log(err))
}

setPost = () => {
  this.setState({space: "loading"})
  const content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    if(this.state.stitle.length && this.state.stag.length && this.state.simage.length && content.length > 0){
      axios.put('/api/updatepost',{
          otitle: this.state.otitle,
          cid: this.state.ocid,
          cimages: this.state.uploadedFileCloudinaryId,
          imageurl: this.state.simage,
          title: this.state.stitle,
          tag: this.state.stag,
          content: content        
      })
        .then(res => {
          axios.delete('/api/deleteused',{
            headers: {
              Authorization: 'authorizationToken'
            },
            data: {
              imgids: this.state.uploadedFileCloudinaryId
            }  
          }).then((res) => {
            if(res.data){
              window.alert("Success: Post Updated!")
              this.setState({
                modalstate: "",
              })
            }
          }).catch( err => console.log(err))
          this.props.history.push(`/blog/${res.data.cid}/${this.state.stitle}`);
        })
        .catch(err => console.log(err))
    }else {
      window.alert('Update failed, Please try again')
    }
}

handleImageUpload = (index) => {
    this.setState({
      uploadStatus : "Uploading"
    })
    var imag = this.state.pictures[index]
    var bodyFormData = new FormData();
    bodyFormData.append('image', imag); 
    var progress
    const config = {
      headers: {'Content-Type': 'multipart/form-data' },
      onUploadProgress : (progressEvent) => {
      progress = Math.round((progressEvent.loaded * 100.0) / progressEvent.total);
      document.getElementById('progress').value = progress;
      }
    };
    axios.post('/api/upload', bodyFormData,config)
    .then((res) => {
      if(res.data){
        var response = res.data.imgurl;
        var id = res.data.public_id;
          this.setState({
            uploadedFileCloudinaryUrl: this.state.uploadedFileCloudinaryUrl.concat(response),
            uploadedFileCloudinaryId: this.state.uploadedFileCloudinaryId.concat(id),
            uploadCount: this.state.uploadCount + 1
          })
        if(this.state.pictures.length !== this.state.uploadCount){
          this.setState({ uindex: this.state.uindex + 1})
          this.handleImageUpload(index + 1)
        }
        else{
          this.setState({
            uindex: this.state.uindex + 1,
            uploadStatus: 'Finished',
          })
      }
      }})
    .catch(err => console.log(err))
}

deleteImage = (index) => {
  axios.delete('/api/deleteimage', {
    headers: {
      Authorization: 'authorizationToken'
    },
    data: {
      title: this.state.otitle,
      cid: this.state.ocid,
      imageid: this.state.uploadedFileCloudinaryId[index]
    }
  }).then(res => {
    if(res.data){
      window.alert("Image deleted successfully")
      const ids = this.state.uploadedFileCloudinaryId;
      ids.splice(index,1)
      this.setState({
        uploadedFileCloudinaryId: ids,
        udone: this.state.udone - 1,
      })
    }
  })
}

imageStack = (img) => {
  if(this.state.uploadStatus !== 'Uploading'){
    this.setState({
      pictures: img
    });
  }
  else{
    window.alert("Please wait for the upload to finish")
  }
}

toggleModal = (e) => {
  if(e){
    e.preventDefault();
  }
  var mstate = this.state.modalstate
  if(mstate === ''){
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

switchTab = (index) =>{
  let tab = ["","",""]
  tab[index] = "is-active"
  this.setState({
    tab: tab
  })
}

editHtml = (data) => {
  let editorState = ""
  if(data !== null){
    const blocksFromHtml = htmlToDraft(data);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    editorState = EditorState.createWithContent(contentState);
  }
  this.setState({
    editorState: editorState
  })
}

prevent = (e) => {
  e.preventDefault()
}

loader = () => {
  return(
    <center><img src={loading} alt="loading" style={{width: 40, margin: 18}}/></center>
  )
}

  render() {
    const { editorState } = this.state;

    return (
      
      <div className={''} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i&display=swap" rel="stylesheet"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <div className={bstyles.lcontainer}>
          <section className={`hero is-fullheight`} >
          <h1 style={{fontSize: 36, textAlign: 'center'}}>{this.state.editmode}</h1><br/>
        
  
          { 

            <div style={{ backgroundImage: `url(${forest})`,backgroundSize: 'cover', textAlign: 'center',  borderRadius: 10}}> 
              <div style={{width: '100%',height: '100%', backdropFilter: 'blur(5px)',borderRadius: 10, paddingBottom: 20}}>
              <ImageUploader
                    buttonText={`Choose images`}
                    onChange={this.imageStack.bind(this)}
                    imgExtension={['.jpg','.jpeg', '.gif', '.png', '.gif']}
                    maxFileSize={1020000}
                    fileTypeError={"Invalid File"}
                    fileSizeError={"image size is larger than 1 MB"}
                    label={"Maximum image size: 1 MB"}
                    fileContainerStyle={{background: "transparent", boxShadow: 'none',margin: 0, color: '#333'}}
                    withIcon={true}
              />
              <p style={{fontSize: 12,  color: '#333'}}>Files selected for upload:  {this.state.pictures.length - this.state.uindex}</p><br />
              {(this.state.uploadStatus === 'Uploading' && this.state.pictures.length !== this.state.uploadCount) ?
              <div>
                <p style={{fontSize: 12,  color: '#333'}}>
                Uploading image {this.state.utotal - (this.state.pictures.length - this.state.uindex) + 1} / {this.state.utotal}
                </p><br/>
                <center><progress id="progress" style={{width: '70%', textAlign: 'left'}} className="progress is-dark" value="0" max="100"></progress></center>
              </div>
              :
              <button onClick={() => (this.state.pictures.length > 0 && this.state.pictures.length !== this.state.uploadCount) && (this.setState({utotal: this.state.pictures.length - this.state.uindex}) | this.handleImageUpload(this.state.uindex))} className="button is-primary" style={styles.bttn}> Upload </button>
              }
              </div>
           </div> 
          }
          <br />

   
            <center></center><div className="columns is-mobile" style={{flexWrap: 'wrap',justifyContent:'space-around', backgroundColor: '#131313', borderRadius: 10, width: '100%', alignSelf: "center"}}>
            {this.state.uploadedFileCloudinaryId.map((user,index) =>
              (this.state.uploadedFileCloudinaryId[index] !== undefined) && 
              <figure className="image is-128x128" style={{padding: 6}} key={index} >
                <div className="imghvr-flip-horiz" style={{border: 2,borderRadius:8, borderColor: '#423B57', borderStyle: 'solid', height: '100%'}} >
                  <img alt="uploaded" style={{width:'100%', height: '100%', objectFit: 'cover'}} src={`https://res.cloudinary.com/azizcloud/image/upload/${this.state.uploadedFileCloudinaryId[index]}`}></img>
                  <figcaption style={styles.vcenter}>
                  <CopyToClipboard text={`https://res.cloudinary.com/azizcloud/image/upload/${this.state.uploadedFileCloudinaryId[index]}`}>
                    <button className="button is-primary" onClick={() => {this.setState({ buttonUrl: "Copied"})}} onMouseOut={() => {this.setState({ buttonUrl: "Copy URL"})}} style={styles.bttn}>{this.state.buttonUrl}</button>
                  </CopyToClipboard> 
                  <br/>
                  <button className="button is-danger" style={styles.bttn} onClick={() => {this.deleteImage(index)}}>Delete</button>
                  </figcaption> 
                </div>
              </figure>
            )}            
            </div>

            <form onSubmit={this.toggleModal}>
              <input className={bstyles.inputarea} type="url" onChange={(e) => this.setState({simage: e.target.value})} value={this.state.simage} placeholder="Enter header image URL" maxLength="250" required/><br /><br />
              <input className={bstyles.inputarea} pattern={`^[a-zA-Z0-9,! .()"'|]+$`} onChange={(e) => this.setState({stitle: e.target.value})} value={this.state.stitle} placeholder="Enter post title without special characters" maxLength='77' required/><br /><br />
              <input className={bstyles.inputarea} type="text" onChange={(e) => this.setState({stag: e.target.value})} value={this.state.stag} placeholder="Enter tag" maxLength='14' required/><br/><br />
              <div>
                <article>
                  <p className="panel-heading" style={{color: '#ddd',backgroundColor: '#767778'}}>
                    Manage content
                  </p>
                  <div className="tabs is-centered is-boxed" style={{backgroundColor: '#3C3940',paddingTop: 10,marginBottom: 0}}>
                  <ul style={{borderBottomWidth: 1, borderBottomColor: '#dbdbdb',borderStyle: 'solid',border: 'none'}}>
                    <li style={styles.li} className={`${this.state.tab[0]}`} onClick={() => {this.switchTab(0)}}>
                      <a href="# " onClick={(e) => this.prevent(e)}>
                        <FontAwesomeIcon icon={faEdit}  size="1x"/>&nbsp;
                        <span style={{color: '#ccc'}}>Editor</span>
                      </a>
                    </li>
                    <li style={styles.li} className={`${this.state.tab[1]}`} onClick={() => {this.switchTab(1)}}>
                      <a href="# " onClick={(e) => this.prevent(e)} >
                        <FontAwesomeIcon icon={faEye}  size="1x"/>&nbsp;
                        <span style={{color: '#ccc'}}>Preview</span>
                      </a>
                    </li>
                    <li style={styles.li} className={`${this.state.tab[2]}`} onClick={() => {this.switchTab(2)}}>
                      <a href="# " onClick={(e) => this.prevent(e)}>
                        <FontAwesomeIcon icon={faCode}  size="1x"/>&nbsp;
                        <span style={{color: '#ccc'}}>Edit HTML</span>
                      </a>
                    </li>
                  </ul>
                </div>
                  <div style={this.state.tab[0] === "" ? styles.hide : undefined}>
                    <Editor
                      editorState={editorState}
                      editorClassName={bstyles.contentArea}
                      onEditorStateChange={this.onEditorStateChange}
                    />
                   <br />
                    <center><button className={bstyles.nbutton} value='submit' >{this.state.editmode === 'Edit Post' ? 'Save Changes' : 'Create Post'}</button></center>
                  </div>

                  {this.state.tab[1] === "is-active" && 
                    <div style={{padding: '4%', minHeight: '60vh', backgroundColor: '#19181b'}}>
                      <div className="container">
                        <div className={bstyles.contentArea} >
                          {renderHTML(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
                        </div>
                      </div>
                    </div>
                  }

                  {this.state.tab[2] === "is-active" && 
                    <div>
                      <textarea id="htmlcontent" defaultValue={draftToHtml(convertToRaw(editorState.getCurrentContent()))} onChange={(e) => this.setState({htmlcontent: e.target.value})} style={{backgroundColor: "#19181b",width: '100%', minHeight: '60vh',color: '#fff', border: 0}}>
                      </textarea >
                      <br/><br/>
                      <center><button className={bstyles.nbutton} type="button" onClick = {() => this.editHtml(this.state.htmlcontent)} >Initialize</button></center>
                    </div>
                  }

                </article> 
              </div>
            </form>
          </section>  
        </div>
        
        <div className={`modal ${this.state.modalstate}`}>
              <div className="modal-background"></div>
                <div className="modal-content">
                { this.state.space !== 'loading' ? (
                  <div className={`card ${bstyles.card}`} style={{borderRadius: 6, backgroundColor: '#222227'}}>
                    <div className="card-content">
                      <p className="title" style={{color: '#fff'}}>
                        {this.state.editmode === "Create Post" ? 'Are you sure you want to create a new post?' : 'Are you sure you want to update the changes to the post?' }
                      </p>
                    </div>
                    <footer className="card-footer" style={{borderColor: '#574b4b'}}>
                      <div style={{backgroundColor: '#222227',borderRadius: 8, width: '100%'}}>
                        <button className={bstyles.cbutton} style={{width: '50%'}}  onClick = {(this.state.editmode === 'Create Post' ? this.putPost : this.setPost)}>Confirm</button>   
                        <button className={bstyles.cbutton} style={{width: '50%'}} onClick = {(e) => {this.toggleModal(e)}}>Cancel</button> 
                      </div>
                    </footer>
                  </div>
                ) : this.loader()}
                </div>
            <button className="modal-close is-large" onClick = {() => {this.toggleModal()}} aria-label="close"></button>
          </div>
          <Footer></Footer>
      </div>
    );
  }
}

const styles =({

  hide: {
    display: 'none',
  },

  li: {
    width: '100%',
    color: '#ccc'
  },

  bttn : {
    fontSize: 14,
    height: 30,
    border: 'none',
    borderRadius: 15,
    width: 100,
    padding:0,
    backgroundColor:'#3f4257' 
  },

  vcenter  : {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column"
  }
})

export default editor;