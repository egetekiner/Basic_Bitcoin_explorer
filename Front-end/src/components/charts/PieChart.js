import React from "react";
import ReactApexChart from "react-apexcharts";

class PieChart extends React.Component {
  render() {
    const { chartData, chartOptions } = this.props;

    // Check if chartData is not empty or null
    if (!chartData || chartData.length === 0) {
      return <div>No data available</div>;
    }

    return (
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type='pie'
        width='100%'
        height='55%'
      />
    );
  }
}

export default PieChart;
