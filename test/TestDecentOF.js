const DecentOF = artifacts.require('./DecentOF.sol')
const BigNumber = require('bignumber.js');
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('DecentOF',acccounts => {
  let decent_of
  dataAcccounts=[
    {
    'login':'ilrau',
    'avatarHash':'QmV8cfu6n4NT5xRrAHdKxsFMTZEJrA44qgrBCr739BN9Wb',
    'status':'asdf',
    'price':'1'
  }, {
    'login':'iddlu',
    'avatarHash':'QmV8cfu6n4NT5xRr2AHdKxFMTZEgJrA44qgrBCr739BN9Wb',
    'status':'asdf',
    'price':'2'

  }, {
    'login':'iu',
    'avatarHash':'QmV8cfu6n4NT5dxRrAHdKxFMTZEJrA44qgrBCr739BN9Wb',
    'status':'asdf',
    'price':'3'
  },
  {
    'login':'ilasdfau',
    'avatarHash':'QmV8cfu6nd4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb',
    'status':'asf',
    'price':'5'
  }
]
  posts=[
    {
      'description':'asdfsdf',
      
      'count':1,
      'hash':['asdf']
    },
    {
      'description':'asddddddf',
     
      'count':3,
      'hash':['asdf','asdfasdfrv43r34r3','csae4345465gggerfv34']
    }, {
      'description':'fsdf',
     
      'count':2,
      'hash':['asdf','asdfsdfsdfe']
    }, {
      'description':'asdf',
     
      'count':1,
      'hash':['asdf']
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
      await decent_of.registration(dataAcccounts[1].login,dataAcccounts[1].avatarHash,dataAcccounts[1].status,dataAcccounts[1].price ,{from: acccounts[1]})
      assert.equal(await decent_of.isRegistrated.call({from:acccounts[1]}), true,'test Registration and isRegistration')

    })
    it('my data', async () => {
      let  output = await decent_of.getMyData.call({from:acccounts[1]})
      let login = output[0];
      let hash = output[1];
      let status = output[2];
      let address = output[3];
      let price = BigNumber(output[4]);
      assert.equal(dataAcccounts[1].login, login, 'login is correct')
      assert.equal(dataAcccounts[1].avatarHash, hash, 'hash is correct')
      assert.equal(dataAcccounts[1].status, status, 'status is correct')
      assert.equal(acccounts[1], address, 'address is correct')
      assert.equal(dataAcccounts[1].price, price, 'price is correct')
    })
    //need more test
  })

  describe('new post',async() =>{
    it('addPost', async ()=>{
      await decent_of.newPost(posts[0].description,posts[0].count,posts[0].hash,{from: acccounts[1]})
      // FAILURE: User must is registration
      await decent_of.newPost(posts[0].description,posts[0].count,posts[0].hash,{from: acccounts[0]}).should.be.rejected
      // FAILURE: _imageCount dont't equal _hash.length
      await decent_of.newPost(posts[0].description,43,posts[0].hash,{from: acccounts[0]}).should.be.rejected
      
      let output= await decent_of.getMyPostById(0,{from: acccounts[1]})

      count= BigNumber(output[0]).toNumber()
      hash= output[1]
      description = output[2]
      date = BigNumber(output[3]).toNumber()

      assert.equal(posts[0].count, count, 'count is correct')

      assert.equal(posts[0].description, description, 'description is correct')
      assert.equal(posts[0].hash[0], hash[0], 'hash is correct')
    })
    //need more test

  })
  describe('subscribe', async ()=>{
    it('subcribe', async ()=>{
      await decent_of.registration(dataAcccounts[2].login,dataAcccounts[2].avatarHash,dataAcccounts[2].status,dataAcccounts[2].price ,{from: acccounts[2]})
      let logins =await decent_of.getLoginFilterBySubcribe(1,0,{from: acccounts[2]})
      await decent_of.subscribe(logins[0],1,{ from: acccounts[2], value: web3.utils.toWei('2', 'Ether') })
      assert.equal(await decent_of.getCountSubscriptions.call({from:acccounts[2]}),1,'subscribe is correct')
    })
    it('get posts', async ()=>{
       let count= await decent_of.getSubscriptionCountPostByIdUser(0,{from:acccounts[2]})
       assert.equal(count,1,'count post is correct')
       let output= await decent_of.getSubscriptionPostByIdUser(0,0,{from: acccounts[1]})

       count= BigNumber(output[0]).toNumber()
       hash= output[1]
       description = output[2]
      
 
       assert.equal(posts[0].count, count, 'count is correct')
       
       assert.equal(posts[0].description, description, 'description is correct')
       assert.equal(posts[0].hash[0], hash[0], 'hash is correct')
    })
    
  })

  
  
})