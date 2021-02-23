'use strict'

function activate1(x) {
  return 1 / (1 + Math.exp(-x));
}

function measure1(x, y, e) {
	return e * y * (1 - y) * x;
}

function activate2(x) {
	if (x > 1) return 1 + 0.01 * (x - 1)
	if (x < 0) return 0.01 * x;
	if (0 <= x && x <= 1) return x;
}

function measure2(x, y, e) {
	let a = 0;
	if (x > 1 || x < 0) {a = 0.01}
	else {a = 1}
	return x * y * e * a;
}

let _types = Object.freeze({
  "sigmoid": {
    activate: activate1,
    measure: measure1
  },
  "relu": {
    activate: activate2,
    measure: measure2
  }
})

function count_lay(l0, l1, w, type) {
	for (let i = 0; i < l1.length; i++) {
		l1[i][0] = 0;
		for (let j = 0; j < l0.length; j++) {
			l1[i][0] += l0[j][0] * w[i][j];
		}
		l1[i][0] = _types[type].activate(l1[i][0]);
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

function correct_error(l0, l1, w, k, type) {
	for (let i = 0; i < w.length; i++) {
		for (let j = 0; j < w[i].length; j++) {
			w[i][j] += k * _types[type].measure(l0[j][0], l1[i][0], l1[i][1]);
		}
	}
}

function _run(lays, weights, data, type) {
	for (let i = 0; i < data.length; i++) {
		lays[0][i][0] = data[i];
	}

	for (let i = 0; i < lays.length - 1; i++) {
		count_lay(lays[i], lays[i+1], weights[i], type);
	}

	let res = [];
	for (let i of lays[lays.length-1]) {
		res.push(i[0]);
	}

	return res;
}

function get_error(lays) {
	let e = 0;

	for (let i of lays) {
		for (let n of i) {
			e += Math.abs(n[1]);
		}
	}

	return e;
}

function _learn(lays, weights, ld, type, iters, koof, log, logp) {
	let errors = [];

	for (let k = 0; k < iters; k++) {
		for (let d of ld) {
			_run(lays, weights, d["input"], type);

			find_out_error(lays[lays.length-1], d["output"]);
			for (let i = lays.length-1; i > 1; i--) {
				find_error(lays[i-1], lays[i], weights[i-1]);
			}

			errors.push(get_error(lays));
			let e = 0;
			for (let i of lays[lays.length-1]) {
				e += Math.abs(i[1]);
			}
			if (e < 0.01) continue;

			for (let i = 0; i < lays.length-1; i++) {
				correct_error(lays[i], lays[i+1], weights[i], koof, type);
			}
		}

		if (log && k % logp == 0) console.log("осталось: ", iters - k);
	}

	return errors;
}


class NeuralNetwork {
	constructor(nc, type="sigmoid") {
    this.type = type;

		this.lays = [];
		for (let i of nc) {
			let l = [];
			for (let j = 0; j < i; j++) {
				l.push([0, 0]);
			}
			this.lays.push(l);
		}

		this.weights = [];
		for (let i = 1; i < nc.length; i++) {
			let l = [];
			for (let j = 0; j < nc[i]; j++) {
				let w = [];
				for (let k = 0; k < nc[i-1]; k++) {
					w.push(Math.random()*2-1);
				}
				l.push(w);
			}
			this.weights.push(l);
		}
	}

	run(data) {
		return _run(this.lays, this.weights, data, this.type);
	}

	learn(ld, params) {
		let [i, k, l, lp] = [10000, 0.5, false, 100];
		if (params) {
			if (params.hasOwnProperty("iterarions")) i = params["iterations"];
			if (params.hasOwnProperty("log")) l = params["log"];
			if (params.hasOwnProperty("learn rate")) k = params["learn rate"];
			if (params.hasOwnProperty("log period")) lp = params["log period"];
		}
		return _learn(this.lays, this.weights, ld, this.type, i, k, l, lp);
	}

	evolution(p) {
		for (let i = 0; i < this.weights.length; i++) {
			for (let j = 0; j < this.weights[i].length; j++) {
				for (let k = 0; k < this.weights[i][j].length; k++) {
					this.weights[i][j][k] = p.weights[i][j][k] + (Math.random()-0.5)/3;
				}
			}
		}
  }
  
  save(filename) {
    let text = "";

    for (let i = 0; i < this.weights.length; i++) {
      let l = "";
      for (let j = 0; j < this.weights[i].length; j++) {
        let a = this.weights[i][j];
        if (j < this.weights[i].length-1)
          a += 'en'
        l += a
      }
      if (i < this.weights.length-1)
        l += 'el'
      text += l;
    }

    SaveFile(filename, text);
  }

  load(filename) {
    let file = new Text();
    ReadFile(filename, file);
    while (!file.innerHtml) {};
    file = file.innerHtml.split('el');

    for (let i = 0; i < file.length; i++) {
      let a = file[i].split('en');
      for (let j = 0; j < a.length; j++) {
        let b = a[j].split(',');
        for (let k = 0; k < b.length; k++) {
          b[k] = parseFloat(b[k]);
        }
        a[j] = b;
      }
      file[i] = a;
    }

    this.weights = file;
  }
}