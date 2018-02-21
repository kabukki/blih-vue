import { Pie, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
	extends: Pie,
	mixins: [reactiveProp],
	mounted () {
		this.renderChart(this.chartData);
	}
};
