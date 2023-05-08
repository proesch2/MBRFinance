import Card from 'react-bootstrap/Card';
import { useState, useEffect } from "react";

function endAddress (addr) {
    return "0x..." + addr.slice(-4);
} 

//function itemToString (item) {
//    return "Address: " + item.address + "   | Block Active: " + item.blocksActive;
//}

function ListComponent(props) {
    const title = props.title;
    const _filter = props.filter;
    const axiosInstance = props.axios;
    const _collection = props.collection;
    const dataFunction = props.function;
    const itemToString = props.toString;


    
    
    const [data, setData] = useState([{blockNumber: "15275061", token: "0x6B175474E89094C44Da98b954EedeAC495271d0F", amount: "25000000000000000000"}, {blockNumber: "15275064", token: "0x0000000000085d4780B73119b644AE5ecd22b376", amount:"31000000000000000000"} ]);
/*
    axiosInstance.post("actions/find", {
        dataSource:"Cluster0",
        database: "MBREvents",
        collection: _collection,
        filter: _filter,
        limit: 10

    }).then(res => {
        
        console.log(res);
        if(res.documents){
            let set = dataFunction(res);
        setData(set);
        }
        

    }).catch(error => {console.log(error)});
*/

    return(
        <Card className="text-center">
            <Card.Header as="h5">{title}</Card.Header>
            <Card.Body>
                <ul class="list-group" list-group-flush>
                    {data.map(item => 
                      <li key={item.address} class="list-group-item">{itemToString(item)}</li>
                      )}
                    
                </ul>
            </Card.Body>
        </Card>
    );
}
export default ListComponent;