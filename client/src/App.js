import React, { Component } from "react";
import DecentOF from "./contracts/DecentOF.json";
import getWeb3 from "./getWeb3";
import Header from "./components/Header"
import Registration from "./components/Registration"
import Footer from "./components/Footer"
import Profile from "./components/Profile"
import Popular from "./components/Popular"
import Home from "./components/Home"
import Subscriptions from "./components/Subscriptions"
import "./App.css";
import { BrowserRouter as Router,Switch,Route,NavLink,Redirect} from "react-router-dom";
import { useHistory } from "react-router-dom";
import {getIpfsHashFromBytes32,getBytes32FromIpfsHash} from "./utils/ipfsDecode"
//import bootstrap from 'bootstrap'



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
          let status= myData[0]
          let avatar= getIpfsHashFromBytes32(myData[1])
          let login= myData[2]
         
          let price= myData[4]
          console.log(avatar)
          this.setState({status,avatar,login,price})
          this.setState({ loading: true })
    // this.state.contract.methods.subscribe('ilau',1).send({ from: this.state.account, value: this.state.web3.utils.toWei('5', 'Ether') }).estimateGas({gas: 5000000}, function(error, gasAmount){
    // if(gasAmount == 5000000)
    //     console.log('Method ran out of gas');
// });

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
    console.log(event.target.files)
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

 captureFiles = event => {

    event.preventDefault()
    let buf=[];
    console.log("this") 
    this.setState({buffer: [] })
    Object.entries(event.target.files).forEach(([key, value]) =>{
      
      console.log(1)
      const reader = new window.FileReader()
       reader.readAsArrayBuffer(value)
       let result = reader.onloadend = () => {
      console.log("thisdsssss")
         
      console.log('buffer', Buffer(reader.result) )

      
      buf.push( Buffer(reader.result))
      console.log('result', this.state.buffer )
      

    }
    console.log(buf)
    this.setState({buffer:buf})
    console.log('resultууа')
   
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

    this.state.buffer.map(value=>{ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
         console.log("_________________")
        console.log(this.state.buffer)
        console.log(result[0])

         console.log("_________________")
         console.log("_________________")
         console.log("_________________")
        console.error(error)
        alert("ipfs")
        return
      }
      results.push(result[0].hash)
      console.log(result[0].hash)


  
    })
    })
    console.log(results)
      this.setState({ loading: true })
      this.state.contract.methods.newPost(description,results.length,results.map(getBytes32FromIpfsHash)).send({ from: this.state.account 
           
      })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false })
      console.log("_________________")

      })
      
   }



  registrate = (Status,login,Price)=>{
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
      console.log("_________________")

      this.setState({ loading: true })
      this.state.contract.methods.registration(login,getBytes32FromIpfsHash(result[0].hash), Status,parseInt(Price)).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      console.log("_________________")
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
    this.captureFiles=this.captureFiles.bind(this)
    this.uploadPost=this.uploadPost.bind(this)
    this.registrate=this.registrate.bind(this)
   // this.uploadImage = this.uploadImage.bind(this)
    //this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
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
          <Header account={this.state.account} 
          avatar={this.state.avatar}
          login={this.state.login}
          ></Header>
           { this.state.loading
           ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
           :<main >
          <Redirect from="/registration" to="/home" />
          <Route path="/home" render={() =>{
           return( <Home 
       
           ></Home>)
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
              uploadPost={this.uploadPost}
              captureFile={this.captureFile}
             captureFiles={this.captureFiles}
           ></Profile>)
          }}></Route>
          <Route path="/Subscriptions" render={() =>{
           return( <Subscriptions 
       
           ></Subscriptions>)
          }}></Route>
  
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
