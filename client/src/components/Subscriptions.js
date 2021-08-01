import React,  { useRef,useEffect,useLayoutEffect, useState , Component } from 'react';

import Subscription from './Subscription';
import 'bootstrap/dist/css/bootstrap.css'
import s from './Subscriptions.module.css'


const  Subscriptions=props=>{
  const [subscriptions,setSubscriptions]=useState([])

  useEffect(() => {
    async function getSubscriptions(){
      console.log(props.getSubscriptions)
      let buffer= await props.getSubscriptions()
      setSubscriptions(buffer)
      console.log("subscriptions",buffer)
    }
    getSubscriptions()
    
    return () => {
      
    }
  }, [])
  
  return (
      <>
        {subscriptions.length==0
        ?<div>no subscriptions</div>
        : <div className=" container posts-content col-lg-6" align="center">
          {subscriptions.map((subscription)=>{

            return(
              
              <Subscription
              login={subscription.login}
              avatar={subscription.avatar }
              status={subscription.status}
              price={subscription.price }
              subscribers={subscription.subscribers }
              paid={subscription.paid}
              ></Subscription>
            )
          })
           
          }
        </div>

        }
      </>
  );
  
}

export default Subscriptions;