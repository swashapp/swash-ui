console.log('More option: npm run migrate -- --src=./build --dst=../surf-streamr/dashboard')
//console.log('process.argv', process.argv, process.env);

const fs = require('fs-extra')

//import { parse } from 'node-html-parser';


var src = "./build"
var dst = "../swash/dashboard"

for(var arg of process.argv){
    if(arg.startsWith("--src=")){
        src = arg.replace("--src=","");
    }
    if(arg.startsWith("--dst=")){
        dst = arg.replace("--dst=","");
    }
}
console.log("Src=", src,", Dst=",dst);


function copy_file(src, dst, transform){    
    fs.readFile(src , 'utf8', function(err, contents) {
        if(transform!=null){
            contents = transform(err,contents)
            console.log("transformed " + src + " to " + dst);
        }
        console.log("copying " + contents.length + " bytes from " + src + " to " + dst);
        fs.writeFile(dst, contents, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(dst + ": file copied.");
        });    
    });
}

function copy_file_b(src, dst){
    file1=fs.createReadStream(src,{ flags: 'r',  encoding: "binary",});
    dest=fs.createWriteStream(dst,{ flags: 'w',  encoding: "binary",});
    file1.pipe(dest);
    console.log(dst + ": file copied binary.");
}

function copy_folder(src, dst, callbacks){    
    fs.readdir(src, function(err, items) {
        //console.log(items);
     
        for (var i=0; i<items.length; i++) {
            if(fs.lstatSync(src + items[i]).isDirectory()){
                copy_folder(src+ items[i] + "/", dst+ items[i] + "/", callbacks)
            }else{
                for(var filter of callbacks){
                    if((src+ items[i]).match(filter["filter"])){
                        if(filter.binary){
                            copy_file_b(src+ items[i],dst+ items[i]);
                        }else{
                            copy_file(src+ items[i],dst+ items[i],filter["callback"]);
                        }
                    }else{
                        // console.log("Ignoring: " + src+ items[i] + ": rejected by filter: " + filter["filter"]);
                    }
                }
            }
        }
    });
}

function transform_index(err, contents){
    console.log("transforming index.html");
    if(err){
        console.log("Err", err)
    }
    var arr = contents.match(/<script[^>]*>(.*?)<\/script[^>]*>/g)
    for(var idx in arr){
        var elx = arr[idx];
        elx = elx.replace(/<script[^>]*>/,"")
        elx = elx.replace(/<\/script[^>]*>/,"")
        if(elx.length>0){
            var filename = dst + "/static/js/js_file"+idx+".js"
            contents = contents.replace(arr[idx],"<script src=\"./static/js/js_file"+idx+".js\"></script>");
            fs.writeFile(filename, elx, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log(filename," was saved!");
            });
        }    
    }
    //contents = contents.replace(/\/static\//g,"./static/");
    return contents
}

function transform_css(err, contents){
    //console.log("transforming css");
    if(err){
        console.log("Err", err)
    }
    //return contents.replace(/\/static\//g,"../");
    return contents;
}

if (!fs.existsSync(dst)){
    fs.mkdirSync(dst);
}
if (!fs.existsSync(dst+ "/static")){
    fs.mkdirSync(dst+ "/static");
}
if (!fs.existsSync(dst+ "/static/js")){
    fs.mkdirSync(dst+ "/static/js");
}
if (!fs.existsSync(dst+ "/static/css")){
    fs.mkdirSync(dst+ "/static/css");
}
if (!fs.existsSync(dst+ "/static/media")){
    fs.mkdirSync(dst+ "/static/media");
}



console.log('copying folder static')
copy_folder(src + "/",dst + "/", [
            {filter:".*index\.html$",callback:transform_index}, 
            {filter:".*\.css$",callback:transform_css},
            {filter:".*\.map$",callback:null},
            {filter:".*static\/media.*",callback:null,binary:true},
            {filter:".*static\/js\/.*\.js$",callback:null}]);