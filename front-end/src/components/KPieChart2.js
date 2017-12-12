import React, {Component} from 'react';
import PieChart from 'react-svg-piechart';
import '../App.css';
import * as API from '../api/API';

class KPieChart2 extends Component{
        componentWillMount(){

          API.getQueries()
              .then((res) => {
                this.setState({
                  x:[{label: "Address",value: parseInt(res.arr[0]),color: "#3b5918"},{label: "Fee",value: parseInt(res.arr[1]), color: "#00a21d"},{label: "Courses",value: parseInt(res.arr[2]), color: "#dd4b12"},{label: "Contact",value: parseInt(res.arr[3]), color: "#cb3017"},{label: "Advisor",value: parseInt(res.arr[4]),color: "#3b4918"},{label: "Bursar",value: parseInt(res.arr[5]), color: "#01aced"},{label: "Todo",value: parseInt(res.arr[6]), color: "#db2b39"},{label: "Admissionstatus",value: parseInt(res.arr[7]), color: "#cba027"}],
                  arr:res.arr,
                  x1:true
                })


                  });
        }

        state={
          x1:false
        }
        constructor() {
            super()

            this.state = {
                expandedSector: null,
            }

            this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this)
        }

        handleMouseEnterOnSector(sector) {
            this.setState({expandedSector: sector})
        }

        render() {


            const data = [
                {label: "San Jose",value: 100,color: "#3b5998"},{label: "San Francisco",value: 20, color: "#00aced"},{label: "Boston",value: 10, color: "#dd4b39"},{label: "Chicago",value: 39, color: "#cb2027"},{label: "San Jose",value: 100,color: "#3b5998"},{label: "San Francisco",value: 20, color: "#00aced"},{label: "Boston",value: 10, color: "#dd4b39"},{label: "Chicago",value: 39, color: "#cb2027"},{label: "San Jose",value: 100,color: "#3b5998"},{label: "San Francisco",value: 20, color: "#00aced"}
              ];

          //  const data=this.state.x;

            const {expandedSector} = this.state

            return (
                <div>

                  { this.state.x1
                    ?
                  <div>
                    <PieChart className="Kpiechart"
                        data={ this.state.x }
                        expandedSector={expandedSector}
                        onSectorHover={this.handleMouseEnterOnSector}
                        sectorStrokeWidth={2}
                        expandOnHover
                        shrinkOnTouchEnd
                    />

                  <div class="col-md-6" style={{textAlign:"center"}}>
                        {
                            this.state.x.map((element, i) => (
                                <div key={i}>
                                    <span style={{background: element.color}}></span>
                                    <span style={{fontWeight: this.state.expandedSector === i ? "bold" : null}}>
                                {element.label}
                            </span>
                                </div>
                            ))
                        }
                    </div>
                  </div>
                  :<div>Please wait</div>
                }

                </div>
            )
    }
}
export default KPieChart2;
