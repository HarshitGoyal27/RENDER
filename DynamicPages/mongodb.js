const mongoose=require('mongoose');
const uri = "mongodb+srv://romanmania619:t3NGtHxKNBTLn38c@cluster0.l5mueji.mongodb.net/Skills-Capital?retryWrites=true&w=majority";
const axios=require('axios');
const fs=require('fs');
let {parsePage}=require('./parsepages1.js');//convert to json
let data=parsePage();
//console.log('This is data:',data);
mongoose.connect(uri).then(()=>{
  console.log('DB connected');
  addDatatoMongodb(data);
}).catch((err)=>{
  console.log('Not connected',err);
})

const schema=mongoose.Schema({
  Skill:{
    type:String,
    required:true
  },
  Requirements:{
    type:Array,
    required:true
  },
  Roles:{
    type:Array,
    required:true
  },
  Preferred_Skills:{
    type:Array,
    required:true
  },
  Description:{
    type:String,
    required:true
  }
})

const SAP=mongoose.model('SAPModel',schema,'SAP');
const Legacy=mongoose.model('LegacyModel',schema,'Legacy');
const Cloud=mongoose.model('CloudModel',schema,'Cloud');
const Skills=mongoose.model('SkillModel',{skill:{type:String,required:true}},'Skills')
const addDatatoMongodb=async(data)=>{
  try{
    console.log(data);
    //let user=await SAP.create(data);
    console.log(user);
  }catch(err){
    console.log(err);
  }    
}



