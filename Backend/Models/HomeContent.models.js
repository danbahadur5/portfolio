import mongoose from "mongoose";
const HomeContentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        minlength:[3,"Name must be at least 3 characters"],
        maxlength:[100,"Name must be at most 100 characters"],
        trim:true
    },
    location:{
        type:String,
        trim:true,
        default:"."
    },
    position:{
        type:String,
        required:[true,"Position is required"],
        minlength:[3,"Position must be at least 3 characters"],
        maxlength:[100,"Position must be at most 100 characters"],
        trim:true
    },
    summary:{
        type:String,
        required:[true,"Summary is required"],
        minlength:[3,"Summary must be at least 3 characters"],
        maxlength:[1000,"Summary must be at most 1000 characters"],
        trim:true
    },
    profile_pic:{
        type:String,
        default:"https://cdn2.vectorstock.com/i/1000x1000/17/61/male-avatar-profile-picture-vector-10211761.jpg",
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        minlength:[3,"Description must be at least 3 characters"],
        maxlength:[5000,"Description must be at most 5000 characters"],
        trim:true
    }

}, {timestamps: true})
export const HomeContent = mongoose.model("HomeContent",HomeContentSchema);