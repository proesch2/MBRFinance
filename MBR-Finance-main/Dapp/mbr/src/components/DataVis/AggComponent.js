import {dbURL, urlBuilder} from "../../config";
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';
import {Container, Row, Col} from 'react-bootstrap';
import '../../../node_modules/react-vis/dist/style.css';
import {useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';


function AggComponent(props) {
    const title = props.title;
    const collection = props.collection;
    const filter = props.filter;
    const limit = props.limit;
    const dataFormat = props.format;
    const data = props.data;

    console.log(`Data: ${typeof data}`);

    return(
        <Card className="text-center">
            <Card.Header as="h5">{title}</Card.Header>
            <Card.Body>
                <Card.Title>{data}</Card.Title>
            </Card.Body>
        </Card>
    );
}
export default AggComponent;