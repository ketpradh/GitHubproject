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
  console.clear();
  console.log('Selected value is:' + newSample);
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
    var samples_array = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedSample = samples_array.filter(s=>s.id === sample);
    console.log(selectedSample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = selectedSample[0];
    console.log(firstSample);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.map(function(id){
      return id;
    }).sort((a,b) => a.sample_values - b.sample_values).slice(0,10)//not sure if reverse is needed as arraya are already sorted ind escending order, we only need slice()
    console.log(yticks);
    yticks = yticks.reverse();
    yticks1 = yticks.map(function(y){
      return `OTU ${y}`;
    });
    console.log(yticks1);
    var xticks = sample_values.slice(0,10).reverse();
    var ylabels = otu_labels.slice(0,10).reverse();
    console.log(xticks);
    console.log(ylabels);
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks1,
      orientation: 'h',
      type: "bar",
      text:ylabels
    }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:'Top 10 Bacteria Cultures found'
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout);
     // Use Plotly to plot the data with the layout. 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      mode:"markers",
      marker:{
        size:sample_values,
        color:otu_ids,
        //showscale=True
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bacteria Cultures Per Sample",
        //margins:,
        //hovermode=true,
      xaxis: {
        title:{
          text:'OTU ID'
        }
      }
    
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    //Create the Gauge Chart
  // Create a variable that holds the samples array. 
    var samples_array2 = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var selectedSample2 = samples_array2.filter(s=> s.id === sample);
    console.log('Sample:'+sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata2 = data.metadata;
    var selectedSample3 = metadata2.filter(s=>s.id == sample);
    console.log("Selected sample:"+ selectedSample3[0]) ;
    // Create a variable that holds the first sample in the array.
    var firstSample2 = selectedSample2[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    var firstSample3 = selectedSample3[0];
    console.log("First Sample"+ firstSample3);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids2 = firstSample2.otu_ids;
    var otu_labels2 = firstSample2.otu_labels;
    var sample_values2 = firstSample2.sample_values;
  

    // 3. Create a variable that holds the washing frequency.
    var washing_freq = firstSample3.washing_freq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0, 10], y: [0, 10] },
      value: washing_freq,
      title: { text: "Scrubs per Week" },//Belly Button Washing Frequency
      type: "indicator",
      mode: "gauge+number"
    }
      
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
