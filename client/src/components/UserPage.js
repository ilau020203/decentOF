import React,  { useRef,useEffect,useLayoutEffect, useState , Component } from 'react';
import {getBytes32FromIpfsHash,getIpfsHashFromBytes32} from "../utils/ipfsDecode"
import UserProfile from './UserProfile'
import NewPost from './NewPost';
import Post from './Post'
import 'bootstrap/dist/css/bootstrap.css'
import s from './UserPage.module.css'
import InfiniteScroll from "react-infinite-scroll-component";
import { matchPath } from "react-router";
import { Redirect} from "react-router-dom";
  
 const  UserPage=props=>{
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, heigth: 0 });
  const [posts,setPosts]= useState( [])
  const [updatePost,setUpdatePost]=useState(true)
  const [hasMoretPosts,setHasMorePosts]=useState(true)
  const [isSubscribe,setIsSubscribe]=useState(false)
  const [data,setData]=useState(null)
 
  const { match, location, history } = props.routeProps;
  const login = matchPath(location.pathname, {
    path: "/users/:login",
    exact: true,
    strict: false
  }).params.login;
  
  

  useEffect(() => {
    async function getPosts() {

      const posts =await props.getPosts(login);
      setPosts(posts);
   }
   if(isSubscribe){
      getPosts();
    }
    return () => {
      
    }
  }, [isSubscribe])
  useEffect(() => {

    async function getData(){
      const data = await props.getData(login);
      setData(data);
    }

    async function getIsSubscribe(){

      const isSubscribe = await props.getIsSubscribe(login)
      setIsSubscribe(isSubscribe);

    }
     getData()
     getIsSubscribe()
  
     
  
    return () => {
      
    }
  }, [updatePost])
  
  function update(){
    if(updatePost){
    setUpdatePost(false)
    }
    else{ setUpdatePost(true)}
  }
  update=update.bind(this)
  // holds the timer for setTimeout and clearInterval
  let movement_timer = null;
  
  // the number of ms the window size must stay the same size before the
  // dimension state variable is reset
  const RESET_TIMEOUT = 100;
  
  const test_dimensions = () => {
    // For some reason targetRef.current.getBoundingClientRect was not available
    // I found this worked for me, but unfortunately I can't find the
    // documentation to explain this experience
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      });
    }
  };
  
  // This sets the dimensions on the first render
  useLayoutEffect(() => {
    test_dimensions();
     
  }, []);
  
  // every time the window is resized, the timer is cleared and set again
  // the net effect is the component will only reset after the window size
  // is at rest for the duration set in RESET_TIMEOUT.  This prevents rapid
  // redrawing of the component for more complex components such as charts
  window.addEventListener("resize", () => {
     
    clearInterval(movement_timer);
    movement_timer = setTimeout(test_dimensions, RESET_TIMEOUT);
  });
   return (
          <div ref={targetRef } className=" container justify-content-center  col-lg-6" align="center">
           { data!=null
            ?<div>{data.login!=""
            ?<div>{login!=props.login
            ?
            <>
           <UserProfile
           login={data.login}
           status={data.status}
           avatar={data.avatar }
           subscribers={data.subscribers}
           price={data.price}
           isSubscribe={isSubscribe}
           subscribe={props.subscribe}
           >
             
           </UserProfile>
         
         

          {/* 
           <InfiniteScroll
          dataLength={posts.length}
          next={getPosts}
          hasMore={hasMoretPosts}
          pullDownToRefreshThreshold={50}
          loader={<h4>Loading...</h4>}
          
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
         }
             > */}
          { !isSubscribe
          ?<div>
            <br></br>
            for see post need subscribe
            
          </div>
          :<div>{
            posts.map(post=>{
              
              return( 
              
              <Post
              images={post[1].map((byets)=>{
                return 'https://ipfs.infura.io/ipfs/'+getIpfsHashFromBytes32(byets)
                }
              )}
              avatar={data.avatar}
              description={post[2]}
              login={data.login}
              width={ dimensions.width-60} 
              date={post[3]*1000}
              ></Post>
              )
            })
            }
            </div>
           }
           {/* </InfiniteScroll> */}
          
         
         
         
    
      </>
      :<Redirect  to="/Profile" />
      }</div>
      :<div>
      <div id="loader" className="text-center mt-5"><p>Not found account {login}</p></div>
    </div>
    
    }</div>
    
    :
    <div>
      <div id="loader" className="text-center mt-5"><p>Not found account {login}</p></div>
    </div>
 }
    </div>
    
          

     
    );
  
}

export default UserPage;