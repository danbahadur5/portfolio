import mongoose from "mongoose";
const ExperienceSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        minlength:[3,"Title must be at least 3 characters"],
        maxlength:[100,"Title must be at most 100 characters"],
        trim:true,
    },
    company:{
        type:String,
        required:[true,"Company is required"],
        minlength:[3,"Company must be at least 3 characters"],
        maxlength:[100,"Company must be at most 100 characters"],
        trim:true,
    },
    location:{
        type:String,
        required:[true,"Location is required"],
        minlength:[3,"Location must be at least 3 characters"],
        maxlength:[50,"Location must be at most 50 characters"],
        trim:true,
    },
    start_date:{
        type:Date,
        required:[true,"Start date is required"],
    },
    end_date:{
        type:Date,
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        minlength:[3,"Description must be at least 3 characters"],
        maxlength:[2000,"Description must be at most 2000 characters"],
        trim:true,
    },
    achievements:{
        type:[String],
        default:[],
    }
},{timestamps:true})

export const Experience = mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);