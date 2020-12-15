function f(x) {
	return 1 / (1 + Math.E ** -x)
}


function count_lay(l0, l1, w) {
	for (let i = 0; i < l1.length; i++) {
		l1[i][0] = 0;
		for (let j = 0; j < l0.length; j++) {
			l1[i][0] += f(l0[j][0]) * w[i][j];
		}
	}
}


function find_out_error(l, v) {
	for (let i = 0; i < l.length; i++) {
		l[i][1] = v[i] - l[i][0];
	}
}


function find_error(l0, l1, w) {
	for (let i = 0; i < l0.length; i++) {
		l0[i][1] = 0;
		for (let j = 0; j < l1.length; j++) {
			l0[i][1] += l1[j][1] * w[j][i];
		}
	}
}


function correct_weights(l0, l1, w, k) {
	for (let i = 0; i < w.length; i++) {
		for (let j = 0; j < w[i].length; j++) {
			w[i][j] += k * l1[i][1] * l1[i][0] * (1 - l1[i][0]) * l0[j][0];
		}
	}
}


class NeuralNetwork {
	constructor(nc) {
		this.lays = [];
		for (let i of nc) {
			let l = [];
			for (let j = 0; j < i; j++) {
				l.push([0, 0]);
			}
			this.lays.push(l);
		}

		this.weights = [];

		for (let i = 0; i < nc.length-1; i++) {
			let w = [];

			for (let j = 0; j < nc[i + 1]; j++) {
				let _w = [];

				for (let k = 0; k < nc[i]; k++) {
					_w.push(0);
				}

				w.push(_w);
			}

			this.weights.push(w);
		}
	}

	run(v) {
		for (let val = 0; val < v.length; val++) {
			this.lays[0][val][0] = v[val];
		}

		for (let i = 1; i < this.lays.length; i++) {
			count_lay(this.lays[i-1], this.lays[i], this.weights[i-1]);
		}

		let res = [];
		for (let i of this.lays[this.lays.length - 1]) {
			res.push(f(i[0]));
		}

		return res;
	}
}