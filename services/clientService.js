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
        obj.Client_Name=client.Name;//required
        obj.Email=client.Email;//required
        obj.Company=client.Company_name;//required
        obj.Contact_Number=client.contact_number;//required
        if(client.meetingDate)
        {
            obj.Call_Schedule=client.meetingDate;//required
        }
        if(client.Start_Date)
        {
            obj.Start_Date=client.Start_Date;//required
        }
        obj.Current_Timezone=client.Current_Timezone;//required
        obj.Client_Job_Name=client.Designation;//required
        obj.Candidates=clientCandidates.join(',');
        obj.Number_of_Positions=client.Openings;
        obj.Job_Description=client.Job_Description;
        console.log('*******',obj);
        const successResponse=await addClientCandidatesZoho(res,[obj],API_CLIENT);
        return successResponse;
    }catch(err){
        console.log(err);
        return errorResponse({res,err});
    }
}
module.exports={addClientsData,addClientCandidatesData}
