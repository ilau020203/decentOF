import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import s from './Post.module.css'
import reactImageSize from 'react-image-size';
import { ReactPhotoCollage } from "react-photo-collage";

const url = 'https://bootdey.com/img/Content/avatar/avatar3.png'




class Post extends Component {

  state = {
    setting: {
      width: `${this.props.width}px`,
      height: [`${this.props.width * 4 / 3}px`],
      layout: [1],
      photos: this.props.images.map(value => {
        return { source: value }
      })
      ,
      showNumOfRemainingPhotos: true
    }
  }
  componentDidMount = async () => {
    try {

      const { width, height } = await reactImageSize(this.props.images[0]);

      const setting = {
        width: `${this.props.width}px`,
        height: [`${this.props.width * height / width}px`],
        layout: [1],
        photos: this.props.images.map(value => {
          return { source: value }
        })
        ,
        showNumOfRemainingPhotos: true
      }

      this.setState({ setting })

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load Post. Check console for details.`,
      );
      console.error(error);
    }

  }
  constructor(props) {
    super(props);

    let setting = {
      width: `${this.props.width}px`,
      height: [`${this.props.width * 4 / 3}px`],
      layout: [1],
      photos: this.props.images.map(value => {
        return { source: value }
      })
      ,
      showNumOfRemainingPhotos: true
    }
    this.setState({ setting })
    
  }




  render() {


    return (

      <div className=" col pt-3">
        <div className="  card mb-4">
          <div className="card-body">
            <div className="media mb-3 col ">
              <img align="left" width="40" src={this.props.avatar} className={" d-block " + s.uiW40 + " row rounded-circle ps-1"} alt=""></img>
              <div align="left" className="media-body ms-2 ps-4  ">
                {this.props.login}
                <div align="left" className="text-muted small">{(new Date(this.props.date)).toUTCString()}</div>
              </div>

            </div>

            <p className="my-2" className={s.description}>
              {this.props.description}
            </p>

            <ReactPhotoCollage {...this.state.setting} />

          </div>

        </div>
      </div>
    );
  }
}

export default Post;