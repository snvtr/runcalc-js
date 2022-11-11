'use strict';

let DISTANCES = new Object();

DISTANCES = {
            800:     ['800 m', '800', '800m'],
            1000:    ['1000 m', '1000', '1000m', '1k'],
            1500:    ['1500 m', '1500', '1500m', '1.5k'],
            1609.34: ['1 mile', '1609', '1609m', '1mile', '1mi'],
            2000:    ['2000 m', '2000', '2000m', '2k'],
            2414.02: ['1.5 mile', '2414', '2414m', '1.5mile', '1.5mi'],
            3000:    ['3000 m', '3000', '3000m', '3k'],
            3218.69: ['2 miles', '3218', '3218m', '2mile', '2mi'],
            4828.03: ['3 miles', '4828', '4828m', '3mile', '3mi'],
            5000:    ['5 km', '5000', '5000m', '5k'],
            8000:    ['8 km', '8000', '8000m', '8k'],
            8046.72: ['5 miles', '8046', '8046m', '5mile', '5mi'],
            10000:   ['10 km', '10000', '10000m', '10k'],
            12000:   ['12 km', '12000', '12000m', '12k'],
            15000:   ['15 km', '15000', '15000m', '15k'],
            20000:   ['20 km', '20000', '20000m', '20k'],
            21097:   ['half-marathon', '21097', '21097m', '21k', 'hm'],
            30000:   ['30 km', '30000', '30000m', '30k'],
            42195:   ['marathon', '42195' ,'42195m', '42k', 'm'],
            };

function cooperDist() {
  let distance = parseInt(document.getElementById('input1').value);
  if ((distance < 600.0) || (distance > 5000.0)) {
    cooperd_out.innerHTML = 'введено некорректное значение дистанции';
    return 1;
  }
  cooperd_out.innerHTML  = 'Ваш МПК (оригинальная формула Купера): ' + ((distance - 504.9)/44.73).toFixed(2);
  cooperd_out.innerHTML += indianDist(distance);
}

function cooperTime() {
  let numTime = strTimeToNum(document.getElementById('input2').value);
  if ((numTime < 8.0) || (numTime > 30.0)) {
       coopert_out.innerHTML = 'введено некорректное время или в некорректном формате. Правильный формат: MM:СС';
       return 1;
  }
  coopert_out.innerHTML  = 'Ваш МПК (оригинальная формула Купера): ' + (483.0/numTime + 3.5).toFixed(2);
  coopert_out.innerHTML += indianTime(numTime);
}

function balkeDist() {
  let distance = parseInt(document.getElementById('input3').value);
  if ((distance < 700.0) || (distance > 6000.0)) {
       balke_out.innerHTML = 'введено некорректное значение дистанции';
       return 1;
  }
  balke_out.innerHTML = 'Ваш МПК: ' + (0.172 * (distance / 15 - 133) + 33.3).toFixed(2);
}

function indianDist(distance) {
  return '<BR>\nВаш МПК (индийская модицифированная формула): ' + (21.01*distance/1000 - 11.04).toFixed(2);
}

function indianTime(numTime) {
    return indianDist(2400*12.0/numTime);
}

function strTimeToNum(strTime) {
  let items = strTime.split(':');
  if (items.length == 2) {
    return parseInt(items[0]) + Number(items[1])/60.0;
  } else if (items.length == 3) {
    return parseInt(items[0])*60 + parseInt(items[1]) + Number(items[2])/60.0;
  } else {
	return 0.0;
  }
}

function getFunction(race_d,race_t,race_VDOT) {
  // a helper function for newton approximation
  let upper = 0.000104*race_d**2 * race_t**-2 + 0.182258*race_d*race_t**-1 - 4.6;
  let lower = 0.2989558*Math.exp(-0.1932605*race_t) + 0.1894393*Math.exp(-0.012778*race_t) + 0.8;
  return (upper/lower - race_VDOT);
}   

function getDerivative(race_d,race_t,race_VDOT) {
  // a helper function for newton approximation
  let upper = ((((0.2989558*Math.exp(-0.1932605*race_t))+(0.1894393*Math.exp(-0.012778*race_t))+0.8)*((-0.000208)*(race_d**2)*(race_t**-3))-((0.182258)*race_d*(race_t**-2)))-(race_VDOT*((0.2989558)*(Math.exp(-0.1932605*race_t))+(0.1894393)*(Math.exp(-0.012778*race_t)))));
  let lower = (0.2989558*Math.exp(-0.1932605*race_t) + 0.1894393*Math.exp(-0.012778*race_t) + 0.8)**2;
  return (upper/lower);
}

function rawDaniels(distance, numTime) {
  // the main function, converts distance+time to VDOT
  let velocity = distance / numTime;
  return ((-4.60 + 0.182258*velocity + 0.000104*Math.pow(velocity,2)) / (0.8 + 0.1894393*Math.exp(-0.012778*numTime) + 0.2989558*Math.exp(-0.1932605*numTime))).toFixed(2);
}

function prettyDaniels() {
  let distance = document.getElementById('select4').value;
  let strTime  = strTimeToNum(document.getElementById('input4').value);
  daniels_out.innerHTML = 'Ваш МПК (VDOT): ' + rawDaniels(distance, strTime);
}

function prettyReverse() {
  let res = '';
  let vdot = document.getElementById('input5').value;
  //for (let i in DISTANCES) {
  //  reverse_out.innerHTML += DISTANCES[i][0] + ': ' + prettyTime(reverseDaniels(i, vdot)) + '<br>\n';     
  //}
  reverse_out.innerHTML = '';
  for (let i of Object.keys(DISTANCES).sort((a,b)=>Number(a)-Number(b))) {
    reverse_out.innerHTML += DISTANCES[i][0] + ' :  ' + prettyTime(reverseDaniels(i, vdot)) + '<br>\n';
  }
}

function prettyTable() {
  let vdot = document.getElementById('input5').value;
  let tbl = document.createElement('table');
  let tblBody = document.createElement('tbody');

  for (let i of Object.keys(DISTANCES).sort((a,b)=>Number(a)-Number(b))) {
    let row = document.createElement('tr');
    let cell1 = document.createElement('td');
    let cellText1 = document.createTextNode(DISTANCES[i][0]);
    let cell2 = document.createElement('td');
    let cellText2 = document.createTextNode(prettyTime(reverseDaniels(i, vdot)));
    cell1.appendChild(cellText1);
    cell2.appendChild(cellText2);
    row.appendChild(cell1);
    row.appendChild(cell2);
    tblBody.appendChild(row);
  }
  tbl.appendChild(tblBody);
  let reverse_out = document.querySelector('div.reverse_out');
  tbl.setAttribute('border', '0');
  tbl.setAttribute('cellpadding', '3');
  reverse_out.appendChild(tbl);
}

function prettyTime(numTime) {
  let hours = Math.floor(numTime/60);
  let mins = Math.floor(numTime -  hours*60);
  let secs = ((numTime - Math.floor(numTime))*60).toFixed(1);
  if (hours < 10) { hours = '0' + hours; }
  if (mins < 10) { mins = '0' + mins; }
  if (secs < 10) { secs = '0' + secs; }
  return hours + ':' + mins + ':' + secs;
}

function reverseDaniels(distance, VDOT) {
  //Reverse function for daniels(), gets time based on VDOT and distance.
  //It approximates the output based on Newton approximation
  let time = 60;
  if (distance <= 50000) { 
    time = 250;
  }
  if (distance <= 42200) {
    time = 220;
  }
  if (distance <= 21100) {
    time = 110;
  }
  if (distance <= 10000) {
    time = 50;
  }
  if (distance <= 5000) {
    time = 25;
  }
  if (distance <= 3000) {
    time = 12;
  }
  let functValue = getFunction (distance, time, VDOT);
  let derivative = getDerivative (distance, time, VDOT);
  let i = 0;
  while (Math.abs(functValue/derivative) > 0.000001) {
    i++;
    if (i > 100) {
      break;
    }
    time = time - functValue/derivative;
    functValue = getFunction(distance, time, VDOT);
    derivative = getDerivative(distance, time, VDOT);
  }
  return time.toFixed(2);
}
