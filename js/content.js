let searchBlock;
let download_btn;
let del_state = false;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function wait_for_element(selector){
    let max_wait = 10;
    while(!document.querySelector(selector) && max_wait--)
        await sleep(500);
    if (max_wait<=0) return false;
    else return true;
}


function download_button(){
    let new_button = document.createElement('button');
    new_button.textContent = '📩';
    new_button.style.display = 'inline-block';
    new_button.style.backgroundColor = 'transparent';
    new_button.style.cursor = 'pointer';
    let download_loop;
    new_button.onclick = function(){
        if(new_button.textContent == '📩'){
            new_button.textContent = '⌛';
        }
        else{
            new_button.textContent = '📩';
        }
    }
    return new_button;
}

window.onload = async function(){
    await wait_for_element('#searchBlock');
    searchBlock = document.getElementById('searchBlock');
    download_btn = download_button();
    searchBlock.firstChild.appendChild(download_btn);
}