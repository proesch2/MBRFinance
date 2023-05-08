import Web3 from 'web3';


import { abi as MBRFinanceABI } from './abi/MBRFinance.json';
import {abi as ERC20ABI } from './abi/ERC20.json';
import {abi as DAOABI} from './abi/MBRDAO.json';
import {abi as TresABI} from './abi/Treasury.json';

if (window.ethereum) {
    console.log('metamask installed');
}

const axios = require('axios');

const metamask = window.ethereum;
const web3 = new Web3(metamask);


const dbURL = "";
const dbKey = "";

const axiosInstance = axios.create({
    baseURL: dbURL, 
    timeout: 1000,
    headers: {
     'Content-Type': 'application/json',
     //'Access-Control-Request-Headers': '*',
     'api-key': dbKey  
    }
  });
/*
axiosInstance.post("actions/find", {
  dataSource:"Cluster0",
  database: "MBREvents",
  collection: "purchaseEvent",
  limit: 10

}).then(res => {
  
  console.log(res);
  //if(res.documents){
  //    let set = dataFunction(res);
  //setData(set);
  ///}
  return res;

}).catch(error => {console.log(error)});
*/

const MBRFinanceAddr = "0xcD0D9fdd117989F9EE364599174Fd64e8303cCd6";
const MBRDAOAddr = "0x8d6861fcfbCb59C05CEB17E415112C2262E6b225";
const sMBRAddress = "0xd8Bd2bCA51710bD5f08cf3E91fB4c712810da351";


const mbrContract = new web3.eth.Contract(MBRFinanceABI, MBRFinanceAddr);
const daoContract = new web3.eth.Contract(DAOABI, MBRDAOAddr);
const smbrContract = new web3.eth.Contract(TresABI, sMBRAddress);







const activeTokenList = [{address:"0x6B175474E89094C44Da98b954EedeAC495271d0F", token:"DAI"}, {address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", token:"USDC"}, {address:"0x0000000000085d4780B73119b644AE5ecd22b376", token:"True"}];

//Call balanceOf for a erc20 token and return. DECIMAL ADJUSTED
async function getERCBalance(account, token, caller){
  const contract = new web3.eth.Contract(ERC20ABI, token);
 

  const result = await contract.methods.balanceOf(account).call(); // 29803630997051883414242659
  const decimal = await contract.methods.decimals().call();
  return removeDecimal(result, decimal);
}

async function getERCTotal(token){
  const contract = new web3.eth.Contract(ERC20ABI, token);

  const result = await contract.methods.totalSupply().call(); // 29803630997051883414242659
  const decimal = await contract.methods.decimals().call();
  return removeDecimal(result, decimal);
}

//sets the approval of erc token transfer to mbrfinacne
async function setERCApproval(tokenAddress, account, numberOfTokens){
  const contract = new web3.eth.Contract(ERC20ABI, tokenAddress);

  const isApproved = await contract.methods.approve(account, numberOfTokens);

  return isApproved;
}

//returns the amount of tokens approved to transfer from erc. 
async function getERCApproval(tokenAddress, account){
  const contract = new web3.eth.Contract(ERC20ABI, tokenAddress);

  const tokenAmount = await contract.methods.allowance(account, MBRFinanceAddr);
  console.log(tokenAmount);
  return tokenAmount;
}

async function getERCDecimal(tokenAddr){
  const contract = new web3.eth.Contract(ERC20ABI, tokenAddr);
  return await contract.methods.decimals().call(); 
}

function valueWithDecimal(value, decimal){
  let BN = web3.utils.BN;
  let amount = new BN(value);
  let decimals = new BN(decimal);
  return amount.mul(new BN(10).pow(decimals));
}

function removeDecimal(value, decimal){
  let BN = web3.utils.BN;
  let amount = new BN(value);
  let decimals = new BN(decimal);
  let a =  amount.div(new BN(10).pow(decimals));
  console.log(decimal);
  console.log(`a: ${a}`);
  return amount / Math.pow(10, decimal);
 
}

async function getTotalMBRMinted() {
  const result = await mbrContract.methods.totalSupply().call();
  //const format = removeDecimal(result, 18);
 // const decimal = await mbrErcContract.methods.decimals().call();
 // const format = result / (10**decimal);
  
 // return parseFloat(format);
 return(result);
}

async function getTotalMBRStaked(test) {
  return -1;
}

//const mbrMinted = getTotalMBRMinted();


function formatAddress(account) {
    return account.substring(0, 5) + '...' + account.substring(account.length - 4);
  }

function urlBuilder(addOn) {
  return dbURL+addOn;
}



  export {
    web3,
    formatAddress,
    mbrContract,
    getERCBalance,
    MBRFinanceAddr,
    activeTokenList,
    ERC20ABI,
    urlBuilder,
    getTotalMBRMinted,
    getTotalMBRStaked,
    getERCDecimal,
    axiosInstance,
    sMBRAddress,
    getERCApproval,
    setERCApproval,
    valueWithDecimal,
    removeDecimal,
    daoContract,
    getERCTotal,
    


  };