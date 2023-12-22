import path from "path";
import { fileURLToPath } from "url";
import multer, { diskStorage } from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//set Storage Engine
const storage = diskStorage({
    destination: path.join(__dirname,'../public/storage/') ,
    filename: function(req, file, cb){
        cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 30 * 1024 * 1024
    },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('uploadFile');

function checkFileType(file, cb){
    console.log(file);
    const filetypes = /png|jpeg|jpg/;
    var extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    var mimetype = filetypes.test(file.mimetype);
    if(extname == mimetype){
        return cb(null, true);
    }else{
        return cb('Error: Invalid file types!');
    }
}

function uploadFile(req, res){
    upload(req, res, (err) =>{
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.send('Successful');
            console.log('file uploaded succcessfully');
        }
    });
}

export default {
    uploadFile
}