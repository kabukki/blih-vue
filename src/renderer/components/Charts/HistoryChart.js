import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
	extends: Line,
	mixins: [reactiveProp],
	mounted () {
		this.renderChart(this.chartData, {
			scales: {
				xAxes: [{
					display: true
				}],
				yAxes: [{
					display: true
				}]
			}
		});
	}
};
