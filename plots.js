function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  function optionChanged(newSample) {
    console.log(newSample);
    buildMetadata(newSample);
    //buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text('ID:' + result.id + '\n' +
                            'Ethnicity:' + result.ethnicity + '\n' +
                            'Gender:' + result.gender + '\n' +
                            'Age:' + result.age + '\n' +
                            'Location:' +  result.location + '\n' +
                            'BBType:' + result.bbtype + '\n' +
                            'WFREQ:' + result.wfreq
                            );
    });
  }



  init();