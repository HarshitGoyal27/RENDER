const { 
    successResponse,
    errorResponse,
} = require('../utils/response/response.handler');
const {API_CLIENT}=require('../utils/constants/constants.js');
const {addClientsZoho,addClientCandidatesZoho}=require('../zohoDb/zohoClientApi');
const addClientsData=async(req,res)=>{
    try{
        const data=req.body;
        const successResponse=await addClientsZoho(res,data,API_CLIENT);
        return successResponse;
    }catch(err){
        return errorResponse({res,err});
    }
}

const addClientCandidatesData=async(req,res)=>{
    try{
        const obj={};
        const client=req.body.ClientData;
        const clientCandidates=req.body.selectedId;
        obj.Client_Name=client.Name;
        obj.Email=client.Email;
        obj.Company=client.Company_name;
        obj.Contact_Number=client.contact_number;
        obj.Work_Email=client.workEmail;
        obj.Call_Schedule=client.meetingDate;
        obj.Work_Type=client.workType;
        obj.Experience=client.yearOfExp+'';
        obj.Current_Timezone=client.Current_Timezone
        if(client.Skills.length>0)obj.Skills=client.Skills.join(",");
        obj.Candidates=clientCandidates.join(',');
        const successResponse=await addClientCandidatesZoho(res,[obj],API_CLIENT);
        return successResponse;
    }catch(err){
        console.log(err);
        return errorResponse({res,err});
    }
}
module.exports={addClientsData,addClientCandidatesData}
