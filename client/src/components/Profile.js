import React,  { useRef,useEffect,useLayoutEffect, useState , Component } from 'react';
import {getBytes32FromIpfsHash,getIpfsHashFromBytes32} from "../utils/ipfsDecode"
import MyProfile from './MyProfile'
import NewPost from './NewPost';
import Post from './Post'
import 'bootstrap/dist/css/bootstrap.css'
import s from './Profile.module.css'
import InfiniteScroll from "react-infinite-scroll-component";

  
 const  Profile=props=>{
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, heigth: 0 });
  const [posts,setPosts]= useState( [])
  const [updatePost,setUpdatePost]=useState(true)
  const [hasMoretPosts,setHasMorePosts]=useState(true)
  // const getPosts=null

  // async function getMorePost(){
  //   let count= await props.getMyCountPosts();
  //   let i =count;
  //    console.log("aaaa")
  //   return  function (){
  //      console.log("dfsga")
  //     if(!!i){

  //      posts.push( props.getMyPostsById(--i))
  //      setPosts(posts)
      

  //     }else{
  //       setHasMorePosts(false)
  //     }
  //   };

    
  // }

  // useEffect(()=>{
  //    async function getMyPosts() {
  //        const getPosts = await getMorePost();
         
  //    }
  //    getMyPosts();
  //    console.log(getPosts);
  // }, [updatePost])
  useEffect(() => {
    
    async function getMyPosts() {
        const posts =await props.getMyPosts();
         setPosts(posts);
     }
     getMyPosts();
     
  
    return () => {
      
    }
  }, [updatePost])
  
  function update(){
    if(updatePost){
    setUpdatePost(false)
    }
    else{ setUpdatePost(true)}
    console.log('update')
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
          <div ref={targetRef } className=" container posts-content col-lg-6" align="center">
           <MyProfile
           login={props.login}
           status={props.status}
           avatar={props.avatar }
           subcribe={props.subscribers}
           price={props.price}
           >
             
           </MyProfile>
         
          <NewPost
          uploadPost={props.uploadPost}
          update={update}
          captureFile={props.captureFile}
          captureFiles={props.captureFiles}
          >
           </NewPost>


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
          { 
            posts.map(post=>{
              
              return( 
              
              <Post
              images={post[1].map((byets)=>{
                return 'https://ipfs.infura.io/ipfs/'+getIpfsHashFromBytes32(byets)
                }
              )}
              avatar={props.avatar}
              description={post[2]}
              login={props.login}
              width={ dimensions.width-60} 
              date={post[3]*1000}
              ></Post>
              )
            })
           }
           {/* </InfiniteScroll> */}
          
         
         
         
    
    </div>
   
          

     
    );
  
}

export default Profile;