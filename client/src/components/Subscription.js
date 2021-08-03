import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import s from './Subscription.module.css'
import reactImageSize from 'react-image-size';
import { ReactPhotoCollage } from "react-photo-collage";
import {NavLink} from "react-router-dom"
const url = 'https://bootdey.com/img/Content/avatar/avatar3.png'




class Subscription extends Component {

  constructor(props) {
    super(props);

  }
  render() {


    return (
    
      <div className=" col pt-1">
        <div className="  card mb-1">
          <div className="card-body">
          <NavLink to={'users/'+this.props.login} className={s.all}>
            <div className=" d-flex bd-highlight media  row align-self-start ">
            
                <img align="left" width="40" src={this.props.avatar} className={"flex-grow-3 col d-block " +s.uiW40+ " p-2 bd-highlight  rounded-circle ps-1 t "} alt=""></img>
               
                
                    <div align="left" className=" media-body ms-2 ps-2  col">
                    {this.props.login}
                    <div align="left" className="text-muted small">  {this.props.subscribers+" "}subscribers</div>
                    <div align="left" className="text-muted small">  {this.props.status}</div>
                    <div align="left" className="text-muted small">  {this.props.price/1000000000000000000} eth</div>
                    </div>

                <div align="center" className =" p-2 bd-highlight col">
                {
                  this.props.paid
                  ?<div  className="button  mt-2 d-flex flex-row align-items-center">
                  <button type="submit"  disabled className="btn mx-2  btn-sm btn-outline-primary w-100">subscribed</button>
                  </div>
              :
              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.subscribe(this.props.login,this.props.price)
                
                }}>
                    <div  className="button  mt-2 d-flex flex-row align-items-center">
                         <button type="submit" className="btn-l mx-2  btn-sm btn-outline-primary w-100">subscribe</button>
                    </div>
                </form>  
              }
                </div>
            
            </div>

            </NavLink>
          </div>

        </div>
      </div>
      
    );
  }
}

export default Subscription;