import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import s from './NewPost.module.css'

class NewPost extends Component {

  render() {
    return (
       <div align="">
            <div  className="content  mr-auto ml-auto"></div>
            <p>&nbsp;</p>
              <h2>New Post</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.props.uploadPost(description)
                this.props.update()
              }} encType="multipart/form-data">

                <input type='file'multiple="multiple" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFiles} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>
                <button type="submit" class="btn mt-2 btn-primary btn-block btn-lg">Upload!</button>
              </form>
              </div>
    );
  }
}

export default NewPost;