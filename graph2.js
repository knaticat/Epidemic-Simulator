function getDataSet() {
    return sold;
}
function getDataSet1(){
    return syoung;
}
function getDataSet2(){
    return rold;
}
function getDataSet21(){
    return ryoung;
}
function getDataSet3(){
    return dold;
}
function getDataSet31(){
    return dyoung;
}
function getDataSet4(){
    return iold;
}
function getDataSet41(){
  return iyoung;
}
  var layout2 = {
    plot_bgcolor:"#F5F2F2",
    paper_bgcolor:"#F5F2F2",
    barmode:'stack',
    bargroupgap: 1,
    autosize:false,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 10
    },
    width: 800,
    height:300,
    xaxis: {
      automargin : false,
      range: [-1,3],
      title: {
        text: 'Age of Person',
        font: {
          family: 'sans-serif,Courier New, monospace',
          size: 16,
          color: '#3B3636'
        }
      },
    },
    yaxis: {
      automargin : false,
      title: {
        text: 'People Count',
        font: {
          family: 'sans-serif,Courier New, monospace',
          size: 16,
          color: '#3B3636'
        }
      }
    },
  };
  setInterval(function() {
        Plotly.react('chart2',[{
            x:['Old','Young'],
            y:[getDataSet(),getDataSet1()],
            width: [0.6,0.6],
            name: 'Susceptible',
            type:'bar',
            marker: {
              color:'#41E515'
            }
          },{
            x:['Old','Young'],
            y:[getDataSet4(),getDataSet41()],
            width: [0.6,0.6],
            name: 'Infected',
            type: 'bar',
            marker: {
              color:'#E51515'
            }
          },{
            x:['Old','Young'],
            y:[getDataSet2(),getDataSet21()],
            width: [0.6,0.6],
            name: 'Recovered',
            type: 'bar',
            marker: {
              color:'#0983EA'
            }
          },{
            x:['Old','Young'],
            y:[getDataSet3(),getDataSet31()],
            width: [0.6,0.6],
            name: 'Dead',
            type: 'bar',
            marker: {
              color:'#534F5A'
            }
          }],layout2);
  }, 1000);
