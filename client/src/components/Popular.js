import React,  { useRef,useEffect,useLayoutEffect, useState  } from 'react';

import Subscription from './Subscription'
import 'bootstrap/dist/css/bootstrap.css'
import s from './Popular.module.css'
import InfiniteScroll from 'react-infinite-scroller';

  
 const  Popular=props=>{
 
 
  const [subscriptions,setSubscriptions]= useState( [])
  
  const [hasMorePosts,setHasMorePosts]=useState(true)
  const [start,setStart]=useState(false)
 

  async function getSubscriptions(){
    try {
      const newSubscriptions = await props.get10TopPopularAccount()
      if(newSubscriptions.length==0){
        setHasMorePosts(false)
      }else{
      setSubscriptions((subscriptions) => [...subscriptions, ...newSubscriptions]);
      }
      setStart(true)
    } catch (error) {
      console.error(error);
    }
    
  }
  
  useEffect(()=> {
  getSubscriptions()
  },[])
   return (
    <div   className=" container posts-content col-lg-6" align="center">
          { 
            subscriptions.map((subscription,i)=>{
              return( 
              
              <Subscription
              key={i}
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
           {!hasMorePosts
           ?<></>
            :<>{!start
                ?<></>
                :<><button className= "btn" onClick={getSubscriptions}>more</button></>
                
            }</>
           }
          
          
          
         
         
         
    
    </div>
   
          

     
    );
  
}

export default Popular;