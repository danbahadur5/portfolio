import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        minlength:[3,"About name must be at least 3 characters"],
        maxlength:[100,"About name must be at most 100 characters"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    title:{
        type:String,
        required:[true,"Profession title is required"],
        minlength:[3,"Profession title must be at least 3 characters"],
        maxlength:[100,"Profession title must be at most 100 characters"],
        trim:true,
    },
    bio:{
        type:String,
        required:[true,"Biography is required"],
        minlength:[10,"Biography must be at least 10 characters"],
        maxlength:[5000,"Biography must be at most 5000 characters"],
        trim:true,
    },
    location:{
        type:String,
        trim:true,
    },
    profile_pic: {
        type: String,
        default: "https://cdn2.vectorstock.com/i/1000x1000/17/61/male-avatar-profile-picture-vector-10211761.jpg",
    },
}, {timestamps:true})


export const About = mongoose.models.About || mongoose.model("About",AboutSchema);

