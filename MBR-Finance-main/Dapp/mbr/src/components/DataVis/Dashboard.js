import {  MBRFinanceAddr, sMBRAddress, mbrContract, ERC20ABI, removeDecimal, web3, getERCTotal, axiosInstance, getTotalMBRMinted } from "../../config";
import { Container, Row, Col } from 'react-bootstrap';
import '../../../node_modules/react-vis/dist/style.css';
import { useEffect, useState } from 'react';

import BarComponent from "./BarComponent";
import AggComponent from "./AggComponent";
import ListComponent from "./ListComponent";

const axios = require('axios');

function endAddress(addr) {
    return "0x..." + addr.slice(-4);
}







function Dashboard(props) {

    const [totalMBR, setMbrTotal] = useState(0);
    const [totalsMBR, setsMBRTotal] = useState(0);
    const [aggregatorData, setAggregatorData] = useState({});
    const [aggregatorRewards, setAggregatorRewards] = useState({});
    const [purchaseData, setPurchaseData] = useState({});


    useEffect(() => {

        const fetchMBR = async () => {
            const data = await getERCTotal(MBRFinanceAddr);
            console.log(`Data: ${data}`);
            setMbrTotal(data);
        }

        const fetchsMBR = async () => {
            const data = await getERCTotal(sMBRAddress);
            setsMBRTotal(data);
        }

        
        
        fetchMBR();
        fetchsMBR();
        //fetchPurchase().catch(console.error);

       //setMbrTotal(getmbrTotal());
       //setsMBRTotal(num);
       // let res = getPurchase();
    });


    

    //takes in response from api, puts out list for list view. 
    const purchaseHistoryHandle = (response) => {

        /*
        let docs = response.documents;
        let vals = []
        for(let i=0; docs.length; i++){
            let curr = docs[i];
            let item = {
                blockNumber: curr.block,
                token: curr.token,
                amount: removeDecimal(curr.amount, 18)
            }
            vals.push(item);
        }
        return vals;
        */
       return [];
    };

   

    //each item is a item in the list returned from purchseHistoryHandle.
    const purchaseToString = (item) => {
        
        console.log(item);
        //return "Test";
        return "Block Number: " + item.blockNumber + "  | token: " + endAddress(item.token) + " | amount: " + item.amount;
    }

    return (
        <Container fluid>
            <Row>
                {/*<Col><BarComponent title="Aggregator Earned Rewards" collection="Aggregator" limit="10" data={aggregatorData}></BarComponent></Col>*/}
                <Col>
                    <AggComponent title="Total MBR in Circulation" data={totalMBR} ></AggComponent>
                </Col>
                <Col>
                    <AggComponent title="Total MBR Staked (sMBR)" data={totalsMBR}></AggComponent>
                </Col>
            </Row>
            
            <Row>
                
                {/*<Col lg={8}>*/}
                <Col>
                    <ListComponent title="Purchase History" collection={"purchaseEvent"} axios={axiosInstance} filter={"{block >= 100}"} function={purchaseHistoryHandle} toString={purchaseToString}></ListComponent>
    </Col>
            </Row>
        </Container>
    )

}
export default Dashboard;
