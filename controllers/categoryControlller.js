const Category = require("../models/categoryModel");
const {deleteFile} = require("../utils/fileHelper");

const createCategory = async(req,res)=>{
    try{
        const {name,description} = req.body;
        if(!name){
            return res.status(400).json({
                success:false,
                message:"Category name is required"
            })
        }

        //if an image was uploaded , build its path
        let image = null;
        if(req.file){
            image = 'uploads/' + req.file.filename;
        }
        //create category in database
        const category = await Category.create({
            name,
            description,
            image
        });
        res.status(201).json({
            success:true,
            message:"Category created successfully",
            category
        })

    }
    catch(error){
        if(req.file){
            deleteFile(req.file.filename);
        }
        res.status(400).json({
            success:false,
            message:"Category creation failed",
            error:error.message
        })
    }
}


module.exports = {
    createCategory
}