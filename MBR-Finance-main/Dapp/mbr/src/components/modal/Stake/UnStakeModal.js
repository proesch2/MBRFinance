import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { mbrContract, getERCBalance } from '../../../config';


import './StakeModal.css';

function UnStakeModal(props) {
    const account = props.account;

    const activeTokens = [{addr:"0x6B175474E89094C44Da98b954EedeAC495271d0F", name:"DAI"}, {addr:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", name:"USDC"}];

    const [show, setShow] = useState(false);
    const [mbrAmount, setmbrAmount] = useState(57);
    const [UnStakeAmount, setUnStakeAmount] = useState(0);
    const [smbrAmount, setsmbrAmount] = useState(100);


    

    

    useEffect(() => {
        if (account) {
            console.log('Account Loaded for UnStake');
        }
            //GET AMOUNT OF MBR TOKENS HERE THAT CAN BE UnStakeN

          //wbnbContract.methods.balanceOf(account).call().then(balance => setUserBalance(parseFloat(web3.utils.fromWei(balance))));
      });

    const handleClose = () => {
        setShow(false);
        
    };

    const handleUnStake = () => {
      
      handleClose();
    };

    const onSubmit = () => {
      console.log(mbrAmount);
      console.log(UnStakeAmount);
      handleUnStake();
    };

    const handleShow = () => {
        setShow(true);
        //call for data here?
    }
    return (
        <>
          <Button className="button" onClick={handleShow} disabled={!account} variant="secondary">UnStake</Button>{''}
    
          <Modal
            show={show}
            onHide={handleClose}
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>UnStake</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    
              
            <Form>
                <Form.Group className="mb-3" controlId="formMbrTotal">
                  <Form.Label>Current SMBR Balance: {mbrAmount}</Form.Label>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formTokenAmount">
                  <Form.Label>UnStake</Form.Label>
                  <Form.Range onChange={e => setUnStakeAmount(e.target.value)}/>
                  <Form.Label>Amount to UnStake: {Math.round((UnStakeAmount/100) * mbrAmount)}</Form.Label>
                </Form.Group>
              </Form>

                {/** 
              <Form>
                <Form.Group className="mb-3" controlId="formSmbrTotal">
                    <Form.Label>Total MBR UnStaked: {smbrAmount}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Un-UnStake</Form.Label>
                    <Form.Range onChange={e=> setUnUnStakeAmount(e.target.value)}/>
                    <Form.Label>Amount to DeUnStake</Form.Label>
                </Form.Group>
              </Form>
              */}
    
             
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onSubmit}>UnStake</Button>
            </Modal.Footer>
          </Modal>
        </>
      );

}

export default UnStakeModal;