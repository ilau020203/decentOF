import React,  { useRef,useEffect,useLayoutEffect, useState  } from 'react';

import Post from './Post'
import 'bootstrap/dist/css/bootstrap.css'
import s from './Home.module.css'
import InfiniteScroll from 'react-infinite-scroller';

  
 const  Home=props=>{
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, heigth: 0 });
  const [posts,setPosts]= useState( [])
  const [updatePost,setUpdatePost]=useState(true)
  const [hasMorePosts,setHasMorePosts]=useState(true)
  const [start,setStart]=useState(false)
 
  
  
  
 
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
  async function getPosts(){
    try {
      const newPosts = await props.get10NewPost()
      
      if(newPosts.length==0){
        setHasMorePosts(false)
      }else{
      setPosts((post) => [...post, ...newPosts]);
      }
      setStart(true)
    } catch (error) {
      console.error(error);
    }
    
  }
  
  useEffect(()=> {
  getPosts()

  },[])
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
        



        
        
          { 
            posts.map((post,i)=>{
              
              return( 
              
              <Post
              key={i}
              images={post.images}
              avatar={post.avatar}
              description={post.description}
              login={post.login}
              width={ dimensions.width-60} 
              date={post.date*1000}
              ></Post>
              
              
              )
            })
           }
           {!hasMorePosts
           ?<></>
            :<>{!start
                ?<></>
                :<><button className= "btn" onClick={getPosts}>more</button></>
                
            }</>
           }
          
    
         
         
         
    
    </div>
   
          

     
    );
  
}

export default Home;