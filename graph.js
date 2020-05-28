  function getData() {
        return inf;
  }
  function getData2(){
      return sus;
  }
  function getData3(){
    return rec;
  }
  function getData4(){
    return dead;
  }
  var trace1 = {
      y:[getData()],
      name: 'Infected',
      type:'line',
      marker: {
        color:'#E51515'
      }
    };
    var trace2 = {
      y:[getData2()],
      name: 'Susceptible',
      type: 'line',
      marker: {
        color:'#41E515'
      }
    };
    var trace3 = {
      y:[getData3()],
      name: 'Recovered',
      type: 'line',
      marker: {
        color:'#0983EA'
      }
    };
    var trace4 = {
      y:[getData4()],
      name: 'Dead',
      type: 'line',
      marker: {
        color:'#534F5A'
      }
    };
    var data = [trace1 , trace2, trace3, trace4];
    var layout = {
      plot_bgcolor:"#F5F2F2",
      paper_bgcolor:"#F5F2F2",
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
        range: [0, 40],
        title: {
          text: 'Time (days)',
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
      }
    };
    Plotly.plot('chart',data,layout);
    var interval = setInterval(function() {
          Plotly.extendTraces('chart', { y: [[getData()],[getData2()],[getData3()],[getData4()]] },[0,1,2,3])
          if(graph == false){
            Plotly.react('chart',[ {
              y:[getData()],
              name: 'Infected',
              type:'line',
              marker: {
                color:'#E51515'
              }
            },{
              y:[getData2()],
              name: 'Susceptible',
              type: 'line',
              marker: {
                color:'#41E515'
              }
            },{
              y:[getData3()],
              name: 'Recovered',
              type: 'line',
              marker: {
                color:'#0983EA'
              }
            }, {
              y:[getData4()],
              name: 'Dead',
              type: 'line',
              marker: {
                color:'#534F5A'
              }
            }],layout);
            graph = true;
          }
    }, 1000);
