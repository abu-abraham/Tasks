var request = require('request');
var cheerio = require('cheerio');

function addToQueue(url){
    crawler_queue.push(url);
    visited_sites.add(url);
}

function getAllInternalLinks($) {
  let relative_links = $("a[href^='/']");
  let count = 0;
  relative_links.each(function() {
    if (count >= no_of_links){
      return false;
    }
    let url = base_url+$(this).attr('href');
    if (!visited_sites.has(url)){
        addToQueue(url);
        count+=1;
    }    
  });

}

function getBaseURL(url){
  let split = url.split( '/' )
  return split[0]+'//'+split[2]
}

function invalidURL(url){
  var pattern = new RegExp('^(https?:\\/\\/)?'+ 
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ 
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
  '(\\#[-a-z\\d_]*)?$','i'); 
  return !pattern.test(url);
}

function extract(){
  return new Promise((resolve, reject)=>{
    const url = crawler_queue.shift();
    console.log("Extracting: "+url)
    request(url, function(error, response, body) {
      if(error || response == undefined) {
          console.error("Error: " + error);
          reject();
      }
      if(response.statusCode === 200) {
        let _body = cheerio.load(body);
        getAllInternalLinks(_body);
        resolve();
      }      
    });
  });  
}

function repeat(){
  if (crawler_queue.length <= 0){
    return;
  }
  extract().then(()=>{
    repeat();
  }).catch(()=>{
      return;
  });
}

//Read the initial URL specified
const initial_url = process.argv[2];
if (initial_url === undefined){
  console.error("Specify the initial URL as an argument while running the script, eg: node crawler.js https://www.bing.com 5");
  return;
}  else if (invalidURL(initial_url)){
  console.error("Specify url in correct format");
  return;
}

const base_url = getBaseURL(initial_url);

//Read the number of links to be extracted
const no_of_links = process.argv[3]; 
if (no_of_links === undefined || isNaN(no_of_links) || no_of_links < 0){
    console.error("Specify the number of links to be extracted as an argument while running the script, eg: node crawler.js https://www.bing.com 5");
    return;
}

let crawler_queue = [];
let visited_sites  = new Set();

addToQueue(initial_url);

repeat();


