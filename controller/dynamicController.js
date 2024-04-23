const { 
    successResponse,
    errorResponse,
} = require('../utils/response/response.handler');
const dynamicService=require('../services/dynamicService')

const getDevelopers=async(req,res)=>{
    try{
        const successResponse=await dynamicService.getDeveloperdata(req,res);
        return successResponse;
    }catch(error){
        return errorResponse({res,error});
    }
}

const getConsultant=async(req,res)=>{
    try{
        console.log('hi')
        const successResponse=await dynamicService.getConsultantdata(req,res);
        return successResponse;
    }catch(error){
        return errorResponse({res,error});
    }
}

module.exports={getDevelopers,getConsultant};