import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { mbrContract, getERCBalance, sMBRAddress, daoContract, valueWithDecimal } from '../../config';
import Proposal from './Proposal';
import './Vote.css';


function getProposalList() {

  let props = [];

  daoContract.methods.getProposals().call().then(res => {
      //console.log(res[0][5]);

    for(let i=0; i < res.length; i++){
      let prop = {
        id: res[i][0],
        proposer: res[i][1],
        target: res[i][2],
        data: res[i][3],
        votes: res[i][4],
        desc: res[i][5]
      }
      props.push(prop);
      }


  });
  return props;
  console.log(props);
}



function VoteModal (props) {
    const account = props.account;

    const [show, setShow] = useState(false);
    const [smbrAmount, setSmbrAmount] = useState(0);
    const [proposalList, setProposals] = useState(getProposalList());
    //const [proposalList, setProposals] = useState([]);


    useEffect(() => {
      
    });

    
    
    const handleClose = () => {
        setShow(false);
        
    };

    const handleShow = () => {
        setShow(true);
        //call for data here?
        console.log('Set show');

        getERCBalance(account, sMBRAddress, account).then(tokenBal => {
          setSmbrAmount(tokenBal);
        });
        
        
    }

    const handleVote = (id) => {
        console.log("VOTE BUTTON");
        console.log(id);

        let votes = valueWithDecimal(smbrAmount / 2, 18);

        daoContract.methods.vote(id, votes).send({from: account, gas: 500000}).then(result => {
          setProposals(getProposalList());
          handleClose();
        })

    };

    const proposals = [{id: 1, description: "Make USDD a deposit token.", vote: 1}, {id: 2, description: "Make 0x9fD54fe0D88cBb946Be8a736Cc28F600Bc05BC12 an Active Aggregator", vote: 0}];

    


    return (
        <div>
            <Button className="button" onClick={handleShow} disabled={!account} variant="secondary">DAO Proposals</Button>{''}
    
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
        dialogClassName="vote-Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Proposals</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        
      <Form>
          <Form.Group className="mb-3" controlId="formMbrTotal">
            <Form.Label>Current SMBR Balance: {smbrAmount}</Form.Label>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTokenAmount">
            <ul class="list-group" >
                    {proposalList.map(item => 
                        <div>
                        <Proposal key= {item.id} data = {item} ></Proposal>
                        
                        <Button onClick={() => handleVote(item.id) } disabled={smbrAmount == 0}>Vote</Button>
                        </div>
                      )}
            </ul>
            
          </Form.Group>
        </Form>


       
      </Modal.Body>
      <Modal.Footer>
        
      </Modal.Footer>
    </Modal>
        </div>
    )
}

export default VoteModal;