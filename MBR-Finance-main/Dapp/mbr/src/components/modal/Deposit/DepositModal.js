import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { getERCBalance, web3, ERC20ABI, activeTokenList, MBRFinanceAddr, mbrContract, getERCDecimal, getERCApproval, setERCApproval, valueWithDecimal, removeDecimal} from '../../../config';
import './DepositModal.css';

function DepositModal(props) {
    const account = props.account;

    const [show, setShow] = useState(false);
    const [currentTokenAddress, setcurrentTokenAddress] = useState(0);
    const [decimal, setDecimals] = useState(0);
    const [currentTokenMax, setcurrentTokenMax] = useState(0);
    const [tokenDepositAmount, setTokenDepositAmount] = useState(0); //In token number, not decimal number
    const [currentTokenApproved, setCurrentTokenApproved] = useState(0); //amount of tokens MBR is approved to transfer
    
    


    useEffect(() => {
        if (account) {
            console.log('Account Loaded for Deposit');
        }         
      });

    const handleClose = () => {
        setShow(false);
       // console.log(tokenBalances);
    };

    const depositAmount = () => {
        console.log('Depositing Amount !!!!!!!!!!!!!!!');

        let BN = web3.utils.BN;
        let amount = new BN(tokenDepositAmount);
        let decimals = new BN(decimal);
        let value = amount.mul(new BN(10).pow(decimals));
        console.log(value);
        

        //Call purchase
        mbrContract.methods.purchase(currentTokenAddress, value).send({ from: account, gas: 5000000 }, function(error, hash) {
          if(!error)
            console.log(`MBR Purchase hash: ${hash}`);
          else{
            console.log(`MBR Purchase Error: ${error}`);
          }
        }).then(e => console.log(`This is what I got back: ${e}`))
        .catch(error => {
          console.log(error);
          handleClose();
        });    
        handleClose();
    };

    const handleShow = () => {
        setShow(true);
    };

    const onSubmit = () => {
      console.log(`Depositing ${tokenDepositAmount} of ${currentTokenAddress}`);
      depositAmount();
    };


    //Input: token name selected from the form
    const onTokenSelect = (tokenAddr) => {
      const contract = new web3.eth.Contract(ERC20ABI, tokenAddr);
      let decimal = 0;
      setcurrentTokenAddress(tokenAddr);
      //get current balance of token
      getERCBalance(account, tokenAddr, account).then(tokenBal => {
        setcurrentTokenMax(tokenBal);
        console.log(tokenBal);
      });

      getERCDecimal(tokenAddr).then(ret => {
        setDecimals(ret);
        console.log(`Ret" ${ret}`);
        decimal = ret;
      }).then(() => {
        contract.methods.allowance(account, MBRFinanceAddr).call().then(approvedAmount => {
          let value = removeDecimal(approvedAmount, decimal);
          console.log(`Type of value: ${typeof value}`);
          setCurrentTokenApproved(value);
          console.log(`Current allowance of tokenselected: ${approvedAmount}`);
          });
      });

      //see if current token is approved.
      
      

    };

    //given the val of the range (0-100)
    const handleTokenDepositAmount = (val) => {
      setTokenDepositAmount((val/100) * currentTokenMax);
      
    }

    const handleApproveToken = () => {
      //call approve token from erc20 contract to approve the transfer of the selected token
      const contract = new web3.eth.Contract(ERC20ABI, currentTokenAddress);
      let value = valueWithDecimal(currentTokenMax, decimal);

      contract.methods.approve(MBRFinanceAddr, value).send({from:account, gas:5000000}, function(error, hash){
        if(!error)
          console.log(`Approve Token hash: ${hash}`);
      }).then(isApproved =>{
        console.log(isApproved);
        console.log(typeof isApproved);
        setCurrentTokenApproved(true);
        console.log(`Current token approved? : ${isApproved}`);
      });

    }

    

    return (
        <>
          <Button className="button" onClick={handleShow} disabled={!account} variant="secondary">Deposit</Button>{''}
    
          <Modal
            show={show}
            onHide={handleClose}
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Deposit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    
              <Form>
                <Form.Group className="mb-3" controlId="formTokenSelect">
                  <Form.Label>Token Select</Form.Label>
                  <Form.Select aria-label="Token to Deposit" onChange={e => onTokenSelect(e.target.value)}>
                    <option key="DEFAULT" value="0">Pick a Token</option>
                    {activeTokenList.map(tok => 
                      <option key={tok.token} value={tok.address}>{tok.token}</option>
                      )}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formTokenAmount">
                  
                  <Form.Label>Current allowance to transfer: {currentTokenMax}</Form.Label>
                
                  <Form.Range defaultValue={0} onChange={e => handleTokenDepositAmount(e.target.value)}/>
                  <Form.Label>Amount to Deposit: {Math.round(tokenDepositAmount)}</Form.Label>
                </Form.Group>
              </Form>

              
              
    
              {/* TODO this should be a component of its own and abstracted to work with any erc20 token
              <div class="bnb-parent">
                <div class="bnb-info">
                  <img src={binanceLogo} className="binance-logo"></img>
                  <p>WBNB</p>
                </div>
    
                <div class="bnb-input">
                  <Form.Group as={Row}>
                    <Col xs="9">
                      <RangeSlider
                        value={slider}
                        min={0.1}
                        step={0.0001}
                        max={userBalance}
                        onChange={event => setSlider(event.target.value)}
                      />
                    </Col>
                    <Col xs="3">
                      <Form.Control value={slider} onChange={event => setSlider(event.target.value)} />
                    </Col>
                  </Form.Group>
                </div>
              </div> */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onSubmit} >Deposit</Button>
              <Button variant="secondary" onClick={handleApproveToken}>Approve MBR for Transfer</Button>
            </Modal.Footer>
          </Modal>
        </>
      );

}

export default DepositModal;