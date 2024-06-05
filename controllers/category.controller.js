const category_model = require("../models/category.model")

exports.createNewCategory = async (req , res) =>{
    //Read the req body


    //Create the category object
    const cat_data = {
        name : req.body.name ,
        description : req.body.description
    }
    try {
        //Insert into mongodb
        const category = await category_model.create(cat_data)
        return res.status(201).send(category)
    }catch(err) {
        console.log("error while creating category" , err)
        return res.status(500).send({
            message : "error while creating category"
        })
    }


    //return the response of created category
}

//Get all the Categories
exports.getAllcatgories = async (req , res) =>{
    try{
        const categories = await category_model.find()
        const cat = [];
        for (let index = 0; index < categories.length; index++) {
            cat.push({
                name : categories[index].name ,
                description : categories[index].description
            })
            
        }
        return res.status(200).send(cat)
    }catch (err) {
        return res.status(500).send({
            message : "Error While fetching category"
        })
    }
}

exports.deleteCategory = async(req , res) =>{
    try {
        const del = await category_model.findOne({name : req.body.name})
        if(!del) {
            return res.status(404).send({
                message : "Data not found"
            })
        }
        await category_model.deleteOne({name : req.body.name})
        return res.status(204).send({
            message : "Category deleted" ,
            
        }); 
    }catch(err) {
        return res.status(500).send({
            message : "Error while deleting the data"
        })
    }
}
