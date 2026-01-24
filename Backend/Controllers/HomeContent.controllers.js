import cloudinary from "../Configs/cloudinary.configs.js";
import { HomeContent } from "../Models/HomeContent.models.js";

const uploadImage = async (file, options = {}) => {
  if (!file) throw new Error("No file provided");
  if (file.path) {
    return await cloudinary.uploader.upload(file.path, options);
  }
  if (file.buffer) {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(file.buffer);
    });
  }
  throw new Error("Unsupported file input");
};

export const createHomeContent = async (req, res) => {
    try {
        const {name,location,position,summary,description} = req.body;

        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile picture",
            });
        }

        const save_image = await uploadImage(req.file, {folder: "profile_pics"});

        if(!name || !position || !summary){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            })
        }
        const homeContent = await HomeContent.create({
            name,
            location,
            position,
            summary,
            profile_pic:save_image.secure_url,
            description,
        })      
        await homeContent.save();
        res.status(200).json({
            success: true,
            message: "Home content created successfully",
            homeContent,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        }); 
    }
}

export const getHomeContent = async (req, res) => {
    try {
        const homeContent = await HomeContent.find();
       return res.status(200).json({
            success: true,
            message: "Home content fetched successfully",
            homeContent,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const updateHomeContent = async (req, res) => {
    try {
        const {id} = req.params;
        let {name,location,position,summary,profile_pic,description} = req.body;

        if (req.file) {
            const save_image = await uploadImage(req.file, {folder: "profile_pics"});
            profile_pic = save_image.secure_url;
        }

        if(!name || !position || !summary){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            })
        }
        const homeContent = await HomeContent.findByIdAndUpdate(id,{
            name,
            location,
            position,
            summary,
            profile_pic,
            description,
        },{new:true, runValidators: true});
        await homeContent.save();
       return res.status(200).json({
            success: true,
            message: "Home content updated successfully",
            homeContent,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const deleteHomeContent = async (req, res) => {
    try {
        const {id} = req.params;
        await HomeContent.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Home content deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }   
    }

