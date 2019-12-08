// "The Plan"
// 1.  Inspect data - samples.json, will need to use d3.json().then..
// 2.  Fill in 'sample #' element with data - dropdown input will feed into chart generation
// 2b. Will probably need to start with an initial chart
// 3.  Use sample# to select demographic info

// Revisions:
// Make two functions init() and optionChanged()
// init() includes data filling the dropdown and making initial charts with '940' data
// optionChanged() overwrites text or updates charts


function init(){

  //Access Data
  d3.json("samples.json").then((incomingdata) => {
    var data = incomingdata;

    //// Data Explore
    //dataExplore(data);

    // Do not reload page ... preserve
    // ADD CODE

    // Populate dropdown menu
    var selList = d3.select('#selDataset');
    var listvals = data.names;
    for (var i =0; i<listvals.length; i++){
      var dropDown = selList.append('option');
      dropDown.attr("value", i);
      dropDown.text(listvals[i]);
    };

    // Add sidebar text - 'id = 940' data
    var sidebarData = Object.entries(data.metadata[0]);
    console.log(sidebarData);
    d3.select('#sample-metadata')
      .selectAll('p')
      .data(sidebarData)
      .enter()
      .append('p')
      .text(function(d){ return d.toString().split(',')[0] + ': ' + d.toString().split(',')[1]; });
      //Note to self:  I should be able to do this more concisely

    //******************************************************************************************* */
    // Add horizontal bar chart
    var trace = {
      type: "bar",
      orientation: "h",
      x: data.samples[0].sample_values.slice(0,10).reverse(),
      y: data.samples[0].otu_ids.slice(0,10).reverse().map(x => `OTU ${x.toString()}`),
      text: data.samples[0].otu_labels.slice(0,10).reverse(),
    };
    console.log(data.samples[0].otu_ids.slice(0,10).map(x => `OTU ${x.toString()}`));
    console.log(data.samples[0].sample_values.slice(0,10));
    var chartData = [trace];

    var layout = {
      title: `Sample ID: ${data.metadata[0].id}`,
      xaxis: {
        title: 'Sample Value',
      },
      yaxis: {
        title: 'Sample ID'
      },
    };

    Plotly.newPlot("bar", chartData, layout);

   //******************************************************************************************* */
   // Add bubble plot
   var trace1 = {
    x: data.samples[0].otu_ids,
    y: data.samples[0].sample_values,
    mode: 'markers',
    marker: {
      color: data.samples[0].otu_ids,
      size: data.samples[0].sample_values
    }
   }
  
    var bubbleData = [trace1];
  
    var layout = {
      title: 'Sample Value versus Sample ID',
    };
  
    Plotly.newPlot('bubble', bubbleData, layout);

    //******************************************************************************************* */
    // Add Gauge Plot
    var dataGauge = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: data.metadata[0].wfreq,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: { 
        axis: { visible: true, range: [0, 9]},
        steps: [
          { range: [0, 1], color: 'rgba(210,208,35,1)'}, 
          { range: [1, 2], color: 'rgba(185,200,35,1)'},
          { range: [2, 3], color: 'rgba(160,200,35,1)'},
          { range: [3, 4], color: 'rgba(135,200,35,1)'},
          { range: [4, 5], color: 'rgba(110,200,35,1)'},
          { range: [5, 6], color: 'rgba(85,200,35,1)'},
          { range: [6, 7], color: 'rgba(60,200,35,1)'},
          { range: [7, 8], color: 'rgba(35,200,35,1)'},
          { range: [8, 9], color: 'rgba(10,200,35,1)'}
        ],
      }
    }];
  
  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', dataGauge, layout);



  });  //JSON Data Closure
};   //end function

init();

//***************************************************************************************************/
 
function optionChanged(){
  var inputValue = d3.select("#selDataset").node().value
  console.log(inputValue);

  d3.json("samples.json").then((incomingdata) => {
    var data = incomingdata;

    var sidebarData = Object.entries(data.metadata[inputValue]);
    console.log(sidebarData);

    d3.select('#sample-metadata').html("");

    d3.select('#sample-metadata')
      .selectAll('p')
      .data(sidebarData)
      .enter()
      .append('p')
      .text(function(d){ return d.toString().split(',')[0] + ': ' + d.toString().split(',')[1]; });

    // Restyle/Relayout Horizontal Bar Graph
    Plotly.restyle("bar", "x", [data.samples[inputValue].sample_values.slice(0,10).reverse()]);
    Plotly.restyle("bar", "y", [data.samples[inputValue].otu_ids.slice(0,10).reverse().map(x => `OTU ${x.toString()}`)]);
    Plotly.relayout("bar", {title: `Sample ID: ${data.metadata[inputValue].id}`});

    // Restyle Bubble Chart    
    Plotly.restyle("bubble", "x", [data.samples[inputValue].otu_ids]);
    Plotly.restyle("bubble", "y", [data.samples[inputValue].sample_values]);
    Plotly.restyle("bubble", "marker", {color: data.samples[inputValue].otu_ids, size: data.samples[inputValue].sample_values});
  
    // Restyle Gauge Chart
    Plotly.restyle('gauge', "value", [data.metadata[inputValue].wfreq]);




  })
 };

//***************************************************************************************************/

function dataExplore(data) {
  //Data exploration
  console.log(data);
  console.log(data.names)
  console.log(data.metadata[0]);
  console.log(data.metadata[0].id);
  console.log(data.samples[0].sample_values.slice(0,10));
  console.log(data.samples[0].otu_ids.slice(0,10));
  console.log(data.samples[0].otu_labels.slice(0,10));

  const numbers = data.names;
  const index = numbers.findIndex(index2 => index2 === '941');
  console.log(index);

  console.log(Object.keys(data.names));

  var labels = data.names;
  var indexvalue = labels.map(function(item, index){
    return index
  });
  console.log(indexvalue);
};



//Not needed since update function is in HTML
//d3.selectAll("#selDataset").on("change", updatePlotly);


