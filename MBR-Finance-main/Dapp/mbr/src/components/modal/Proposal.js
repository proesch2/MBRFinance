import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { mbrContract, getERCBalance } from '../../config';


function getItemString(item) {
   // console.log(item);
    return "Id: " + item.id + " |   Description: " + item.desc + "  | Votes: " + item.votes;
}


function Proposal (props) {

    //const item = props;

    const item = props.data;
    


    return (
        <li class="list-group-item">{getItemString(item)}</li>
    )

}

export default Proposal;