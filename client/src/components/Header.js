import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.css'
import s from './Header.module.css'
import { BrowserRouter as Router,Switch,Route,NavLink,Link} from "react-router-dom";

class Header extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <NavLink to="/home"
          className="navbar-brand col-sm-3 col-md-2 mr-0"
         
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          DecentOF
        </NavLink>
        <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li className="nav-item"><NavLink to="/home" className="nav-link" activeClassName="active" aria-current="page">Home</NavLink></li>
        <li className="nav-item"><NavLink to="/Subscriptions" className="nav-link" activeClassName="active">Subscriptions</NavLink></li>
        <li className="nav-item"><NavLink to="/Popular" className="nav-link"  activeClassName="active">Popular</NavLink></li>
        <li className="nav-item"><NavLink to="/Profile" className="nav-link" activeClassName="active">Profile</NavLink></li>
      </ul>
    </header>
  </div>
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
               
                src={`https://ipfs.infura.io/ipfs/${this.props.avatar}`}
              ></img>
          </li>
         
        </ul>
        </NavLink>
      </nav>
    );
  }
}

export default Header;