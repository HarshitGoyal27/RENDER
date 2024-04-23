const { 
    successResponse,
    errorResponse,
} = require('../utils/response/response.handler');
const {getSAPZoho}=require('../zohoDb/zohoSAP');
const {
    API_URL_SEARCH,
    API_DELETED_COUNT,
    API_URL_GET,
    API_URL_GET_TABULAR_OLD
  } = require("../utils/constants/constants");
const getSAPData=async(req,res)=>{
    try{
        console.log(req.body);
        let keyword=req.body.profiles.keyword;
        let primary=req.body.profiles.primary_module;
        let secondary=req.body.profiles.secondary_module;
        let query1=`(Current_Role:contains:${keyword})or(Previous_Role:contains:${keyword})or(Skill_Set:contains:${keyword})or(Candidate_Profile:contains:${keyword})or(Additional_Skills:contains:${keyword})`;
        let query2=`(Current_Role:contains:${primary})or(Previous_Role:contains:${primary})or(Skill_Set:contains:${primary})or(Candidate_Profile:contains:${primary})or(Additional_Skills:contains:${primary})`;
        let query3=`(Current_Role:contains:${secondary})or(Previous_Role:contains:${secondary})or(Skill_Set:contains:${secondary})or(Candidate_Profile:contains:${secondary})or(Additional_Skills:contains:${secondary})`;
        const url1=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query1)}`;
        const url2=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query2)}`;
        const url3=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query3)}`;
        let url=[];
        url.push(url1);
        if(req.body.profiles.primary_module)url.push(url2);
        if(req.body.profiles.secondary_module)url.push(url3);
        console.log(url);
        const resp=await getSAPZoho(req,res,url);
        return resp;
    }catch(err){
        console.log(err);
    }

}
module.exports={getSAPData};