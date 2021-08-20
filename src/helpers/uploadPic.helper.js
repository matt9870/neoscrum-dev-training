const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        const lengthOfExtension = -path.extname(file.originalname).length;
        const basename = file.originalname.slice(0,lengthOfExtension)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,basename + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const uploadPic = multer({ 
    storage: storage,
    limits: {
        fileSize: 2000000
    },
    fileFilter: (req, file, cb) => {
        const stat = checkFileType(file,cb)
        // console.log('stat',stat);
    },
});

function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime type
    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true);
    }
    else{
        return cb(`Error: Images only`);
    }
}

module.exports = uploadPic;


    