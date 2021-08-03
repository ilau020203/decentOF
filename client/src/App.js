import React, { Component } from "react";
import DecentOF from "./contracts/DecentOF.json";
import getWeb3 from "./getWeb3";
import Header from "./components/Header"
import Registration from "./components/Registration"
import Footer from "./components/Footer"
import Profile from "./components/Profile"
import UserPage from "./components/UserPage"
import Edit from "./components/Edit"
import Popular from "./components/Popular"
import Home from "./components/Home"
import Subscriptions from "./components/Subscriptions"
import "./App.css";
import { BrowserRouter as Router,Switch,Route,NavLink,Redirect} from "react-router-dom";
import { useHistory } from "react-router-dom";
import {getBytes32FromIpfsHash,getIpfsHashFromBytes32} from "./utils/ipfsDecode"

//import bootstrap from 'bootstrap'


const BigNumber = require('bignumber.js');
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


class App extends Component {
  state={
    'registration':true,
  'notRegistration':false
  }
  componentDidMount = async () => {
    try {

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
   
      const deployedNetwork = DecentOF.networks[networkId];
      const instance = new web3.eth.Contract(
        DecentOF.abi,
        deployedNetwork && deployedNetwork.address,
      );
     
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account, contract: instance } );
      const registration = await instance.methods.isRegistrated().call({from:account});
      const notRegistration=!registration;
      
      this.setState({ registration,notRegistration})
      if(registration){
          const myData =await instance.methods.getMyData().call({from:account});
          let status= myData[2]
          let avatar= "https://ipfs.infura.io/ipfs/"+getIpfsHashFromBytes32(myData[1])
          let login= myData[0]
          let price= myData[3]
          let subscribers=myData[4]
          this.setState({status,avatar,login,price,subscribers})
          this.setState({ loading: true })
          

      }else{

       
      }
      this.setState({ loading: false })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  
 
  

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]

    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
  
    }
  }

 captureFiles = event => {

    event.preventDefault()
    let buf=[];

    this.setState({buffer: [] })
    Object.entries(event.target.files).forEach(([key, value]) =>{
      

      const reader = new window.FileReader()
       reader.readAsArrayBuffer(value)
       let result = reader.onloadend = () => {
      buf.push( Buffer(reader.result))
    }

    this.setState({buffer:buf})

   
    })

  }
  tipImageOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.decentragram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }


     uploadPost = description=>{
        console.log("Submitting file to ipfs...")

    //adding file to the IPFS
  
    console.log(this.state.buffer)
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        alert("ipfs")
        return
      }
      result=result.map(value=>{
        return getBytes32FromIpfsHash(value.path)
      })

      this.setState({ loading: true })
      this.state.contract.methods.newPost(description,result.length,result).send({ from: this.state.account }
           ).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
   
  }

  
   createGet10NewPosts(){
    
   let itartionHomePosts =0;
   let postsHome=[];
   let max1Home=0;
   let max1HomeIndex=0;
   let  max2Home=0;
   let max2HomeIndex=0;
   let start=false;
  return async()=> {
    
    let out=[]
   
    const countSubscriptions = await   this.state.contract.methods.getCountSubscriptions().call({from:this.state.account});
     
    if(!!countSubscriptions){
     
    if(!postsHome.length){
       
    for(let i =0;i<countSubscriptions;i++)
    {

      if(i<postsHome.length+1){
      let count=await this.state.contract.methods.getSubscriptionCountPostByIdUser(i).call({from:this.state.account});
     
      
      if(count>0){
     
      let object = await this.state.contract.methods.getSubscriptionPostByIdUser(i,count-1).call({from:this.state.account})
      let item={object,count}
      
      postsHome.push(item)
     
      }else{
       postsHome.push({
         'count': 0 ,
         'object': [0,0,0,-1]
       })
      }
     
    }
      if(postsHome[postsHome.length-1].object[3]>max1Home){
        max1HomeIndex=i;
        max1Home=postsHome[postsHome.length-1].object[3]
      }else if(postsHome[postsHome.length-1].object[3]>max2Home){
        max2HomeIndex=i;
        max2Home=postsHome[postsHome.length-1].object[3]
      }
    }
  }
 
    while(out.length<10){
      
      if(max1Home>0){
     
      
      let data = await  this.state.contract.methods.getSubscriptions(max1HomeIndex).call({from:this.state.account})  //getSubscriptions
      out.push( {
          'images':postsHome[max1HomeIndex].object[1].map((byets)=>{
                return 'https://ipfs.infura.io/ipfs/'+getIpfsHashFromBytes32(byets)
                }),
          'description':postsHome[max1HomeIndex].object[2],
          'date':postsHome[max1HomeIndex].object[3],
          'avatar':'https://ipfs.infura.io/ipfs/'+getIpfsHashFromBytes32(data[1]),
          'login':data[0]
        })
        postsHome[max1HomeIndex].count--;
        if(postsHome[max1HomeIndex].count>0){
          
         
         
          postsHome[max1HomeIndex].object= await  this.state.contract.methods.getSubscriptionPostByIdUser(max1HomeIndex,postsHome[max1HomeIndex].count-1).call({from:this.state.account})
           if(postsHome[max1HomeIndex].object[3]>max2Home){
            max1Home=postsHome[max1HomeIndex].object[3];
            continue;
           }else
           {
              let t=max1HomeIndex;
              max1Home=max2Home;
              
              max1HomeIndex=max2HomeIndex;
              
              max2Home=postsHome[t].object[3];
              max2HomeIndex=t;
              
              
              for(let i=0;i<countSubscriptions;i++){
              
                if((postsHome[i].object[3]>max2Home)&&(i!=max1HomeIndex)){
                  max2Home=postsHome[i].object[3]
                  max2HomeIndex=i
                  
                }
              }
           }
        }else{
          
        postsHome[max1HomeIndex].object= [0,0,0,-1]
        
        
        max2Home=0;
          max1Home=0;
        for(let i=0;i<countSubscriptions;i++){
          if(postsHome[i].object[3]>max1Home){
            max1HomeIndex=i
            

            max1Home=postsHome[i].object[3]
          }else if(postsHome[i].object[3]>max2Home){
            max2HomeIndex=i
            max2Home=postsHome[i].object[3]
            }
        }
      }
      }
      else if(max2Home>0){
        
        let data = await  this.state.contract.methods.getSubscriptions(max2HomeIndex).call({from:this.state.account})  //getSubscriptions
      
        out.push( {
            'images':postsHome[max2HomeIndex].object[1].map((byets)=>{
                  return 'https://ipfs.infura.io/ipfs/'+getIpfsHashFromBytes32(byets)
                  }),
            'description':postsHome[max2HomeIndex].object[2],
            'date':postsHome[max2HomeIndex].object[3],
            'avatar':data[1],
            'login':data[0]
          })
          postsHome[max2HomeIndex].count--;
          if(postsHome[max2HomeIndex].count>0){
          postsHome[max2HomeIndex].object= await  this.state.contract.methods.getSubscriptionPostByIdUser(max2HomeIndex,postsHome[max2HomeIndex].count-1).call({from:this.state.account})
          
          
          max2Home=0;
          max1Home=0;
          for(let i=0;i<countSubscriptions;i++){
            if(postsHome[i].object[3]>max1Home){

              max1HomeIndex=i
              max1Home=postsHome[i].object[3]
            }else if(postsHome[i].object[3]>max2Home){
              max2HomeIndex=i
              max2Home=postsHome[i].object[3]
              }
          }
        }else{
          postsHome[max2HomeIndex].object= [0,0,0,-1]
          max2Home=0;
          max1Home=0;
          for(let i=0;i<countSubscriptions;i++){
            if(postsHome[i].object[3]>max1Home){
              max1HomeIndex=i

              max1Home=postsHome[i].object[3]
            }else if(postsHome[i].object[3]>max2Home){
              max2HomeIndex=i
              max2Home=postsHome[i].object[3]
              }
          }
        }
      }
      else return out;
    }
    itartionHomePosts++;
    return out;
  } return out;
  }
  }

   createGet10TopPopularAccount(){
    let i=0;
    return async()=>{
      i++;
      let subscribers=0;
      let out=[];
      let count= await this.state.contract.methods.getCountAccountBySubcribe(subscribers).call({from:this.state.account});
      if((i-1)*10>=count){
        return out;
      }
      
      while(count>=i*10){
         let count= await this.state.contract.methods.getCountAccountBySubcribe(Math.ceil(Math.exp(++subscribers))).call({from:this.state.account});
      }
      for(let i = count-1;i>=0;i--){
        let login=await this.state.contract.methods.getLoginFilterBySubcribe(i,Math.ceil(Math.exp(subscribers))).call({from:this.state.account});
        out.push(await this.getData(login))
      }
      return out;

    }

  }
  async getIsSubscribe(login){
    return await this.state.contract.methods.isSubucriberByLogin(login).call({from:this.state.account});
  }
  async getData(login){
    try {
      const data= await this.state.contract.methods.getDataByLogin(login).call({from:this.state.account});
      let paid=await this.getIsSubscribe(login)
      if (login==this.state.login)
      { paid=true;}
      let out={
        'login': data[0],
        'avatar': "https://ipfs.infura.io/ipfs/"+getIpfsHashFromBytes32(data[1]),
        'status': data[2],
        'price':data[3],
        'subscribers':data[4],
        'paid':paid
      }
      return out;
    } catch (error) {
      console.log(error)
    }
  }
  async getPosts(login){
    try {
      
      const id= await this.state.contract.methods.getIdByLogin(login).call({from:this.state.account});
      const count= await this.state.contract.methods.getSubscriptionCountPostByIdUser(id).call({from:this.state.account});
     let out=[];
     for(let i=count-1 ;i>=0;i--){
       out.push(await this.state.contract.methods.getSubscriptionPostByIdUser(id,i).call({from:this.state.account}))
     }
     return out;
    } catch (error) {
      console.log(error)
    }
  }
 async getMyPosts(){
   try {
     
     const count= await this.state.contract.methods.getMyCountPost().call({from:this.state.account});
    let out=[];
    for(let i=count-1 ;i>=0;i--){
      
      out.push(await this.state.contract.methods.getMyPostById(i).call({from:this.state.account}))
      
    }
    return out;
   } catch (error) {
     console.log(error)
   }
 }
   async  getMyCountPosts(){
   try {
     return await this.state.contract.methods.getMyCountPost().call({from:this.state.account});
   } catch (error) {
     console.log(error)
   }
   }
    async getMyPostsById(id){
    try {
      return await this.state.contract.methods.getMyPostById(id).call({from:this.state.account});
    } catch (error) {
     console.log(error)
    }
   }
   async getSubscriptions(){
    try {
      
      const count= await this.state.contract.methods.getCountSubscriptions().call({from:this.state.account});
     let out=[];
     for(let i=0 ;i<count;i++){
       let array=await this.state.contract.methods.getSubscriptions(i).call({from:this.state.account})
       let buf={
          login:array[0],
          avatar:"https://ipfs.infura.io/ipfs/"+getIpfsHashFromBytes32(array[1]),
          status:array[2],
          price:array[3],
          subscribers:array[4],
          paid:array[5]
       }
       out.push(buf)
     }
     return out;
    } catch (error) {
      console.log(error)
    }
  }

 subscribe(login,value,count=1){
   
  this.setState({ loading: true })
  this.state.contract.methods.subscribe(login,count).send({value:value, from: this.state.account }).on('transactionHash', (hash) => {
    this.setState({ loading: false })
 
}).then((result) => {
    window.location.reload();
  })
 }
  setLogin(login){
    this.setState({ loading: true })
      this.state.contract.methods.setLogin(login).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      window.location.reload();})
  }
  setStatus(status){
    this.setState({ loading: true })
      this.state.contract.methods.setStatus(status).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      window.location.reload();})
  }

  setPrice(price){
    this.setState({ loading: true })
      this.state.contract.methods.setPriceSubcribe(this.state.web3.utils.toWei(price, 'ether')) .send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      window.location.reload();})
  }
  setAvatarHash(){
     console.log("Submitting file to ipfs...")
    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
      this.setState({ loading: true })
      this.state.contract.methods.setAvatarHash(getBytes32FromIpfsHash(result[0].hash)).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      window.location.reload();
      })
    })
  }
  search = (Login)=>{
      this.setState({ loading: true })
      this.setState({searchLogin:Login})
      this.setState({ loading: false })
  }
  redirect =()=>{
    let x=this.state.searchLogin;
    this.state.searchLogin=null;
    return (<Redirect from="users/" to={"users/" + x} />)
  }
  registrate = (Status,Login,Price)=>{
    console.log("Submitting file to ipfs...")
    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
      this.setState({ loading: true })
      this.state.contract.methods.registration(Login,getBytes32FromIpfsHash(result[0].hash), Status,this.state.web3.utils.toWei(Price,'ether')).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      window.location.reload();
      })
    })
  }
  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0,
      web3: null,
      account: '',
      images: [],
      loading: true 
    }
    this.postsHome=[];
    const windowInnerWidth = document.documentElement.clientWidth
    const windowInnerHeight = document.documentElement.clientHeight
    this.setState({windowInnerHeight,windowInnerWidth})
    this.captureFiles=this.captureFiles.bind(this)
    this.uploadPost=this.uploadPost.bind(this)
    this.registrate=this.registrate.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.getMyPosts=this.getMyPosts.bind(this)
    this.getMyCountPosts=this.getMyCountPosts.bind(this)
    this.getMyPostsById=this.getMyPostsById.bind(this)
    this.setAvatarHash=this.setAvatarHash.bind(this)
    this.setPrice=this.setPrice.bind(this)
    this.setStatus=this.setStatus.bind(this)
    this.setLogin=this.setLogin.bind(this)
    this.search=this.search.bind(this)
    this.redirect=this.redirect.bind(this)
    this.getIsSubscribe=this.getIsSubscribe.bind(this)
    this.subscribe=this.subscribe.bind(this)
    this.getData=this.getData.bind(this)
    this.getPosts=this.getPosts.bind(this)
    this.getSubscriptions=this.getSubscriptions.bind(this)
    this.createGet10TopPopularAccount=this.createGet10TopPopularAccount.bind(this)
    this.createGet10NewPosts=this.createGet10NewPosts.bind(this)
  }
  
  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if(!this.state.notRegistration){
      return (
      
        <Router>

           
          <Switch>
        <div className="App">
      
          <Header 
          avatar={this.state.avatar}
          login={this.state.login}
          search={this.search}
          ></Header>
          
           { this.state.loading
           ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
           :this.state.searchLogin
           ? <main >
             <Route  path="/users" component={()=>{
               return(<Redirect  to="../" />)}}></Route>
          { 
              this.redirect()
          }
          {
              this.setState({searchLogin:false})
           }
           </main >
           :<main >
            <Route path="/users/" render={(routeProps) =>{
           return( <UserPage
            routeProps={routeProps}
            getData={this.getData}
            subscribe={this.subscribe}
            getPosts={this.getPosts}
            getIsSubscribe={this.getIsSubscribe}
            login={this.state.login}
           ></UserPage>)
          }}></Route>
          <Route path="/home" render={(routeProps) =>{
           return( <Home 
            routeProps={routeProps}
           ></Home>)
          }}></Route>
           <Route path="/Edit" render={() =>{
               return( <Edit 
                  setAvatarHash={this.setAvatarHash}
                  captureFile={this.captureFile}
                  setPrice={this.setPrice}
                  setStatus={this.setStatus}
                  setLogin={this.setLogin}
                  login={this.state.login}
                  status={this.state.status}
                  ptice={this.state.ptice}
                  avatar={this.state.avatar}

              ></Edit>)
          }}></Route>
          <Route path="/home" render={() =>{
           return( <Home 
            get10NewPost={this.createGet10NewPosts()}
    
           ></Home>)
          }}></Route>
          
          <Route path="/Popular" render={() =>{
           return( <Popular 
            get10TopPopularAccount={this.createGet10TopPopularAccount()}
           ></Popular>)
          }}></Route>
           <Route path="/Profile" render={() =>{
           return(
              <Profile 
              getMyCountPosts={this.getMyCountPosts}
              getMyPostsById={this.getMyPostsById}
              uploadPost={this.uploadPost}
              captureFile={this.captureFile}
              captureFiles={this.captureFiles}
              getMyPosts={this.getMyPosts}
              avatar={this.state.avatar}
              login={this.state.login}
              status={this.state.status}
              price={this.state.price}
              subscribers={this.state.subscribers}
           ></Profile>)
          }}></Route>
          <Route path="/Subscriptions" render={() =>{
           return( <Subscriptions 
                getSubscriptions={this.getSubscriptions}
           ></Subscriptions>)
          }}></Route>
          <Route exact path="/registration" component={()=>{return(<Redirect  to="/home" />)}} />
          <Route exact path="/" component={()=>{return(<Redirect  to="/home" />)}} />
          </main>
           }

           {/* <Footer className="footer" ></Footer> */}
        </div>
        </Switch>
        </Router>
        
      );
    }else{
      return(<Router> 
        <Redirect to="/registration" />
        <Route path="/registration" render={() =>{
         return( <Registration 
         registrate={this.registrate} 
         captureFile={this.captureFile}
         
         ></Registration>)
        }}>
        </Route>
        
      
      </Router>
      )
  }
}
}

export default App;
