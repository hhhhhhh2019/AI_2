function activate1(weight) {
  return Math.max(0, weight);
}

function measure1(weight, delta) {
  if (weight <= 0) {
    return 0;
  }

  return delta;
}

function activate2(value) {
  return 1 / (1 + Math.exp(value));
}

function measure2(weight, error) {
  return weight * (1 - weight) * error;
}

var relu = Object.freeze({
  activate: activate1,
  measure: measure1
});

var sigmoid = Object.freeze({
  activate: activate2,
  measure: measure2
});

var t = sigmoid;

function count_lay(l0, l1, w) {
  for (let i = 0; i < w.length; i++) {
    l1[i][0] = 0;
    for (let j = 0; j < w[i].length-1; j++) {
      l1[i][0] += l0[j][0] * w[i][j];
    }
    l1[i][0] = t.activate(l1[i][0]);
  }
}


function find_out_error(l, v) {
  for (let i = 0; i < l.length; i++) {
    l[i][1] = (v[i] - l[i][0]) * l[i][0] * (1 - l[i][0]);
  }
}


function find_error(l0, l1, w) {
  for (let i = 0; i < l0.length; i++) {
    l0[i][1] = 0;
    for (let j = 0; j < l1.length; j++) {
      l0[i][1] += w[j][i] * l1[j][1];
    }
  }
}


function correct_weights(l0, l1, w, k) {
  for (let i = 0; i < w.length; i++) {
    for (let j = 0; j < w[i].length-1; j++) {
      w[i][j] += k * t.measure(w[i][j], l1[i][1]);
    }
  }
} 

function learn(lays, weights, ld, iters, koof) {
  iters = iters || 100000;
  koof =  koof || 0.1;


  for (let k = 0; k < iters; k++) {
    for (let d = 0; d < ld.length; d++) {
      for (let i = 0; i < ld[d][0].length; i++) {
        lays[0][i][0] = ld[d][0][i];
      }
      
      for (let i = 1; i < lays.length; i++) {
        count_lay(lays[i-1], lays[i], weights[i-1]);
      }

      find_out_error(lays[lays.length-1], ld[d][1]);
      for (let i = 1; i < lays.length; i++) {
        let id = lays.length - i;
        find_error(lays[id-1], lays[id], weights[id-1]);
      }

      for (let i = 1; i < lays.length; i++) {
        correct_weights(lays[i - 1], lays[i], weights[i - 1], koof);
      }
    }
  }

  alert('finished');
}

function run(lays, weights, data) {
  for (let i = 0; i < lays[0].length; i++) {
    lays[0][i][0] = data[i];
  }
  
  for (let i = 1; i < lays.length; i++) {
    count_lay(lays[i-1], lays[i], weights[i-1]);
  }
  
  res = [];
  for (let i of lays[lays.length-1]) {
    res.push(i[0]);
  }

  return res;
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
      [
        [[]]
      ]
    this.weights = [];
    for (let i = 1; i < nc.length; i++) {
      let _w = [];
      for (let j = 0; j < nc[i]; j++) {
        let a = [];
        for (let k = 0; k < nc[i-1]; k++) {
            a.push(Math.random());
        }
        _w.push(a);
      }
      this.weights.push(_w);
    }
  }

  run(data) {
    return run(this.lays, this.weights, data);
  }

  learn(ld, k=null, i=null) {
    learn(this.lays, this.weights, ld, i, k);
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
