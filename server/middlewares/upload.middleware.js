import multer from "multer"

// STORE FILE IN MEMORY (NOT IN DISK)
const storage = multer.memoryStorage()

// FILE FILTER : ACCEPT ONLY PDF 
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true)
    } else {
        cb(new Error("Only PDF files are allowed"), false)
    }
}

const upload = multer({
    storage ,
    fileFilter , 
    limits : {
        fileSize : 2 * 1024 * 1024 // 2MB LIMIT 
    }
})


export default upload
