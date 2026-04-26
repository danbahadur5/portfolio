import mongoose from "mongoose";
const SkillSchema = new mongoose.Schema({
    technical:{
        type: [String],
        default: [],
    },
    languages:{
        type: [String],
        default: [],
    },
    frameworks:{
        type: [String],
        default: [],
    },
    tools:{
        type: [String],
        default: [],
    }
},{timestamps:true})
export const Skill = mongoose.model("Skill",SkillSchema);
