const DecentOF = artifacts.require('./DecentOF.sol')
const BigNumber = require('bignumber.js');
const bs58= require('bs58')


function getBytes32FromIpfsHash(ipfsListing) {
  return "0x"+bs58.decode(ipfsListing).slice(2).toString('hex')
}

// Return base58 encoded ipfs hash from bytes32 hex string,
// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"
//
function getIpfsHashFromBytes32(bytes32Hex) {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex');
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('DecentOF',acccounts => {
  let decent_of
  dataAcccounts=[
    {
    'login':'ilrau',
    'avatarHash':'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
    'status':'asdf',
    'price':'1'
  }, {
    'login':'id',
    'avatarHash':'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
    'status':'asdf',
    'price':'2'

  }, {
    'login':'iu',
    'avatarHash':'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
    'status':'asdf',
    'price':'3'
  },
  {
    'login':'ilasdfau',
    'avatarHash':'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
    'status':'asf',
    'price':'5'
  }
]
  posts=[
    {
      'description':'asdfsdf',
      
      'count':1,
      'hash':['QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB']
    },
    {
      'description':'asddddddf',
     
      'count':3,
      'hash':['QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB','QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB','QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB']
    }, {
      'description':'fsdf',
     
      'count':2,
      'hash':['QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB','QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB']
    }, {
      'description':'asdf',
     
      'count':1,
      'hash':['QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB']
    },
  ]
  before(async () => {
    decent_of = await DecentOF.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decent_of.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decent_of.getName()
      assert.equal(name, 'DecentOF')
    })
  })
  describe('registration',async()=>{
    it('registrate', async () => {
      assert.equal(await decent_of.isRegistrated.call({from:acccounts[1]}), false,'test function isRegistration')
      await decent_of.registration((dataAcccounts[1].login),(getBytes32FromIpfsHash(dataAcccounts[1].avatarHash)),dataAcccounts[1].status,dataAcccounts[1].price ,{from: acccounts[1]})
      .then(function(gasAmount){
        console.log(gasAmount);
    })
    .catch(function(error){
        console.log(error);
    });
      assert.equal(await decent_of.isRegistrated.call({from:acccounts[1]}), true,'test Registration and isRegistration')
    //   truffleAssert.eventEmitted(tx, 'uintLog', (ev) => {
    //     console.log(ev.lof)
    // });
    })
    it('my data', async () => {
      let  output = await decent_of.getMyData.call({from:acccounts[1]})
      let login = (output[0]);
      let hash =getIpfsHashFromBytes32(( output[1]));
      let status = output[2];
      let address = output[3];
      let price = BigNumber(output[4]);
     
      assert.equal(dataAcccounts[1].avatarHash, hash, 'hash is correct')
      assert.equal(dataAcccounts[1].login, login, 'login is correct')
      assert.equal(dataAcccounts[1].status, status, 'status is correct')
      assert.equal(acccounts[1], address, 'address is correct')
      assert.equal(dataAcccounts[1].price, price, 'price is correct')
    })
    //need more test
  })

  describe('new post',async() =>{
    it('addPost', async ()=>{
      
    console.log(posts[0].count)
    await decent_of.newPost(posts[0].description,posts[0].count,posts[0].hash.map(getBytes32FromIpfsHash),{from: acccounts[1]})

    //   .then(function(gasAmount){
    //     console.log(gasAmount);
    // })
    // .catch(function(error){
    //     console.log(error);
    // });
    //   truffleAssert.eventEmitted(tx, 'uintLog', (ev) => {
    //     console.log(ev.lof)
    // });
     
      // FAILURE: User must is registration
      await decent_of.newPost(posts[0].description,posts[0].count,posts[0].hash.map(getBytes32FromIpfsHash),{from: acccounts[0]}).should.be.rejected
      // FAILURE: _imageCount dont't equal _hash.length
      await decent_of.newPost(posts[0].description,43,posts[0].hash.map(getBytes32FromIpfsHash),{from: acccounts[0]}).should.be.rejected
      
      let output= await decent_of.getMyPostById(0,{from: acccounts[1]})

      count= BigNumber(output[0]).toNumber()
      hash= output[1].map(getIpfsHashFromBytes32)
      description = output[2]
      

      assert.equal(posts[0].count, count, 'count is correct')

      assert.equal(posts[0].description, description, 'description is correct')
      assert.equal(posts[0].hash[0], hash[0], 'hash is correct')
    })
    //need more test

  })
  describe('subscribe', async ()=>{
    it('subcribe', async ()=>{
      await decent_of.registration(dataAcccounts[2].login,getBytes32FromIpfsHash(dataAcccounts[2].avatarHash),dataAcccounts[2].status,dataAcccounts[2].price ,{from: acccounts[2]})
      //let logins =await decent_of.getLoginFilterBySubcribe(1,0,{from: acccounts[2]})
      await decent_of.subscribe(dataAcccounts[1].login,1,{ from: acccounts[2], value: web3.utils.toWei('2', 'wei') })
      //assert.equal(await decent_of.getCountSubscriptions.call({from:acccounts[2]}),1,'subscribe is correct')
    })
    it('get posts', async ()=>{
      let count= await decent_of.getSubscriptionCountPostByIdUser(0,{from:acccounts[2]})
       assert.equal(count,1,'count post is correct')
       let output= await decent_of.getSubscriptionPostByIdUser(0,0,{from: acccounts[2]})

       count= BigNumber(output[0]).toNumber()
       hash= output[1].map(getIpfsHashFromBytes32)
       description = output[2]
      
 
       assert.equal(posts[0].count, count, 'count is correct')
       
       assert.equal(posts[0].description, description, 'description is correct')
       assert.equal(posts[0].hash[0], hash[0], 'hash is correct')
    })
    
  })

  
  
})