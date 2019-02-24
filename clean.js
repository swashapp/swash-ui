console.log('More option: npm run clean -- --src=./build --dst=../firefox/dashboard')


var src = "./build"
var dst = "../firefox/dashboard"

for(var arg of process.argv){
    if(arg.startsWith("--src=")){
        src = arg.replace("--src=","");
    }
    if(arg.startsWith("--dst=")){
        dst = arg.replace("--dst=","");
    }
}
console.log("Src=", src,", Dst=",dst);
