import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.css'
import s from './Header.module.css'
import { BrowserRouter as Router,Switch,Route,NavLink,Link} from "react-router-dom";

class Header extends Component {

  render() {
  console.log( s)
    return (
      <nav className={"navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow "+s.all}>
        <NavLink to="/home"
          className={"navbar-brand col-sm-3 col-md-2 mr-0 "+s.all}
         
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          DecentOF
        </NavLink>
        <div className={"container "+s.all}>
    <div className={"d-flex justify-content-center py-3 "+s.all}>
      <ul className={"nav nav-pills "+s.all}>
        <li className="nav-item"><NavLink to="/home" className={"nav-link "+s.all} activeClassName="active" aria-current="page">Home</NavLink></li>
        <li className="nav-item"><NavLink to="/Subscriptions" className={"nav-link "+s.all} activeClassName="active">Subscriptions</NavLink></li>
        <li className="nav-item"><NavLink to="/Popular" className="nav-link"  activeClassName="active">Popular</NavLink></li>
        <li className="nav-item"><NavLink to="/Profile" className="nav-link" activeClassName="active">Profile</NavLink></li>
      </ul>
    </div>
  </div>
   <form className="d-flex" onSubmit={(event) => {
                event.preventDefault()
                const login = this.login.value
                this.props.search(login);
              }}>
        <input className={s.search+"  mx-0 me-2"} ref={(input) => { this.login = input }} type="search" placeholder="Search" aria-label="Search"></input>
        <button className="btn btn-outline-success" type="submit">Search</button>
    </form>
  <NavLink to="/Profile" className= {s.noneDerocation}>
        <ul className="navbar-nav px-2">
        
          <li className="nav-item text-nowrap ">
            <small className={"text-secondary "+s.noneDerocation}>
             {this.props.login}&nbsp;&nbsp;
            </small>
            
            <img
              alt=""

                className={'ml-2 '+s.avatar}
                height='40'
               
                src={this.props.avatar}
              ></img>
          </li>
         
        </ul>
        </NavLink>
      </nav>
    );
  }
}

export default Header;