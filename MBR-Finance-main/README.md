# MBR-Finance

## Introduction

MBR Finance is an Ethereum protocol designed to optimize stablecoin liquidity on UniswapV3. Users deposit stablecoins to receive MBR tokens. The stablecoins are deposited to UniswapV3 with designation from our Decentralized Exchange Aggregator Protocol (DEAP). Users can stake their MBR tokens for sMBR tokens which allow them to receive reward distribution and vote in the community Decentralized Autonomous Organization (DAO). The DAO has the privilege to change the contract’s state and allows users to own the protocol they are interacting with. 

## Features

1. Deposit of approved stablecoin to receive MBR token
2. Staking of MBR token to receive sMBR voting token
3. Creation of proposals to modify MBR ecosystem modification
4. Voting and execution of proposals to change MBR ecosystem state
5. Unstaking of sMBR to receive MBR token again
6. Withdrawal MBR token to redeem for stablecoin

## Getting Started

### Installation and Setup

***Note: MBR Finance requires a uniswap instance on network to properly function***

1. Clone repository locally and navigate into the `/Dapp/` folder, then run:

   ```bash
   npm install
   ```

2. Navigate to the `/MBR-Fiannce/` folder, then run:

   ```bash
   npm install -g truffle

   npm install -g ganache
   ```

3. Navigate to https://infura.io and create an account. Once done navigate to the Dashboard and create a new project.

4. Find the project id and endpoint.

   ![Infura Keys](/readmeimages/Infura_Project_Info.png)

5. Navigate to `/truffle-config.js` and uncomment lines 44-48

   ![Truffle Config](/readmeimages/Truffle-Config.png)

### Run

1.  Launch a local ganache instance using the following command:
    ```ganache -f https://mainnet.infura.io/v3/<API Key>```

2.  Open a terminal and navigate to `/MBR-Finance/` then run: ( This may take a while )
    ```bash
    truffle migrate
    ```

2.  The command above will deploy the contract to the local mainnet fork. Once the deployment is complete you will see the following output. You will want to copy the respective contract addresses.

    ![Truffle Migrate Output](/readmeimages/Truffle-Migrate-Output.png)

3.  Navigate to and open `/Dapp/src/config.js`

4.  Replace the variable value of `MBRFinanceAddr`, `MBRDAOAddr`, and `sMBRAddress` with the respective contract IDs.

        `const MBRFinanceAddr = "<YOUR CONTRACT ADDRESS>";`

5.  Navigate to `/Dapp/` and run

    ```bash
    npm start
    ```

6.  The application UI will now be open in your browser and connected to the smart contract.

## Demo Video

[YouTube Demo Link](https://www.youtube.com/watch?v=I1i7p8_ErY4)

## Contributors

- Phil Roesch - Solidity Wizard
- Ben Meagher -  Fullstack Engineer
- James Barett - UI Designer and devloper
