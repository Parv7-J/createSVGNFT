// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

error ERC721Metadata__URI_QueryFor_NonExistentToken();

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private s_highSvgURI;
    string private s_lowSvgURI;

    AggregatorV3Interface internal immutable i_priceFeed;

    mapping(uint256 tokenId => int256) s_tokenIdToHighValue;

    event NFTMinted(uint256 indexed tokenId, int256 indexed highValue);

    constructor(
        string memory _name,
        string memory _symbol,
        address _priceFeed,
        string memory _highSvg,
        string memory _lowSvg
    ) ERC721(_name, _symbol) {
        i_priceFeed = AggregatorV3Interface(_priceFeed);
        s_highSvgURI = encodeSvgToBase64URI(_highSvg);
        s_lowSvgURI = encodeSvgToBase64URI(_lowSvg);
    }

    function mintNFT(int256 _highValue) public {
        uint256 tokenId = s_tokenCounter;
        s_tokenIdToHighValue[tokenId] = _highValue;
        _safeMint(msg.sender, tokenId);
        s_tokenCounter++;
        emit NFTMinted(tokenId, _highValue);
    }

    function encodeSvgToBase64URI(
        string memory _svg
    ) public pure returns (string memory) {
        string memory baseURIForSvg = "data:image/svg+xml;base64,";
        string memory encodedSvgBase64 = Base64.encode(
            bytes(string(abi.encodePacked(_svg)))
        );
        string memory svgURI = string(
            abi.encodePacked(baseURIForSvg, encodedSvgBase64)
        );
        return svgURI;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) {
            revert ERC721Metadata__URI_QueryFor_NonExistentToken();
        }
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        string memory imageURI = s_lowSvgURI;
        if (price >= s_tokenIdToHighValue[tokenId]) {
            imageURI = s_highSvgURI;
        }
        string memory jsonURI = string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            name(),
                            '","description":"A dynamic on chain svg NFT","image":"',
                            imageURI,
                            '"}'
                        )
                    )
                )
            )
        );
        return jsonURI;
    }

    function getTokenCounter() external view returns (uint256) {
        return s_tokenCounter;
    }

    function getHighValue(uint256 _tokenId) external view returns (int256) {
        return s_tokenIdToHighValue[_tokenId];
    }

    function getLowSVG() public view returns (string memory) {
        return s_lowSvgURI;
    }

    function getHighSVG() public view returns (string memory) {
        return s_highSvgURI;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }
}
