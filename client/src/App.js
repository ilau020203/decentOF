import React, { Component } from "react";
import DecentOF from "./contracts/DecentOF.json";
import getWeb3 from "./getWeb3";
import Header from "./components/Header"
import Registration from "./components/Registration"
import Footer from "./components/Footer"
import Profile from "./components/Profile"
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
      console.log(accounts)
      console.log("sdfsdf")
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
    /// console.log(await web3.eth.getBlock("pending").gasLimit())
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
          console.log(myData);
          let status= myData[2]
          let avatar= "https://ipfs.infura.io/ipfs/"+getIpfsHashFromBytes32(myData[1])
          let login= myData[0]
         console.log(login)
          let price= myData[3]
          let subscribers=myData[4]
          console.log(subscribers)
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
      console.log('result', this.state.buffer )
      

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
    let results=[];
    let res;
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
      this.state.contract.methods.setPriceSubcribe(parseInt(price)).send({ from: this.state.account }).on('transactionHash', (hash) => {
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
    return (<Redirect to={"users/" + x} />)
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
      this.state.contract.methods.registration(Login,getBytes32FromIpfsHash(result[0].hash), Status,parseInt(Price)).send({ from: this.state.account }).on('transactionHash', (hash) => {
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
    const windowInnerWidth = document.documentElement.clientWidth
    const windowInnerHeight = document.documentElement.clientHeight
    this.setState({windowInnerHeight,windowInnerWidth})
    this.captureFiles=this.captureFiles.bind(this)
    this.uploadPost=this.uploadPost.bind(this)
    this.registrate=this.registrate.bind(this)
   // this.uploadImage = this.uploadImage.bind(this)
    //this.tipImageOwner = this.tipImageOwner.bind(this)
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
          { 
              this.redirect()
           }
           </main >
           :<main >
          
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
           return( <Subscriptions 
    
           ></Subscriptions>)
          }}></Route>
          
          <Route path="/Popular" render={() =>{
           return( <Popular 
            
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
           
           ></Subscriptions>)
          }}></Route>
          <Route exact path="/registration" component={()=>{return(<Redirect  to="/home" />)}} />
          <Route exact path="/" component={()=>{return(<Redirect  to="/home" />)}} />
          </main>
           }

           <Footer className="footer" ></Footer>
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
