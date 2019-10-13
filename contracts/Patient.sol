pragma solidity >=0.4.21 <0.6.0;

contract Patient {
  uint public recordsCount =0;
  uint public reportCount = 0 ;
  uint public problemCount = 0 ;
  struct Record {
    uint id ;
    string name ;
    uint age ;
    address createdBy ;
  }

  /* struct Report{
    uint id ;
    string medicine  ;
    uint qty ;
    uint prblemRef ;
    uint userRef ;
    address createdBy ;
  } */
  struct Problem{
    uint id ;
    string content ;
    string suggestion;
    uint userRef ;
    address createdBy ;
  }
  mapping (uint => Record) public records ;
  //mapping (uint => Report) public reports ;
  mapping(uint => Problem) public problem ;
  event RecordCreated(
      uint id ,
      string name ,
      uint age ,
      address  craetedBy
    );
    constructor() public{
      createRecords("khalid" , 24  , msg.sender);
    }
    function createRecords(string memory _name , uint _age  ,address _sender) public {
      recordsCount ++ ;
      records[recordsCount] = Record(recordsCount , _name , _age  , _sender );
      emit RecordCreated(recordsCount, _name, _age , _sender );
    }
    function insertProblem(string memory _problem , string memory _suggestion ,  uint _user  , address _sender) public {
      problemCount ++ ;
      problem[problemCount] = Problem(problemCount , _problem ,_suggestion ,  _user , _sender );
    }


}
