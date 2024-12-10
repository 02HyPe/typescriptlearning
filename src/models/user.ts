import mongoose from "mongoose"

export interface User { 
    userName : string
    email : string
    password : string 
}

export const userSchema = new mongoose.Schema <User>({
    userName : {type : String, required:true, unique: true},
    email : {type : String, required: true, unique: true},
    password : {type : String, required: true}
})

