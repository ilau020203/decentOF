import React from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import s from './Edit.module.css'

const Edit =props=>{

  let Status,Login,Price;
    return (     
   
      <div className=" container justify-content-center  col-lg-6" align="center">
     <h1 className="h3   mb-3 fw-normal">Editor your profile</h1>
     <div className="align-self-start row">
     <form className="col" onSubmit={(event) => {
             event.preventDefault()
             props.setAvatarHash()
             
             }}>
    
     <img className={s.image} src = {props.avatar} width="100%"></img>
     <div className="row p-1 ps-0 " >
     <div className={"input-group mb-3 col "+s.inputFile}>
     <input type="file" className="form-control" size="40" onChange={props.captureFile}></input>
     </div>
     <button className={"w-100 btn btn-sm btn-primary col mb-3 pb-1 "+s.button}  type="submit">save</button>
     </div>
   </form>



    <div className="col">
    <form className="col" onSubmit={(event) => {
             event.preventDefault()
             props.setLogin(Login.value)
             
             }}>
        <div className="row p-1 ps-0">
        <div className={"form-floating col "+s.input}>
        <div className="input-group mb-3">
        <span className="input-group-text">Login</span>
            <input type="login" className="form-control" id="floatingInput" placeholder={props.login} ref={(input) => { Login = input }}></input>
        </div>
        </div>

     <button className="w-100 btn btn-sm btn-primary col mb-3 pb-1" type="submit">save</button>
     </div>
   </form>
    



   <form onSubmit={(event) => {
             event.preventDefault()
             props.setPrice(Price.value)

             }}>
      <div className="row p-1 ps-0">
       
     <div className={"input-group mb-3 col "+s.input}>
      <span className="input-group-text">ether</span>
     <input type="number" step="any" className="form-control" placeholder={props.price} ref={(input) => { Price = input }}  aria-label="Amount (to the nearest eth)"></input>
     </div>
    
     <button className="w-100 btn btn-sm btn-primary col mb-3 pb-1" type="submit">save</button>
     </div>
   </form>

     <form onSubmit={(event) => {
             event.preventDefault()
             props.setStatus(Status.value)
             
             }}>
      <div className="row p-1 ps-0">
     <div className={"input-group mb-3 col "+s.input}>

     <span className="input-group-text" id="inputGroup-sizing-default">Status</span>
     
     <input type="text" className="form-control" placeholder={props.status}  ref={(input) => { Status = input }}  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" ></input>
     </div>
     
     <button className={"w-100 btn btn-sm btn-primary col mb-3 pb-1 "} type="submit">save</button>
     </div>
   </form>

   </div>
   </div>
   </div>

   
 
  
  

    );
  
}

export default Edit;