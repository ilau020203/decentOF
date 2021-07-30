import React, { Component } from 'react';
import { BrowserRouter as Router,Switch,Route,NavLink,Link} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css'
import s from './UserProfile.module.css'

class UserProfile extends Component {

  render() {
    return (
       
    <div  className={s.border+"container mt-5 d-flex justify-content-center"+s.all}>
    <div className={s.card +" p-3"}>
        <div className="d-flex align-items-center">
            <div className="image  m-1"> <img src={this.props.avatar} class="rounded" width="300"></img> </div>
            <div className="ml-3 w-200">
                <h4 className="mb-0 mt-0">{this.props.login}</h4> <span>{this.props.status}</span>
                <div className={"p-2 mt-2 bg-primary d-flex justify-content-between rounded text-white "+s.stats}>
                    <div className="d-flex mx-2 flex-column"> <span className={s.articles}>Price</span> <span className={s.number1}>{this.props.price}</span> </div>
                    <div className="d-flex mx-2 flex-column"> <span className={s.followers}>Subscribers</span> <span className={s.number2}>{this.props.subscribers}</span> </div>
                   
                </div>
                {
                  this.props.isSubscribe
                  ?<div  className="button  mt-2 d-flex flex-row align-items-center">
                  <button type="submit"  disabled className="btn mx-2  btn-sm btn-outline-primary w-100">subscribed</button>
                  </div>
              :
              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.subscribe(this.props.login,this.props.price)
                
                }}>
                    <div  className="button  mt-2 d-flex flex-row align-items-center">
                         <button type="submit" className="btn mx-2  btn-sm btn-outline-primary w-100">subscribe</button>
                    </div>
                </form>  
  }
            </div>
        </div>
    </div>
</div>
    
    );
  }
}

export default UserProfile;