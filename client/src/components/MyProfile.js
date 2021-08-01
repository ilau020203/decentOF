import React from 'react';
import { BrowserRouter as Router,Switch,Route,NavLink,Link} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css'
import s from './MyProfile.module.css'

const MyProfile =props=> {

  
    return (
       
    <div  className={s.border+"container mt-5 d-flex justify-content-center"}>
    <div className={s.card +" p-3"}>
        <div className="d-flex align-items-center">
            <div className="image  m-1"> <img src={props.avatar} className={s.image} width="200"></img> </div>
            <div className="ml-3 w-200">
                <h4 className="mb-0 mt-0">{props.login}</h4> <span>{props.status}</span>
                <div className={"p-2 mt-2 bg-primary d-flex justify-content-between rounded text-white "+s.stats}>
                    <div className="d-flex mx-2 flex-column"> <span className={s.articles}>Price</span> <span className={s.number1}>{props.price/1000000000000000000} eth</span> </div>
                    <div className="d-flex mx-2 flex-column"> <span className={s.followers}>Subscribers</span> <span className={s.number2}>{props.subscribers}</span> </div>
                   
                </div>
                <NavLink to="/Edit"><div  className="button  mt-2 d-flex flex-row align-items-center"> <button className="btn mx-2  btn-sm btn-outline-primary w-100">Edit</button>  </div></NavLink>
            </div>
        </div>
    </div>
</div>
    
    );
  
}

export default MyProfile;