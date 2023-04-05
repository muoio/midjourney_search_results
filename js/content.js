// Create sticky note div

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      elmnt.firstChild.onmousedown = dragMouseDown;
  
    function dragMouseDown(e) {
      //e = e || window.event;
      //e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      //e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  
      localStorage['top_position'] = elmnt.style.top;
      localStorage['left_position'] = elmnt.style.left;
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
}
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

  async function download_keyword(keyword){
    let parts = keyword.split(' ');
    let number_download;
    let keyword_replace;
    let url;

    if(isNumeric(parts[parts.length-1])){
        number_download =  parseInt(parts[parts.length-1]);
        parts.pop();
    }
    else number_download = parseInt(localStorage['num_images']);
    
    keyword_replace = parts.join('+');
    url = 'https://www.midjourney.com/api/app/vector-search/?amount=500&dedupe=true&jobStatus=completed&jobType=upscale&orderBy=hot&prompt='+encodeURIComponent(keyword_replace)+'&refreshApi=0&searchType=vector&service=null&user_id_ranked_score=0%2C4%2C5';
    
    console.log(url);

    let x = await fetch(url).then(result=>result.json()).catch(error=>'error'); 
    if (x!='error'){
        for(let i=0;i<Math.min(number_download, x.length);++i)
            console.log(x[i].image_paths[0]);
    }
  }
  





if (!localStorage.hasOwnProperty('top_position')) localStorage['top_position'] = "10%";
if (!localStorage.hasOwnProperty('left_position')) localStorage['left_position'] = "90%";
if (!localStorage.hasOwnProperty('num_images')) localStorage['num_images'] = "100";


let note = document.createElement("div");
note.style.backgroundColor = "white";
note.style.position = "absolute";
note.style.width = "500px";
note.style.height = "300px";
note.style.borderStyle = 'groove';
note.style.top = localStorage['top_position'];
note.style.left = localStorage['left_position'];

let note_header = document.createElement('div');
note_header.id = 'injected_note_header'
note_header.textContent = 'Midjourney Downloader';
note_header.style.setProperty('color', 'green', 'important');
note_header.style.textAlign = 'center';
note_header.style.cursor = 'move';
note_header.style.backgroundColor = 'SkyBlue'
note.appendChild(note_header);

// Add input field to sticky note
let input = document.createElement("textarea");
input.style.setProperty('color', 'black', 'important');
input.style.setProperty('background-color', 'white', 'important');
input.style.setProperty('overflow-wrap', 'normal','important');
input.style.setProperty('overflow-x', 'scroll','important');
input.style.setProperty('scrollbar-width', 'thin','important');
input.style.setProperty('scrollbar-color', '#FFC107','#F5F5F5');
input.style.height = '70%';
input.style.width = '100%';

input.placeholder = "Write your keywords here";
note.appendChild(input);

let num_images = document.createElement('input');
num_images.type = 'number';
num_images.min = '1';
num_images.style.setProperty('color', 'black', 'important');
num_images.style.setProperty('background-color', 'white', 'important');
num_images.style.width = '100px'
num_images.style.marginRight = '20px'
num_images.style.textAlign = 'center'
num_images.value = parseInt(localStorage['num_images']);
num_images.addEventListener('input', function(){
    localStorage['num_images'] = num_images.value;
})

let saveDiv = document.createElement('div');
saveDiv.style.display = 'inline-block'
saveDiv.style.width = '60%';
saveDiv.style.height = '10%'



let saveLabel = document.createElement('label');
saveLabel.textContent = 'số lượng';
saveLabel.style.setProperty('color', 'green', 'important');
saveLabel.style.backgroundColor = 'white'
saveDiv.appendChild(saveLabel);


saveDiv.appendChild(num_images);
// Add save button to sticky note
let saveButton = document.createElement("button");
saveButton.textContent = "Save";
saveButton.style.setProperty('color', 'black', 'important');
saveButton.style.setProperty('background-color', 'SpringGreen', 'important');
saveButton.onclick = async function(){
    if (saveButton.textContent == 'Save'){
        saveButton.textContent = 'Stop';
        saveButton.style.setProperty('background-color', 'LightPink', 'important');
        input.style.height = '65%';
        myProgress.style.display = 'block';
        let keywords = input.value.split('\n');
        for(var i = 0;i < keywords.length;i++){
            await download_keyword(keywords[i]);
        }
    }
    else{
        saveButton.textContent = 'Save';
        saveButton.style.setProperty('background-color', 'SpringGreen', 'important');
        input.style.height = '70%';
        myProgress.style.display = 'none';
    }
}


saveDiv.appendChild(saveButton);

note.appendChild(saveDiv);


let myProgress = document.createElement('div');
myProgress.id = 'myProgress';
myProgress.style.width = '100%';
myProgress.style.height = '10%';
myProgress.style.setProperty('background-color', 'Lavender', 'important');
myProgress.style.borderColor = 'black'
myProgress.style.color = 'Indigo';
myProgress.style.textAlign = 'center';
myProgress.textContent = 'Downloadling google i styke';
myProgress.style.display = 'none';


let myBar = document.createElement('div');
myBar.id = 'myBar';
myBar.style.width = '10%';
myBar.style.height = '100%';
myBar.style.backgroundColor = 'PaleGreen';
myBar.style.display = 'inline-flex';
myBar.style.float = 'left';
myProgress.appendChild(myBar);
note.appendChild(myProgress);

note.addEventListener('click', function(event) {
    event.stopPropagation();
});

// Add sticky note to the page
document.body.appendChild(note);


dragElement(note);
