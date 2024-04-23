const { 
    successResponse,
    errorResponse,
} = require('../utils/response/response.handler');
const dynamicService=require('../services/sapServices')

const getSAPCandidates=async(req,res)=>{
    try{
        const successResponse=await dynamicService.getSAPData(req,res);
        return successResponse;
    }catch(error){
        return errorResponse({res,error});
    }
}

module.exports={getSAPCandidates};