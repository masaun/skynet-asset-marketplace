pragma solidity 0.4.24;

import "./SyObjects.sol";
import "./SyEvents.sol";


// shared storage
contract SyStorage is SyObjects, SyEvents {

    mapping (uint256 => ExampleObject) examples;

}

