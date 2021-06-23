pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "./library/stringUtils.sol";


contract DecentOF{
     using StringUtils for string;
    string  name="DecentOF";
    struct Post{
        uint8 imageCount;
        string[] hash;
        string description;
        uint tipAmount;
        bool visibility;
        uint256 date;
        address payable author;
    }
    struct Subscribe{
        uint256 id;
        uint256 date;
        bool paid;
    }
    struct Account{
        uint256 countPosts;
        mapping(uint256=>Post) posts;
        mapping(uint64=>Subscribe) subscription;
        uint64  countsSubscription;
        string login;
        string avatarHash;
        string status;
        uint256 subscribers;
        address payable author;
        uint256 priceSubcribe;
        uint256 date;
    }
    mapping(uint256=>Account) internal  accounts;
    uint256 internal accountsCount;
    event Subscribed(
        string login
       );
    event UnSubscribed(
        string login
       );
    
    function isUniqueLogin(string memory _input) public view returns(bool){
        for(uint256 i=0;i<accountsCount;i++){
            if(keccak256(abi.encode(_input)) ==keccak256(abi.encode(accounts[i].login))){
                return false;
            }
        }
        return true;
    }
    modifier _isUniqueLogin(string memory input){
        require(isUniqueLogin(input),"this login is used");
        _;
    }
    modifier _loginIsUsed(string memory input){
        require(!isUniqueLogin(input),"this login dont exist");
        _;
    }
    
    modifier isOwner(address id){
        require(msg.sender==id,"Caller is not owner");
        _;
    }
    function isRegistrated() public view returns(bool){
        for(uint256 i=0;i<accountsCount;i++){
            if(msg.sender==accounts[i].author){
                return true;
            }
        }
        return false;
    }
     modifier _isRegistrated(){
         require(isRegistrated(),"users haven\'t account ,please register");
        _;
    }
   
   function getMyCountPost()
    _isRegistrated public
    view returns(uint256)
    {
        return accounts[findIdByAddress()].countPosts;
    }

    function getMyPostById(uint256 _index)
    _isRegistrated public
    view returns(uint8 ,
        string[] memory,
        string memory,
        uint256 
        )
    {
        uint256 id =findIdByAddress();
        require(accounts[id].countPosts>_index);
        uint8 imageCount = accounts[id].posts[_index].imageCount;
        string[] memory hash = accounts[id].posts[_index].hash;
        string memory  description = accounts[id].posts[_index].description;
        uint256 date = accounts[id].posts[_index].date;
        return(imageCount,hash,description,date);
    }
     function findIdByAddress() 
     public view returns(uint256)
     {
        for(uint256 i=0;i<accountsCount;i++){
            if(msg.sender==accounts[i].author){
                return i;
            }
        }
        return uint256(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
    }
    function registration(string memory _login,string memory _avatarHash,string memory _status,uint256 _priceSubcribe) 
        public  
        {
        require(bytes(_login).length>0,"_login's length must be bigger than 0");
        require(bytes(_avatarHash).length>0,"_avatarHash's length must be bigger than 0");
        require(bytes(_status).length>0,"_status's length must be bigger than 0");
        require(!isRegistrated(),"this user is register");
        
        Account storage c=accounts[accountsCount++];
        c.login=_login;
        c.avatarHash=_avatarHash;
        c.countPosts=0;
        c.status=_status;
        c.author=(msg.sender);
        c.subscribers=0;
        c.priceSubcribe=_priceSubcribe;
    }
    function newPost(string memory _description,uint8 _imageCount,string[] memory _hash)
    public  _isRegistrated 
    {
        require(_imageCount==_hash.length,"_imageCount dont\'t equal _hash.length");
        uint256 id=findIdByAddress();
        
        // console.log(accounts[findIdByAddress()])
         
        accounts[id].date=(uint256(block.timestamp));
        Post storage c=accounts[id].posts[accounts[id].countPosts];
        accounts[id].countPosts++;
        c.description =_description;
        c.date=(uint256(block.timestamp));
        c.visibility=true;
        c.author=(msg.sender);
        c.imageCount=_imageCount;
        c.hash = new string[](_imageCount);
        for(uint i =0;i<_imageCount;i++){
            c.hash[i]=_hash[i];
        }
        checkSubscription();
    }
    
    function getMyData()  _isRegistrated
    public view returns(
        string memory,
        string memory,
        string memory,
        address payable,
        uint256
        ) 
    {
        Account  storage  buf= accounts[findIdByAddress()];
        string memory login=buf.login;
        string memory avatarHash=buf.avatarHash;
        string memory status=buf.status;
        address payable author=buf.author;
        uint256 priceSubcribe=buf.priceSubcribe;
        return (login,avatarHash,status,author,priceSubcribe);
    }
    
    function setStatus(string memory input)
    public _isRegistrated
    {
        accounts[findIdByAddress()].status=input;
    }
    function setAvatarHash(string memory input)
    public _isRegistrated
    {
        accounts[findIdByAddress()].avatarHash=input;
    }
    function setLogin(string memory input)
    public _isRegistrated _isUniqueLogin(input)
    {
        accounts[findIdByAddress()].login=input;
    }
    
    //to do that
    function getMyAllPosts(bool reverse )
    public  _isRegistrated 
    view returns(Post[] memory )  
    {
        uint256  id = findIdByAddress();
        // require(accounts[id].countPosts!=0,"account haven't post")
        Post[] memory memoryArray = new Post[](accounts[id].countPosts);
        if(reverse){
            for(uint256  i =  accounts[id].countPosts;i>0;i--){
                memoryArray[accounts[id].countPosts-i] = accounts[id].posts[i-1];
            }
        }else{
             for(uint256  i =0; i < accounts[id].countPosts; i++){
                memoryArray[i] = accounts[id].posts[i];
            }
        }
        return memoryArray;
    }
    
    
    function getSubscriptions(uint64 _index)_isRegistrated public 
    view returns( string memory,
        string memory,
        string memory,
       // address payable ,
        uint256 ,
        uint256,
        bool
        )
    {
        string memory login;
        string memory avatarHash;
        string memory status;
        {
        uint256  id=findIdByAddress();
        require(_index<accounts[id].countsSubscription,
        "id subscription bigger than count subscription");
        login=accounts[accounts[id].subscription[_index].id].login;
        avatarHash=accounts[accounts[id].subscription[_index].id].avatarHash;
        status=accounts[accounts[id].subscription[_index].id].status;
        }
        // address payable author=accounts[accounts[findIdByAddress()].subscription[_index].id].author;
        uint256 priceSubcribe=accounts[accounts[findIdByAddress()].subscription[_index].id].priceSubcribe;
        uint256 subscribers=accounts[accounts[findIdByAddress()].subscription[_index].id].subscribers;
        bool paid=accounts[findIdByAddress()].subscription[_index].paid;
        return(login,avatarHash,status,priceSubcribe,subscribers,paid);
    }
    
    
    
    
    function getLoginFilterBySubcribe(uint8 _count, uint256 _subscribe)
    public
    view returns(
    string[] memory
    )
    {
        uint8 j=0;
        string[] memory memoryArray= new string[]( getCountAccountBySubcribe( _subscribe));
        for(uint256 i = 0 ;i<accountsCount;i++){
            if(accounts[i].subscribers>=_subscribe){
                memoryArray[j++]=accounts[i].login;
                if( _count<j ){
                    return memoryArray;
                }
            }
            
        }
        return memoryArray;
    }
  
    function getCountAccountBySubcribe( uint256 _subscribe)
    public
    view returns(uint256)
    {
        uint256 sum=0;
        
        for(uint256 i = 0 ;i<accountsCount;i++){
            if(accounts[i].subscribers>=_subscribe){
                sum++;
            }
        }
        return sum;
    }
    
    function findIdByLogin(string memory _login)
    internal
    view returns(uint256)
    {
        for(uint256 i =0 ;i<accountsCount;i++){
            if(accounts[i].login.equal(_login)){
                return i;
            }
        }
        return uint256(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
    }
    
    function checkSubscription()
    internal
    {
        uint256 id = findIdByAddress();
        for(uint64 i = 0;i< accounts[id].countsSubscription;i++){
            if(accounts[id].date>accounts[id].subscription[i].date){
                accounts[id].subscription[i].paid=false;
                accounts[accounts[id].subscription[i].id].subscribers--;
                emit UnSubscribed(accounts[accounts[id].subscription[i].id].login);
            }
        }
    }
    function getCountSubscriptions()
    public _isRegistrated
    view returns(uint64){
        return accounts[findIdByAddress()].countsSubscription;
    }
    
    function getSubscriptionCountPostByIdUser(uint64 _idUser)
    public _isRegistrated 
    view returns(
        uint256
        )
    {
        uint256 count = accounts[accounts[findIdByAddress()].subscription[_idUser].id].countPosts;
        return count;
    }
    
    function getSubscriptionPostByIdUser(uint64 _idUser,uint256 _idPost)
    public _isRegistrated 
    view returns(
        uint8 ,
        string[] memory,
        string memory,
        uint256
        )
    {
        
        uint256 id=findIdByAddress();
     //   require(_idUser<accounts[id].countsSubscription,"don\'t exist post");//to do this require
        require(_idPost<accounts[accounts[id].subscription[_idUser].id].countPosts,"don\'t exist post ");
        
        uint8 imageCount = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].imageCount;
        string[] memory hash = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].hash;
        string memory  description = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].description;
        uint256 date = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].date;
        return(imageCount,hash,description,date);
    }
    function subscribe(string memory _login,uint8 _count)
    public payable _isRegistrated _loginIsUsed(_login)
    {
        uint256 _date=uint256(block.timestamp);
        require(_count>0,"_count must be bigger 0");
        require(msg.value>=accounts[findIdByLogin(_login)].priceSubcribe*uint256(_count),"need more money");
        uint256 subscriberId =findIdByAddress();
        uint256 id=findIdByLogin(_login);
        
        require(id!=subscriberId,"subscribe on myself is not accepted");
        accounts[subscriberId].subscription[accounts[subscriberId].countsSubscription].id=id;
        accounts[subscriberId].subscription[accounts[subscriberId].countsSubscription].paid=true;
        accounts[subscriberId].subscription[accounts[subscriberId].countsSubscription++].date=_date+30*24*60*60*_count;
        accounts[subscriberId].date=_date;
        accounts[id].subscribers++;
        accounts[id].author.transfer(msg.value);
        emit Subscribed(accounts[id].login);
        checkSubscription();
    }
    function getName() public view returns(string memory)  {
        return name;
    }
    
    
    // /** We don't want to accept payments without subscription selection */
    // fallback()   external payable {
    //     require(true,"Plain payments not accepted");
    // }
    
}