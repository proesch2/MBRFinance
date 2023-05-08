import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    VerticalBarSeriesCanvas,
    LabelSeries } from 'react-vis';
import Card from 'react-bootstrap/Card';


    

    


function BarComponent (props) {

    const title = props.title;
    const collection = props.collection;
    const filter = props.filter;
    const limit = props.limit;
    const dataFormat = props.format;
    const data = props.data;



    

    

    //const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;
    const BarSeries = VerticalBarSeries;

    return (
        <div>
        <Card className="text-center">
            <Card.Header as="h5">{title}</Card.Header>
            <Card.Body>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                
                <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
                <XAxis />
                <YAxis />
                <BarSeries className="vertical-bar-series-example" data={data} />
                </XYPlot>

                </div>
                
            </Card.Body>
        </Card>
        
        </div>
    );
}

export default BarComponent;