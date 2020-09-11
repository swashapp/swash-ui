console.log('More option: npm run clean -- --src=./build --dst=../firefox/dashboard');

var src = './build';
var dst = '../firefox/dashboard';

for (var arg of process.argv) {
  if (arg.startsWith('--src=')) {
    src = arg.replace('--src=', '');
  }
  if (arg.startsWith('--dst=')) {
    dst = arg.replace('--dst=', '');
  }
}
console.log('Src=', src, ', Dst=', dst);

var fs = require('fs');
var p = require('path');

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = p.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

if (fs.existsSync(p.join(dst, 'index.html'))) {
  fs.unlinkSync(p.join(dst, 'index.html'));
  console.log(p.join(dst, 'index.html'), ' deleted.');
} else {
  console.log(p.join(dst, 'index.html'), ' not found.');
}
if (fs.existsSync(p.join(dst, 'static'))) {
  deleteFolderRecursive(p.join(dst, 'static'));
  console.log(p.join(dst, 'static'), ' folder deleted.');
} else {
  console.log(p.join(dst, 'static'), ' not found.');
}
