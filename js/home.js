// Projects are grouped by name for easy appending
const collections = [{"name": "croc-dreams-", "num":6},
                    {"name": "wacky-animals-tile-", "num":4},
                    {"name":"egyptian-god-comic-", "num":1}];

// Display selected artworks on home page
function displayArt(collections) {
  collections.sort((a, b) => 0.5 - Math.random());
  var htmlString = '<div class="row">'

  // Each group of photos is displayed in a column
  for (collection of collections) {
    htmlString += `<div class="col" id="${collection["name"]}">`;
    for (let i = 1; i < collection["num"]+1; i++) {
      htmlString += 
      `<a href="images/collections/${collection["name"]+i.toString()+".jpg"}" target="_blank" rel="noopener noreferrer"> 
        <img src="images/collections/${collection["name"]+i.toString()+".jpg"}" alt="${collection["name"]+i.toString()}" style="width: 100%;"/>
      </a>`;
    };

    htmlString+="</div>";
  };
  htmlString+="</div>";
  document.getElementById("projects").innerHTML = htmlString;
};

function remixArt(colName,numImages) {
  var x = document.getElementById(colName);
  var htmlString = '';
  var newOrder = [];
  for (var i = 1; i <= numImages; i++) {
    newOrder.push(i);
  }
  newOrder.sort((a, b) => 0.5 - Math.random());
  for (var i = 0; i < newOrder.length; i++) {

    var rotateClass = '';
    if (i%2==1) { // if num is odd, simple way to randomize
      rotateClass = 'rotate180';
    }

    var imageNum = newOrder[i];
    htmlString += 
    `<a href="images/collections/${colName+imageNum.toString()+".jpg"}" target="_blank" rel="noopener noreferrer"> 
      <img src="images/collections/${colName+imageNum.toString()+".jpg"}" alt="${colName+imageNum.toString()}" 
      style="width: 100%;" class="${rotateClass}"/>
    </a>`;
    };
  x.innerHTML = htmlString;
};

// Adapted from https://css-tricks.com/snippets/javascript/random-hex-color/
function generateRandColor(){
  return "#"+Math.floor(Math.random()*16777215).toString(16);
}

randomColor = generateRandColor();
x = document.getElementById('pageSubtitle');
x.style.color = randomColor;

var randomColor = generateRandColor();
const remixButton = document.getElementById("remixButton");
remixButton.style.color = randomColor;

displayArt(collections);
