
pragma solidity 0.5.16;




contract DecentOF_v_2{
     uint256 constant segmentation=10000;
    
     string  name="DecentOF";
     struct Post{
        uint256  date;
        bytes32[] hash;
        // bytes32 hash;
        string description;
        uint8 imageCount;
        bool visibility;
    }
    struct Subscribe{
        address id;
        uint256 date;
        bool paid;
    }
    function getTime()public view returns(uint256){
         uint256 chainStartTime =uint256( block.timestamp);
         return chainStartTime;
    }
    struct Account{
        uint256 countPosts;
        uint256 priceSubcribe;
        uint256 subscribers;
        bytes32 avatarHash;
        mapping(uint256=>Post) posts;
        mapping(uint64=>Subscribe) subscription;
        string login;
        string status;
        address payable author;
        uint64  countsSubscription;
    }
   
    mapping(string=>address)internal logins;
    mapping(uint256=>address)internal addresses;
    mapping(address=>Account) internal  accounts;
    uint256 internal accountsCount;
    event Subscribed(
        string login
       );
    event UnSubscribed(
        string login
       );
    
    function isUniqueLogin(string memory _input) public view returns(bool){
        return (logins[_input]==0x0000000000000000000000000000000000000000);
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
        
        return msg.sender==accounts[msg.sender].author;
    }
     modifier _isRegistrated(){
         require(isRegistrated(),"users haven\'t account ,please register");
        _;
    }
    function getMyCountPost()
    _isRegistrated public
    view returns(uint256)
    {
        return accounts[msg.sender].countPosts;
    }
    function getMyPostById(uint256 _index)
    _isRegistrated public
    view returns(uint8 ,
        bytes32[] memory,
        string memory,
        uint256 
        )
    {
        require(accounts[msg.sender].countPosts>_index);
        Post storage post =accounts[msg.sender].posts[_index];
        return(post.imageCount,post.hash,post.description,post.date);
    }
    
     function setVisiblePostById(uint256 _index)
    _isRegistrated public
    {
      
        require(accounts[msg.sender].countPosts>_index,"dont exist this post");
        accounts[msg.sender].posts[_index].visibility=true;

    }
    
    function setUnvisiblePostById(uint256 _index)
    _isRegistrated public
    {
        
        require(accounts[msg.sender].countPosts>_index,"dont exist this post");
        accounts[msg.sender].posts[_index].visibility=true;

    }
   
   
    //  function findIdByAddress() 
    //  public _isRegistrated
    //  view returns(uint256)
     
    //  {
    //     for(uint256 i=0;i<accountsCount;i++){
    //         if(msg.sender==accounts[i].author){
    //             return i;
    //         }
    //     }
    //     return uint256(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
    // }
    function registration(string memory _login, bytes32 _avatarHash,string memory _status,uint256 _priceSubcribe) 
    _isUniqueLogin(_login)
        public  
        {
        require(bytes(_login).length>0,"_login's length must be bigger than 0");
        require((_avatarHash)!="","_avatarHash's length must be bigger than 0");
        require(bytes(_status).length>0,"_status's length must be bigger than 0");
        require(!isRegistrated(),"this user is register");
        
        logins[_login]=msg.sender;
        addresses[accountsCount++]=msg.sender;
        Account storage c=accounts[msg.sender];
        c.login=_login;
        c.avatarHash=_avatarHash;
        c.countPosts=0;
        c.status=_status;
        c.author=(msg.sender);
        c.priceSubcribe=_priceSubcribe;
      
    }
    function newPost(string memory _description,uint8 _imageCount,bytes32[] memory   _hash)
    public  _isRegistrated 
    {
        
        require(_imageCount==_hash.length,"_imageCount dont\'t equal _hash.length");
        address id=msg.sender;

        Post storage c=accounts[id].posts[accounts[id].countPosts];
        accounts[id].countPosts++;
        c.description =_description;
        c.date=(uint256(block.timestamp));
        c.visibility=true;
        c.imageCount=_imageCount;
       c.hash = new bytes32[](_imageCount);
        // c.hash=_hash;
        for(uint i = 0;i<_imageCount;i++){
            c.hash[i]=_hash[i];
        }
      //  checkSubscription();
    
    }
     function isSubucriberByLogin(string memory _login)
    public view _isRegistrated
    returns(bool)
    {  
        address id = msg.sender;
        
        for(uint64 i = 0;i< accounts[id].countsSubscription;i++){
            if((keccak256(abi.encode(accounts[accounts[id].subscription[i].id].login))==keccak256(abi.encode(_login)))&&(((uint256(block.timestamp))<accounts[id].subscription[i].date)))
                return true;
        }
        return false;
    }
    function getIdByLogin(string memory _login)
    public view _isRegistrated
    returns(uint64)
    {  
        address id = msg.sender;
        
        for(uint64 i = 0;i< accounts[id].countsSubscription;i++){
            if((keccak256(abi.encode(accounts[accounts[id].subscription[i].id].login))==keccak256(abi.encode(_login)))&&(((uint256(block.timestamp))<accounts[id].subscription[i].date)))
                return i;
        }
       return uint64(0xFFFFFFFFFFFFFFFF);
    }
    function getMyData()  _isRegistrated
    public view returns(
        string memory,
       bytes32,
        string memory,
        uint256,
        uint256
        ) 
    {
        Account  storage  buf= accounts[msg.sender];
      
        return (buf.login,buf.avatarHash,buf.status,buf.priceSubcribe,buf.subscribers);
    }
    
    function getDataByLogin(string memory _login)  
    public view returns(
        string memory,
       bytes32,
        string memory,
        uint256,
        uint256
        ) 
    {
        Account  storage  buf= accounts[logins[(_login)]];
      
        return (buf.login,buf.avatarHash,buf.status,buf.priceSubcribe,buf.subscribers);
    }
    function setStatus(string memory input)
    public _isRegistrated
    {
        accounts[msg.sender].status=input;
    }
    function setAvatarHash(bytes32 input)
    public _isRegistrated
    {
        accounts[msg.sender].avatarHash=input;
    }
    function setLogin(string memory input)
    public _isRegistrated _isUniqueLogin(input)
    {
        accounts[msg.sender].login=input;
    }

    function setPriceSubcribe(uint256 input)
    public _isRegistrated 
    {
        accounts[msg.sender].priceSubcribe=input;
    }
    
    
    function getSubscriptions(uint64 _index)_isRegistrated public 
    view returns( string memory,
        bytes32,
        string memory,
       // address payable ,
        uint256 ,
        uint256,
        bool
        )
    {
        address  id=msg.sender;
        require(_index<accounts[id].countsSubscription,
        "id subscription bigger than count subscription");
        Account  storage  buf=accounts[accounts[id].subscription[_index].id];
        bool paid=accounts[msg.sender].subscription[_index].paid;
        return(buf.login,buf.avatarHash,buf.status,buf.priceSubcribe,buf.subscribers,paid);
    }
 
    function getCountSegmentation ()
    public view
    returns( uint256)
    {
        return accountsCount/segmentation;
    }
    function getCountAccountBySubcribe( uint256 _subscribe,uint256 _segment)
    public
    view returns(uint256)
    {
        uint256 sum=0;
        
        for(uint256 i =_segment*segmentation  ;i<(_segment+1)*segmentation ;i++){
            if(accounts[addresses[i]].subscribers>=_subscribe){
                sum++;
            }
        }
        return sum;
    }
    function getLoginFilterBySubcribe(uint256 _id, uint256 _subscribe,uint256 _segment)
    public
    view returns(
    string memory
    )
    {
        require(getCountAccountBySubcribe( _subscribe, _segment)>_id,"dont exist usert");
        uint256 j=0;
       
        for(uint256 i =_segment*segmentation  ;i<(_segment+1)*segmentation ;i++){
            if(accounts[addresses[i]].subscribers>=_subscribe){
               if(j++==_id){
                   return accounts[addresses[i]].login;
               }
            }
            
        }
        
    }
   
    
    function unsubscribe()
    public
    {
        address id= msg.sender;
        for(uint64 i = 0;i< accounts[id].countsSubscription;i++){
            if((uint256(block.timestamp))>accounts[id].subscription[i].date){
                accounts[id].subscription[i].paid=false;
                accounts[accounts[id].subscription[i].id].subscribers--;
                emit UnSubscribed(accounts[accounts[id].subscription[i].id].login);
            }
        }
    }
    function getCountSubscriptions()
    public _isRegistrated
    view returns(uint64){
        return accounts[msg.sender].countsSubscription;
    }
    function checkSubscription()
    public view _isRegistrated
    returns(bool)
    {
        address id =msg.sender;
        for(uint64 i = 0;i< accounts[id].countsSubscription;i++){
            if((uint256(block.timestamp))>accounts[id].subscription[i].date){
                return false;
            }
        }
        return true;
    }
    function getCountUnsubcribtion()
    public view _isRegistrated
    returns(uint64)
    {  
        address id =msg.sender;
        uint64 j=0;
        for(uint64 i = 0;i< accounts[id].countsSubscription;i++){
            if((uint256(block.timestamp))>accounts[id].subscription[i].date){
                
                j++;
            }
        }
        return j;
    }
    function getIdUnsubscriptionByNumber(uint64 _number)
    public view _isRegistrated
    returns(uint64)
    {
        address id =msg.sender;
        uint64 j=0;
        for(uint64 i = 0;i< accounts[id].countsSubscription;i++){
            if((uint256(block.timestamp))>accounts[id].subscription[i].date){
                if(_number==j)  {
                    return i;
                }
                j++;
            }
        }
       revert("bad _number");
    }
    function getSubscriptionCountPostByIdUser(uint64 _idUser)
    public _isRegistrated 
    view returns(
        uint256
        )
    {
        uint256 count = accounts[accounts[msg.sender].subscription[_idUser].id].countPosts;
        return count;
    }
    
    function getSubscriptionPostByIdUser(uint64 _idUser,uint256 _idPost)
    public _isRegistrated 
    view returns(
        uint8 ,
        bytes32[] memory,
        string memory,
        uint256
        )
    {
        
        address id=msg.sender;
        require(_idUser<accounts[id].countsSubscription,"don\'t exist user");
        require(_idPost<accounts[accounts[id].subscription[_idUser].id].countPosts,"don\'t exist post ");
        if(accounts[accounts[id].subscription[_idUser].id].posts[_idPost].visibility){
        uint8 imageCount = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].imageCount;
        bytes32[] memory hash = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].hash;
        string memory  description = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].description;
        uint256 date = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].date;
        return(imageCount,hash,description,date);
        }else{
            bytes32[] memory hash = new bytes32[](1);
            string memory  description ="post delete";
            uint256 date = accounts[accounts[id].subscription[_idUser].id].posts[_idPost].date;
            return(0,hash,description,date);
        }
    }
    function subscribe(string memory _login,uint8 _count)
    public payable _isRegistrated _loginIsUsed(_login)
    {
        
        require(_count>0,"_count must be bigger 0");
       
        require((msg.value) >=(accounts[logins[_login]].priceSubcribe*uint256(_count) ),"need more money");
        address subscriberId =msg.sender;
        address id=logins[_login];
        
        require(id!=subscriberId,"subscribe on myself is not accepted");
        accounts[subscriberId].subscription[accounts[subscriberId].countsSubscription].id=id;
        accounts[subscriberId].subscription[accounts[subscriberId].countsSubscription].paid=true;
        accounts[subscriberId].subscription[accounts[subscriberId].countsSubscription++].date=(uint256(block.timestamp))+30*24*60*60*_count;
     
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