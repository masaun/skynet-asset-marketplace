pragma solidity 0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title PublishNFT
 * PublishNFT - ERC721 contract that whitelists a trading address, and has minting functionality.
 */
contract PublishNFT is ERC721Token, Ownable {

    uint256 private _currentTokenId = 0;

    constructor(string memory _name, string memory _symbol) ERC721Token(_name, _symbol) public {}

    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     */
    function mintTo(address _to) public onlyOwner {
        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
        _incrementTokenId();
    }

    /**
     * @dev calculates the next token ID based on value of _currentTokenId 
     * @return uint256 for the next token ID
     */
    function _getNextTokenId() private view returns (uint256) {
        return _currentTokenId.add(1);
    }

    /**
     * @dev increments the value of _currentTokenId 
     */
    function _incrementTokenId() private  {
        _currentTokenId++;
    }

    function baseTokenURI() public view returns (string) {
        return "";
    }

}
