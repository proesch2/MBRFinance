import {axiosInstance } from "../../config";
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';
import {useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';



function PlotComponent (props) {
    const title = props.title;

    function responseMap(document) {
        console.log(document.purchaseMethod);
    }

    const getDocument  = () =>{
        axiosInstance.post('action/find', {
            dataSource:"Cluster0",
            database: "MBREvents",
            collection: param.collection,
            filter: param.filter,
            limit: param.limit
        }).then(response => {
            response.data.documents.map(document => {
            });

        }).catch(error => {
            console.log(`PlotComponent getData error ${error}`);
        });
    };

    


    //data = props.data;
    const [data, setData] = useState([]);
    const [param, setParam] = useState({collection: props.collection, filter:props.filter, limit:props.limit});
    useEffect(() => {
       // console.log('Plot component use Effect');

      });
    
    
    return(
            <Card className="text-center">
                <Card.Header as="h5">{title}</Card.Header>
                <Card.Body>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <XYPlot height={300} width={300}>
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis />
                            <YAxis />
                            <LineSeries data={data}/>

                            <VerticalGridLines />
                            <HorizontalGridLines />
                        </XYPlot>
                    </div>
                </Card.Body>
            </Card>
    )
}

export default PlotComponent;