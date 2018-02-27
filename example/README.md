# Example
This is a simple DAPP demonstrating the usage of the BASE-CLIENT-JS API

## Authorization
Your private keys are never saved. For now, you need to enter "mnemonic" phrase and we'll generate the keys based on that phrase. All data that you want to add to BASE will be encrypted on client side. Plain data should never be sent from client to BASE-NODE.

## Data Request Protocol
Since all data is encrypted, in order to get access to someone's data you need to request access using the API. You also need to know the baseID (tm) of the person you ask data.

Once you receive data access request, you can decide to approve the request or deny. Once you approve the request, the data will be shared ONLY to the entity that originated that request

To support testing of this workflow we have bot with baseID at address 038d4a758b58137ee47993ca434c1b797096536ada167b942f7d251ed1fc50c1c1 that will respond to your data access requests.



