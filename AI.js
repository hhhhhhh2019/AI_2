function f(x) {
  return 1 / (1 + Math.exp(-x))
}


function count_lay(l0, l1, w) {
  for (let i = 0; i < w.length; i++) {
    l1[i][0] = 0;
    for (let j = 0; j < w[i].length-1; j++) {
      l1[i][0] += l0[j][0] * w[i][j];
    }
    l1[i][0] = f(l1[i][0]+1*w[i][w[i].length-1]);
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
      l0[i][1] += w[j][i] * l1[j][1];
    }
    l0[i][1] *= l0[i][0] * (1 - l0[i][0])
  }
}


function correct_weights(l0, l1, w, k) {
  for (let i = 0; i < w.length; i++) {
    for (let j = 0; j < w[i].length-1; j++) {
      w[i][j] += k * l1[i][1] * l0[j][0];
    }
    w[i][w[i].length-1] += k * l1[i][0] * 1;
  }
}

function learn(lays, weights, ld, iters, koof) {
  iters = iters || 10000;
  koof =  koof || 0.2;


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

  console.log('finished');
}

function run(lays, weights, data) {
  for (let i = 0; i < lays[0][i].length-1; i++) {
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


function get_error(lays) {
  let res = 0;
  for (let i of lays) {
    for (let j of i) {
        res += Math.abs(j[1]);
    }
  }

  return res;
}