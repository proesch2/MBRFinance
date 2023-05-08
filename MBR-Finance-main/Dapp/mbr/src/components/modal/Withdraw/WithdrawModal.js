import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { mbrContract, getERCBalance, MBRFinanceAddr, valueWithDecimal, web3 } from '../../../config';


import './WithdrawModal.css';

function WithdrawModal(props) {
    const account = props.account;

    const activeTokens = [{addr:"0x6B175474E89094C44Da98b954EedeAC495271d0F", name:"DAI"}, {addr:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", name:"USDC"}];

    const [show, setShow] = useState(false);
    const [mbrAmount, setmbrAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    

    

    useEffect(() => {
        if (account) {
            console.log('Account Loaded for Withdraw');
        }
            //GET AMOUNT OF MBR TOKENS HERE THAT CAN BE WITHDRAWN

          //wbnbContract.methods.balanceOf(account).call().then(balance => setUserBalance(parseFloat(web3.utils.fromWei(balance))));
      });

    const handleClose = () => {
        setShow(false);
        
    };

    const handleWithdraw = () => {
      let BN = web3.utils.BN;
        let amount = new BN(withdrawAmount);
        let decimals = new BN(18);
        let value = amount.mul(new BN(10).pow(decimals));
      console.log(value);

      //reddem for DAI token only for now
      const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; 
      mbrContract.methods.redeem(DAIAddress, value).send({from:account, gas:500000}).then(isRedeemed =>{
        console.log(`Redeemed?${isRedeemed}`);
        handleClose();
      }).catch(error =>{
        console.log("Withdraw error");
        console.log(error);
        handleClose();
      })

      
      handleClose();
    };

    const onSubmit = () => {
      console.log(mbrAmount);
      console.log(withdrawAmount);
      handleWithdraw();
    };

    const handleShow = () => {
      getMbrAmount();
        setShow(true);
    }

    const getMbrAmount = () => {
      getERCBalance(account, MBRFinanceAddr, account).then(tokenBal => {
        console.log(tokenBal);
        
        console.log(`MBR Amount: ${tokenBal}`);
        setmbrAmount(tokenBal);
      
    });
  }

    //given the val of the range (0-100)
    const handleTokenWithdrawAmount = (val) => {
      setWithdrawAmount(Math.round((val/100) * mbrAmount));
    }

    



    return (
        <>
          <Button className="button" onClick={handleShow} disabled={!account} variant="secondary">Withdraw</Button>{''}
    
          <Modal
            show={show}
            onHide={handleClose}
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Withdraw</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    
              
            <Form>
                <Form.Group className="mb-3" controlId="formMbrTotal">
                  <Form.Label>Current Balance of MBR: {mbrAmount}</Form.Label>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formTokenAmount">
                  <Form.Label>Withdraw</Form.Label>
                  <Form.Range defaultValue={0} onChange={e => handleTokenWithdrawAmount(e.target.value)}/>
                  <Form.Label>Amount to Withdraw: {withdrawAmount}</Form.Label>
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
              <Button variant="secondary" onClick={onSubmit}>Withdraw</Button>
            </Modal.Footer>
          </Modal>
        </>
      );

}

export default WithdrawModal;