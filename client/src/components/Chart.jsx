import React from 'react'
import { connect } from 'react-redux'
import AxisX from './AxisX.jsx'
import AxisY from './AxisY.jsx'
import Line from './Line.jsx'

class Chart extends React.Component {
  render () {
    if (this.props.update) {
      return (
        <div>
          <div id="chart">
            <svg height={this.props.chartHeight} width={this.props.chartWidth} >
              <g transform="translate(50,20)">
                <AxisX width={this.props.chartWidth} height={this.props.chartHeight} margin={this.props.margin} sentiments={this.props.update}/>
                <AxisY width={this.props.chartWidth} height={this.props.chartHeight} margin={this.props.margin} sentiments={this.props.update}/>
                <Line width={this.props.chartWidth} height={this.props.chartHeight} margin={this.props.margin} sentiments={this.props.update}/>
              </g>
            </svg>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div id="chart">
            <svg height={this.props.chartHeight} width={this.props.chartWidth} >
              <g transform="translate(50,20)">
                <AxisX width={this.props.chartWidth} height={this.props.chartHeight} margin={this.props.margin} sentiments={this.props.sentiments}/>
                <AxisY width={this.props.chartWidth} height={this.props.chartHeight} margin={this.props.margin} sentiments={this.props.sentiments}/>
                <Line width={this.props.chartWidth} height={this.props.chartHeight} margin={this.props.margin} sentiments={this.props.sentiments}/>
              </g>
            </svg>
          </div>
        </div>
      )
    }
  }
}

export default connect((state, props) => {
  return {
    chartWidth: state.d3.chartWidth,
    chartHeight: state.d3.chartHeight,
    sentiments: [{date: 0, close: 0}, {date: 1, close: 0}, {date: 2, close: 0}, {date: 3, close: 0}, {date: 4, close: 0}, {date: 5, close: 0}, {date: 6, close: 0}, {date: 7, close: 0}, {date: 8, close: 0}, {date: 9, close: 0}, {date: 10, close: 0}, {date: 11, close: 0}, {date: 12, close: 0}, {date: 13, close: 0}, {date: 14, close: 0}, {date: 15, close: 0}, {date: 16, close: 0}, {date: 17, close: 0}, {date: 18, close: 0}, {date: 19, close: 0}, {date: 20, close: 0}, {date: 21, close: 0}, {date: 22, close: 0}, {date: 23, close: 0}, {date: 24, close: 0}, {date: 25, close: 0}],
    update: state.d3.update,
    margin: state.d3.margin
  }
})(Chart)
