function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
  allSamples = data;

  // 4. Create a variable that filters the samples for the object 
  // with the desired sample number.
  filteredSample = allSamples.samples.filter(i => i.id === sample);

  //  5. Create a variable that holds the first sample in the array.
  firstSample1 = filteredSample.slice(0,1)
    
  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var otu_ids = firstSample1[0].otu_ids;
  var sample_values = firstSample1[0].sample_values;
  var otu_labels = firstSample1[0].otu_labels;

  // 7. Create the yticks for the bar chart.
  // Hint: Get the the top 10 otu_ids and map them in descending order  
  //  so the otu_ids with the most bacteria are last.
  arrx = sample_values.slice(0, 10).reverse();
  arry = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

  // 8. Create the trace for the bar chart. 
  var barData = [{
  x: arrx,
  y: arry,
  text: otu_labels.slice(0, 10).reverse(),
  // name: "Test",
  type: "bar",
  orientation:"h",
  }];
  
  // 9. Create the layout for the bar chart. 
  var barLayout = {
  title: "<b><i>Top 10 Bacteria Cultures Found</i></b>",
  xaxis: {title: "Sample Values"},
  // yaxis: {title: "Samples"},
  margin: {
    l: 100,
    r: 25,
    t: 75,
    b: 100
    }
  };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    // Deliverable 2//

    // 1. Create the trace for the bubble chart.
    bubbleSize =[];
    for (var i = 0; i < sample_values.length; i++) {
      bubbleSize.push(sample_values[i])   
    };
  
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
          size: bubbleSize,
          color: otu_ids,
          showscale: true,
          colorscale: "Viridis"
          // cmax: 15,
          // cmin: 0,
          // color: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b><i>Bacteria Cultures Per Sample</i></b>",
      showlegend: false,
      xaxis: {title: "OTU ID"},
    yaxis: {title: "Sample Value"},
    margin: {
      l: 75,
      r: 75,
      t: 75,
      b: 75
      }  
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot(bubble, bubbleData, bubbleLayout);  


    // Deliverable 3 //

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    // Create a variable that holds the first sample in the array.
    var metadata_SelId = data.metadata.filter(data => data.id == sample);
    console.log(metadata_SelId);  

    // 2. Create a variable that holds the first sample in the metadata array.
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var result = resultArray[0];

    // 3. Create a variable that holds the washing frequency.
   
    // Create the yticks for the bar chart.
    var washFreq = +metadata_SelId[0].wfreq;

    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot();
    
    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot();
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [null, 10],
            tickmode: "array",
            tickvals: [0,2,4,6,8,10],
            ticktext: [0,2,4,6,8,10]
          },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "green" }]
        }
      }
    ];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      autosize: true,
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "The gauge displays your belly button weekly washing frequency",
        showarrow: false
      }]
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  });
}