// Update the html file with space for dropdowns
function addSelectorContainers(params){
  htmlString = '<div class="row" style="margin:0px; padding-bottom:15px;">';
  params.sort((a, b) => 0.5 - Math.random());
  for (param of params) {
    const randomColor = generateRandColor();
    htmlString+=`
    <div class="selector_container">
      <p class="selector_text" style="color:${randomColor};">${param}</p>
      <select class="form-select" style="color:${randomColor};"
        aria-label="Default select example" id="${param}"></select>
    </div>`
  }
  htmlString+='</div>';


  htmlString+=
  `<div class="row" style="margin:0px">
    <div class="selector_container">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="magCheckbox">
        <label class="form-check-label" for="magCheckbox">
          view only drawings published in college humor magazine
        </label>
      </div>
    </div>
  </div>`
  
  document.getElementById('artSelectors').innerHTML = htmlString;
}

// Get all unique values for dropdwns
function getArtParams(allRows,param) {
  var param_values = new Set();
  for (row of allRows) {
    param_values.add(row[param]);
  };
  var param_values_arr = Array.from(param_values);
  return param_values_arr.sort();
};

// Dynamically generate dropdown for filtering the images by medium, color, etc.
function generateParamSelector(allRows,param) {
  const param_values_arr = getArtParams(allRows,param);
  var htmlString = '<option value="all">all</option>';
  for (param_value of param_values_arr){
    htmlString += `<option value="${param_value}">${param_value}</option>`;
  };
  document.getElementById(param).innerHTML = htmlString;
};

// When art type is selected, update art gallery
function addParamListener(allRows,param){
  const selectElement = document.getElementById(param);
  var selectedValue = '';
  selectElement.addEventListener('change', function handleChange(event) {
    selectedValue = event.target.value;
    if (selectedValue!="all") {
      var filteredRows = allRows.filter(function(row) {
      return row[param] == selectedValue;
      });
      updateGallery(filteredRows);
    } else {
      updateGallery(allRows);
    };
  });
}

// When art type is selected, update art gallery
function addCBListener(allRows){
  const cb = document.querySelector('#magCheckbox');
  cb.addEventListener('change', function handleChange(event) {
    if (cb.checked) {
      var filteredRows = allRows.filter(function(row) {
      return row["magazine"] == "yes";
      });
      updateGallery(filteredRows);
    } else {
      updateGallery(allRows);
    };
  });
}



// Adapted from https://css-tricks.com/snippets/javascript/random-hex-color/
function generateRandColor(){
  var randNum = Math.floor(Math.random()*16777215).toString(16);
  if (randNum.length < 6) {
    randNum+="0";
  }
  return "#"+randNum
}

function generateRandColor2(){
  var red_var = Math.floor(Math.random()*255);
  var green_var = Math.floor(Math.random()*255);
  var blue_var = Math.floor(Math.random()*255);
  //console.log(red_var,green_var,blue_var);
}
//generateRandColor2()

// Update photo gallery with photos
function updateGallery(filteredRows) {
  var htmlString = '<div class="row" style="padding-right:15px">'
  for (row of filteredRows) {
      const randomColor = generateRandColor(); 
      var rowDescription = row.description;
      if (row.magazine=="yes") {
        rowDescription +=`Published in The Harvard Lampoon's ${row.magIssue} # 
                          (${row.magDate}), pg(s): ${row.magPage}`
      }
      htmlString += 
      `<div class="col" style="padding-left:15px; padding-top:15px; padding-right:0px;">
        <p style="color: ${randomColor}; margin:0px;">${row.imageTitle}</p>
        <div class="photo_container">
          <a href=${"images/"+row.fileName} target="_blank" rel="noopener noreferrer"> 
            <img src=${"images/"+row.fileName} alt="${rowDescription}" style="height: 225px;"/>
            <div class="photo_overlay" style="background-color: ${randomColor};">
              <div class="photo_overlay_text">${row.when+"<br>"+rowDescription}</div>
            </div>
          </a>
        </div>  
      </div>`;
  }
  htmlString += '</div>'
  document.getElementById('artPhotos').innerHTML = htmlString;
};


function setupPage(allRows) {
  allRows.sort((a, b) => 0.5 - Math.random()); // From https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj

  randomColor = generateRandColor();
  x = document.getElementById('pageSubtitle');
  x.style.color = randomColor;

  params = ["what","how","color"];
  addSelectorContainers(params);
  for (param of params) {
    generateParamSelector(allRows,param);
    addParamListener(allRows,param);
  }
  addCBListener(allRows);
  updateGallery(allRows); // Set up the gallery the first time
}

// Link to GoogleSheet: https://docs.google.com/spreadsheets/d/1-1J-Do9TP8dymGw4Vr1CHYM18dVo3B3FLOFJDsWT8EA/edit#gid=0
// Adapted from https://stackoverflow.com/questions/62732791/get-data-from-google-sheets-without-sheets-api
const baseUrl = "https://script.google.com/macros/s/AKfycbyTtFypabufX3R9sJMyukFlG0RtrWkzmjcxoqohLwmWAPgK680JumKLYHLUln_MxPwI-A/exec";  // Web Apps URL
const parameters = {
  spreadsheetId: "1-1J-Do9TP8dymGw4Vr1CHYM18dVo3B3FLOFJDsWT8EA",
  sheetName: "Sheet1"
};
const q = new URLSearchParams(parameters);
const url = baseUrl + "?" + q;

// Here I could add what happens if we can't load the GoogleSheets data (then go to file)
function getTableData(q,url) {
  fetch(url)
    .then(res => res.json())
    .then(res => {
      const values = res.values;
      var allRows = [];
      for (value in values) {
       allRows.push(values[value]);
      };
      setupPage(allRows) 
      return res;
    })

  .catch(function(error) {
    console.log(error);
    x = document.getElementById('pageSubtitle');
    x.innerHTML = "Uh-oh, there was an error loading the GSheets data. Sorry about that!";
    });
};

getTableData(q,url);