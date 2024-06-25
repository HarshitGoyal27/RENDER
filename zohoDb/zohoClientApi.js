require("dotenv").config();
const {
  successResponse,
  errorResponse,
} = require("../utils/response/response.handler");
const axios = require("axios");
const { getAccessToken } = require("../accessToken");

const checkClientAddedOrNot=async(data)=>{
    try{
        const accessToken = getAccessToken();
        const phone=data[0].Contact_Number;
        const email=data[0].Email;
        const successRes=await axios.get(`https://recruit.zoho.in/recruit/v2/Clients/search?criteria=(Email:contains:${email})`,{
            headers:{
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            }
        });
        if(successRes.data){
            console.log('Data is already present',successRes.data.info)
            return successRes.data.data[0].id;
        }else{
            console.log("Data is not present");
            return false;
        }

    }catch(err){
        console.log('ERRORR')
        return false;
    }
}

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
        console.log('c',data);
        const accessToken = getAccessToken();
        let flag=await checkClientAddedOrNot(data);
        if(flag){
            data[0].id=flag+'';
            const successRes=await axios.put(`${url}/${flag}`,{data},{
                headers:{
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                }
            });
            console.log('Client modified',successRes.data.data[0].details);
            let jobId=await addJobOpening(data,true);//client and contact
            return successResponse({ res, data: "Clients Candidates added Succesfully", message: "Success" });
        }else{
            const successRes=await axios.post(url,{data},{
                headers:{
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                }
            });
            console.log('Client added',successRes.data.data[0].details);
            let contact=await addContact(data);
            let jobId=await addJobOpening(data,false);
            return successResponse({ res, data: "Clients Candidates added Succesfully", message: "Success" });
        }
    }catch(err){
        console.log('Not added',err)
        return errorResponse({res,err})
    }
}

const addJobOpening=async(client,flag)=>{
    console.log('abc',client);
    let obj={};
    obj.Job_Opening_Name=client[0].Client_Job_Name;
    obj.Client_Name=client[0].Client_Name;
    if(client[0].Call_Schedule)
    {
        obj.Target_Date=client[0].Call_Schedule.substring(0,10);
    }
    else{
        obj.Target_Date="2024-05-03";
    }
    obj.Industry='Technology';
    obj.Number_of_Positions=client[0].Number_of_Positions;
    obj.Job_Description=client[0].Job_Description;
    let arr=[];
    arr.push(obj);
    try{
        const accessToken = getAccessToken();
        const successRes=await axios.post('https://recruit.zoho.in/recruit/v2/Job_Openings',{"data":arr},{
            headers:{
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            }
        });
        console.log('Job Opeining added',successRes.data.data[0].details);
        const associate=await associateCandidates(successRes.data.data[0].details.id,client);
        return successRes.data.data[0].details.id;
    }catch(err){
        console.log('Job opening not added',err)
        return true;
    }
}

const addContact=async(client)=>{
    let obj={};
    obj.Client_Name=client[0].Client_Name;
    obj.Email=client[0].Work_Email;
    obj.Last_Name=client[0].Client_Name;
    obj.Work_Phone=client[0].Contact_Number;
    let arr=[];
    arr.push(obj);
    try{
        const accessToken = getAccessToken();
        const successRes=await axios.post('https://recruit.zoho.in/recruit/v2/Contacts',{"data":arr},{
            headers:{
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            }
        });
        console.log('Client Contact added',successRes.data.data[0].details);
        return successRes.data.data[0].details;
    }catch(err){
        console.log('Client Contact not added',err)
        return true;
    }

}

const associateCandidates=async(jobid,client)=>{
    let obj={};
    obj.jobids=[`${jobid}`];
    obj.ids=client[0].Candidates.split(",");
    obj.comments="Record successfully associated by Harshit"
    let arr=[];
    arr.push(obj);
    try{
        const accessToken = getAccessToken();
        const successRes=await axios.put('https://recruit.zoho.in/recruit/v2/Candidates/actions/associate',{"data":arr},{
            headers:{
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            }
        });
        console.log('Client Associated Sucessfuly',successRes.data.data[0].details);
        return true;
    }catch(err){
        console.log('Client Not Associated',err);
        return true;
    }
}

const submmitToClient=async(jobid,client,clientId,contactDetails)=>{
    let obj={};
    obj.Submitted_To=contactDetails.id+""
    obj.Client_Name=clientId+"";
    obj.Candidate_Name=client[0].Candidates;
    obj.Job_Opening_Name=jobid+"";
    obj.$medium="Email";
    obj.$mail_content={
        "from_address": "skillscapital.team2@skillscapital.io",
        "subject": "Candidate Submission | Accountant",
        "description": "Greetings, I've attached the profile of a potential candidate for the Accountant position in your company. Regards, Patricia Boyle",
    }
    let arr=[];
    arr.push(obj);
    console.log(arr);
    try{
        const accessToken = getAccessToken();
        // const successRes=await axios.post('https://recruit.zoho.in/recruit/v2/Submissions',{"data":arr},{
        //     headers:{
        //         Authorization: `Zoho-oauthtoken ${accessToken}`,
        //     }
        // });
        // console.log('Submitted to client',successRes.data.data[0].details);
        // return true;
    }catch(err){
        console.log('Not submitted to client',err);
        return true;
    }
}


module.exports={addClientsZoho,addClientCandidatesZoho};