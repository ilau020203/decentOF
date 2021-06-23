import React, { Component } from 'react';
import NewPost from './NewPost';
import Post from './Post'
import 'bootstrap/dist/css/bootstrap.css'
import s from './Profile.module.css'
const images =[
  "https://bootdey.com/img/Content/avatar/avatar3.png",
  "https://bootdey.com/img/Content/avatar/avatar3.png",
  "https://bootdey.com/img/Content/avatar/avatar3.png",
  "https://bootdey.com/img/Content/avatar/avatar3.png",
  "https://bootdey.com/img/Content/avatar/avatar3.png",
  
]
  const login ="ilau"
const avatar= "https://bootdey.com/img/Content/avatar/avatar3.png"
const description ="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus finibus commodo bibendum. Vivamus laoreet blandit odio, vel finibus quam dictum ut."

class Profile extends Component {

  render() {
    return (
        
        <div className="container" align="center">
          <div class=" container posts-content">
           <div class="col-6">
          
          <NewPost
          uploadPost={this.props.uploadPost}
          u={"asdfasf"}
          captureFile={this.props.captureFile}
          captureFiles={this.props.captureFiles}
          ></NewPost>
          <Post
          images={images}
          avatar={avatar}
          description={description}
          login={login}
          
          >
            </Post>
            <Post
          images={images}
          avatar={avatar}
          description={description}
          login={login}
          
          >
            </Post>
          
         
    
    </div>
    </div>
          
        </div>
     
    );
  }
}

export default Profile;