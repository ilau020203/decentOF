import React  from 'react';
import { BrowserRouter as Router,Switch,Route,NavLink,Link} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css'
import s from './UserProfile.module.css'

const UserProfile =props=> {

  
    return (
       
    <div  className={" mt-5 d-flex justify-content-center "+s.all}>
    <div className={s.card +" p-3"}>
        <div className="d-flex align-items-center">
            <div className="image  m-1"> <img src={props.avatar} class={s.image}></img> </div>
            <div className="ml-3 w-200">
                <h4 className="mb-0 mt-0">{props.login}</h4> <span>{props.status}</span>
                <div className={"p-2 mt-2 bg-primary d-flex justify-content-between rounded text-white "+s.stats}>
                    <div className="d-flex mx-2 flex-column"> <span className={s.articles}>Price</span> <span className={s.number1}>{props.price/1000000000000000000} eth</span> </div>
                    <div className="d-flex mx-2 flex-column"> <span className={s.followers}>Subscribers</span> <span className={s.number2}>{props.subscribers}</span> </div>
                   
                </div>
                {
                  props.isSubscribe
                  ?<div  className="button  mt-2 d-flex flex-row align-items-center">
                  <button type="submit"  disabled className="btn mx-2  btn-sm btn-outline-primary w-100">subscribed</button>
                  </div>
              :
              <form onSubmit={(event) => {
                event.preventDefault()
                props.subscribe(props.login,props.price)
                
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

export default UserProfile;