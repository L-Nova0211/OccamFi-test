
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Test {
    function test(uint256 id, address addr, uint256 amount) public pure returns (bytes memory) {
        return abi.encodePacked(id, addr, amount);
    }
}