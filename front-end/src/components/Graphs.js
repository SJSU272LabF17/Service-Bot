import KPieChart2 from './KPieChart2';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import * as API from '../api/API';

class Graphs extends Component {


  state={
    x: [],
    x1: true,
    x5:false
  }


    render(){
        return(
            <div>


              {
                this.state.x1
                ?
                <div>

                <KPieChart2/>

                </div>
                :<div>Please</div>
            }
            </div>
        )
    }

}

export default Graphs
