import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import s from './Edit.module.css'

class Edit extends Component {

  render() {
    return (     
      <div className={s.main}>
      <div className={s.form_signin}>
     <h1 className="h3 mb-3 fw-normal">Editor your page</h1>
     <form onSubmit={(event) => {
             event.preventDefault()
             this.props.setLogin(this.Login.value)
             
             }}>
        <div className="form-floating">
            <input type="login" className="form-control" id="floatingInput" placeholder={this.props.login} ref={(input) => { this.Login = input }}></input>
            <label htmlFor="floatingInput">Login</label>
        </div>
     <button className="w-100 btn btn-lg btn-primary" type="submit">save</button>
   </form>

    
    <form onSubmit={(event) => {
             event.preventDefault()
             this.props.setAvatarHash()
             
             }}>
     <label htmlFor="avatar" className="form-label">Avatar Image</label>
     <img src = {this.props.avatar} width="100%"></img>
     <div className="input-group mb-3">
     <input type="file" className="form-control" id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" aria-label="Upload" onChange={this.props.captureFile}></input>
     </div>
     <button className="w-100 btn btn-lg btn-primary" type="submit">save</button>
   </form>



   <form onSubmit={(event) => {
             event.preventDefault()
             this.props.setPrice(this.Price.value)

             }}>
       <label htmlFor="avatar" className="form-label">Price your subscribe</label>
     <div className="input-group mb-3">
      <span className="input-group-text">eth</span>
     <input type="number" className="form-control" placeholder={this.props.price} ref={(input) => { this.Price = input }}  aria-label="Amount (to the nearest eth)"></input>
     </div>
    
     <button className="w-100 btn btn-lg btn-primary" type="submit">save</button>
   </form>

     <form onSubmit={(event) => {
             event.preventDefault()
             this.props.setStatus(this.Status.value)
             
             }}>
     <div className="input-group mb-3">
     <span className="input-group-text" id="inputGroup-sizing-default">Status</span>
     <input type="text" className="form-control" placeholder={this.props.status}  ref={(input) => { this.Status = input }}  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" ></input>
     </div>
     <button className="w-100 btn btn-lg btn-primary" type="submit">save</button>
   </form>


 
   </div>

   
   </div>
  
  

    );
  }
}

export default Edit;