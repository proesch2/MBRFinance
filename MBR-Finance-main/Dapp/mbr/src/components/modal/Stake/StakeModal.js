import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { mbrContract, getERCBalance,  getERCDecimal,  web3, sMBRAddress, MBRFinanceAddr, daoContract} from '../../../config';
import {UNStakeModal} from './UnStakeModal';





import './StakeModal.css';

function StakeModal(props) {
    const account = props.account;

    const activeTokens = [{addr:"0x6B175474E89094C44Da98b954EedeAC495271d0F", name:"DAI"}, {addr:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", name:"USDC"}];

    const [show, setShow] = useState(false);
    const [mbrAmount, setmbrAmount] = useState(0);
    const [stakeAmount, setStakeAmount] = useState(0);
    const [smbrAmount, setsmbrAmount] = useState(0);
    const [decimal, setDecimal] = useState(18);

    

    

    useEffect(() => {
        if (account) {
            console.log('Account Loaded for Stake');
        }
            //GET AMOUNT OF MBR TOKENS HERE THAT CAN BE StakeN

          //wbnbContract.methods.balanceOf(account).call().then(balance => setUserBalance(parseFloat(web3.utils.fromWei(balance))));
      });

    const handleClose = () => {
        setShow(false);
        
    };

    const handleStake = () => {
      
        let BN = web3.utils.BN;

        let decimalBN = new BN(decimal);
        let amount = new BN((stakeAmount/100 * mbrAmount));

        let value = amount.mul(new BN(10).pow(decimalBN));

        mbrContract.methods.stake(value).send({from:account, gas:500000}).then(res => {
          console.log(res);
          handleClose();
        }).catch(error => {
          console.log(error);
        });



        handleClose();
    };

    const onSubmit = () => {
      console.log(mbrAmount);
      console.log(stakeAmount);
      handleStake();
    };


    const handleShow = () => {

        getERCBalance(account, MBRFinanceAddr, account).then(tokenBal =>{
          setmbrAmount(tokenBal);
        });

        getERCDecimal(MBRFinanceAddr).then(decimal => {
          setDecimal(decimal);
        })

        

        setShow(true);
        //call for data here?
    }

    //given the val of the range (0-100)
    const handleTokenStakeAmount = (val) => {
      setStakeAmount((val/100) * mbrAmount);
      
    }

    return (
        <>
          <Button className="button" onClick={handleShow} disabled={!account} variant="secondary">Stake</Button>{''}
    
          <Modal
            show={show}
            onHide={handleClose}
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Stake</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    
              
            <Form>
                <Form.Group className="mb-3" controlId="formMbrTotal">
                  <Form.Label>Current MBR Balance: {Math.round(mbrAmount)}</Form.Label>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formTokenAmount">
                  <Form.Label>Stake</Form.Label>
                  <Form.Range defaultValue={0} onChange={e => handleTokenStakeAmount(e.target.value)}/>
                  <Form.Label>Amount to Stake: {Math.round(stakeAmount)}</Form.Label>
                </Form.Group>
              </Form>

                {/** 
              <Form>
                <Form.Group className="mb-3" controlId="formSmbrTotal">
                    <Form.Label>Total MBR Staked: {smbrAmount}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Un-stake</Form.Label>
                    <Form.Range onChange={e=> setUnStakeAmount(e.target.value)}/>
                    <Form.Label>Amount to DeStake</Form.Label>
                </Form.Group>
              </Form>
              */}
    
             
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onSubmit}>Stake</Button>
            </Modal.Footer>
          </Modal>
        </>
      );

}

export default StakeModal;