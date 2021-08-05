import React, { Component } from 'react';
import s from './Registration.module.css'
import 'bootstrap/dist/css/bootstrap.css'

const Registration =props=>{

    let Status,Login,Price;
    return (
      
      <div className={s.main}>
         <div className={s.form_signin}>
        <form onSubmit={(event) => {
                event.preventDefault()
                props.registrate(Status.value,Login.value,Price.value)
                
                }}>

        
        
        <img className="mb-4" src="https://upload.wikimedia.org/wikipedia/en/c/cc/OnlyFans_logo.svg" alt="" width="400" height="200">
        </img>

        <h1 className="h3 mb-3 fw-normal">Please sign up</h1>
    
        <div className="form-floating">
          <input type="login" className="form-control" id="floatingInput" placeholder="Login"ref={(input) => { Login = input }}></input>
          <label htmlFor="floatingInput">Login</label>
        </div>
        
        <label htmlFor="avatar" className="form-label">Avatar Image</label>
        <div className="input-group mb-3">
        <input type="file"   className="form-control" id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" aria-label="Upload" onChange={props.captureFile}></input>
        </div>
          <label htmlFor="avatar" className="form-label">Price your subscribe</label>
        <div className="input-group mb-3">
         <span className="input-group-text">eth</span>
        <input type="number"  step="any" className="form-control" ref={(input) => { Price = input }}  aria-label="Amount (to the nearest eth)"></input>
        </div>
        <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">Status</span>
        <input type="text" className="form-control"  ref={(input) => { Status = input }}  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" ></input>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
        
      
    
        
       
      </form>
    
      </div>

      
      </div>
     
     

    );
  
}

export default Registration;