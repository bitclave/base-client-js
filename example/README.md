# Example
This is a simple DAPP demonstrating the usage of the BASE-CLIENT-JS API

## Authorization
Your private keys are never saved. For now, you need to enter "mnemonic" phrase and we'll generate the keys based on that phrase. All data that you want to add to BASE will be encrypted on client side. Plain data should never be sent from client to BASE-NODE.

## Data Request Protocol
Since all data is encrypted, in order to get access to someone's data you need to request access using the API. You also need to know the baseID (tm) of the person you ask data.

Once you receive data access request, you can decide to approve the request or deny. Once you approve the request, the data will be shared ONLY to the entity that originated that request

To support testing of this workflow we have bot with baseID at address 038d4a758b58137ee47993ca434c1b797096536ada167b942f7d251ed1fc50c1c1 that will respond to your data access requests.


# User Guide

## Login Screen
![Alt text](https://github.com/bitclave/base-client-js/blob/develop/images/example_login.png)

This screen is self-explanatory, allows for user to Sign Up, Sign In or Delete 
- mnemonic phrase is any string 5+ characters. In future we'll make it more secure and will autogenerate it.

## Dashboard
![Alt text](https://github.com/bitclave/base-client-js/blob/develop/images/example_dashboard.png)

This is the main dashboard.
- the bottom part has a read-only section of all user data and is presented as <key,value> pairs
- the middle part allows user to add new <key,value> pair or update previous <key> with new data
- the top part allows to add new ETH wallets
  - Sign w/Web3 - will popup a Metamask (or any Web3 wallet) and ask you to sign a special 
  string. Once you sign the string, it will populate the eth_address and signature fields.
  - Set Single - will add a new eth_address to the eth_wallets structure in the low section
  - Verify - will verify the eth_wallets structure in the low section
    - When eth_walelts structure is propery signed the response shall be something like
    {"rc":0,"err":"","details":[0,0]}
  - Sign Wallets - will sign the eth_wallets structure
  


