import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import s from './Footer.module.css'

class Footer extends Component {

  render() {
    return (
        <footer className=" footer mt-auto  py-2 bg-light">
        <div className="container">
          <span className="text-muted"></span>
        </div>
      </footer>
    );
  }
}

export default Footer;