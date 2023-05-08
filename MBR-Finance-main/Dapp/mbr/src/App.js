import React from 'react';
import './App.css';
//import { Nav } from 'react-bootstrap';
//import Navbar from "react-bootstrap/esm/Navbar";
import { Container, Button, Nav, Navbar } from 'react-bootstrap';
//import { Button } from 'react-bootstrap';

import logo from './imgs/PPlogo4.png';

import { useState, useEffect } from 'react';
import { useMetaMask, useConnectedMetaMask } from "metamask-react";
import { web3, formatAddress, mbrContract, getERCBalance, MBRFinanceAddr } from './config';


import DepositModal from './components/modal/Deposit/DepositModal';
import WithdrawModal from './components/modal/Withdraw/WithdrawModal';
import StakeModal from './components/modal/Stake/StakeModal';
import Dashboard from './components/DataVis/Dashboard';
import UnStakeModal from './components/modal/Stake/UnStakeModal';
import VoteModal from './components/modal/VoteModal';
//import StakeModal from './components/modal/Stake/StakeModal';


function App() {
  
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  
  const [data, setData] = useState(null);
  const [mbrTotal, setMbrTotal] = useState(0);

  useEffect(() => {
    //if a metamask account has been  included
    console.log(mbrContract.defaultAccount);
    console.log("APP USEEFFECT!!");
    if(account){
      getMbrTotal();
    }
  }, []);

  //gets this accounts total Mbr holdings. 
  const getMbrTotal = () => {
    //mbrContract.methods.
    setMbrTotal(getERCBalance(account, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", account));   
    console.log(`USDC TOTAL FOR ACOUNT: ${mbrTotal}`);
    //setMbrTotal(totalMbr);
    
  };


    
  mbrContract.events.tokenStatusEvent({}, function(err, event){console.log(event)}).on('data', function(eventData){
    console.log('LOOK AT ME!!!!!~');
    console.log(eventData);
 });

  


  return (
    <div className="parent">
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#home">
          <img
              src={logo}
              width="100"
              height="100"
              alt="Pirate party logo"
            />
            
          </Navbar.Brand>
          
         
          <Nav>
          <div class="dropdown">
            <button class="dropbtn">MBR Token</button>
              <div class="dropdown-content">
                <DepositModal account = {account}/>
                <WithdrawModal account = {account}/>
                <StakeModal account = {account}/>
                {/*<UnStakeModal account = {account}/>*/}
              </div>
          </div>
          </Nav>

          <Nav>
            {/** HAVE THIS JUST BE the dao modal that take you to the dao */}
          <div class="dropdown">
            <button class="dropbtn">MBR DAO</button>
              <div class="dropdown-content">
              <VoteModal account = {account}></VoteModal>
              </div>
          </div>
          </Nav>
          {/* MetaMask authentication */}
          <Nav>
            <div className="metamask-auth">
              <Button className="button" onClick={connect} disabled={account} variant="secondary">Connect to MetaMask</Button>{''}
              <div>User: <b>{account ? formatAddress(account) : 'Not Connected'}</b></div>
            </div>
          </Nav>
        </Container>
      </Navbar>
      <div style={{
        height:'5vh'
      }}>
       
      </div>
      
      <Container>
        <Dashboard></Dashboard>
      </Container>
       
    </div>
      
  );
}

export default App;
