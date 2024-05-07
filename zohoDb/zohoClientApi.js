require("dotenv").config();
const {
  successResponse,
  errorResponse,
} = require("../utils/response/response.handler");
const axios = require("axios");
const { getAccessToken } = require("../accessToken");

const addClientsZoho=async(res,data,url)=>{
    try{
        const accessToken = getAccessToken();
        const successResponse=await axios.post(url,{data},{
            headers:{
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            }
        })
        return successResponse({ res, data: "Clients added Succesfully", message: "Success" });
    }catch(err){
        return errorResponse({res,err});
    }
}

const addClientCandidatesZoho=async(res,data,url)=>{//direcxt add client with candidates
    try{
        console.log('c');
        const accessToken = getAccessToken();
        const successRes=await axios.post(url,{data},{
            headers:{
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            }
        })
        console.log(successRes.data.data[0].details);
        return successResponse({ res, data: "Clients Candidates added Succesfully", message: "Success" });
    }catch(err){
        console.log('Not added',err)
        return errorResponse({res,err})
    }
}

module.exports={addClientsZoho,addClientCandidatesZoho};