require("dotenv").config();
const {
  successResponse,
  errorResponse,
} = require("../utils/response/response.handler");
const axios = require("axios");
const { getAccessToken } = require("../accessToken");
const {sortedCandidates}=require("./sortCandidates.js");

const findRelevantFields = (C_data) => {
    try{
      let arr = [];
      for (let i = 0; i < C_data.length; i++) {
        let ele = C_data[i];
        if ((ele.Previous_Role || ele.Current_Role) && ele.Current_Location && ele.Current_Salary && ele.Skill_Set) {
          let parse_Skill_Set=ele.Skill_Set.split(",").map((str)=>{str=str.trim();str=" "+str+" ";return str;})
          let final_Skill_Set=parse_Skill_Set.join(",").trim();
          let obj = {
            Name: ele.Full_Name,
            Email: ele.Email,
            Skills: final_Skill_Set,
            id: ele.id,
            Experience: ele.Experience_in_Years,
            PreviousRole: ele.Previous_Role,
            CurrentRole: ele.Current_Role,
            CandidateProfile: ele.Candidate_Profile,
            Salary: ele.Current_Salary,
            CurrentLocation: ele.Current_Location,
            MayAlsoKnow: ele.Additional_Skills,
            Education:ele.Highest_Qualification
          };
            arr.push(obj);
        }
      }
      return arr;
    }catch(err){
      console.log('err');
    }
};

const fetchData = async (url,pageNumber) => {
    try {
      const accessToken = getAccessToken();
      const response = await axios.get(url, {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
        params: {
          per_page: 200,
          page: pageNumber, // Assuming pageNumber is defined
        }
      });
      return response.data.data; // Return the data from the response
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error; // Throw the error to handle it outside
    }
};

const filterCandidates=(candidates, obj)=>{
    try{
        let priorityArray=[];
        priorityArray[0]=obj.primary_module?obj.primary_module:"";
        priorityArray[1]=obj.secondary_module?obj.secondary_module:"";
        priorityArray[2]=obj.role_type?obj.role_type:"";
        priorityArray[3]=obj.technical_skills?obj.technical_skills:"";
        priorityArray[4]=obj.project_type?obj.project_type:"";
        priorityArray[5]=obj.position_type?obj.position_type:"";
        priorityArray[6]=obj.HANAECC?obj.HANAECC:"";
        priorityArray[7]=obj.Certified?"certified":"";
        let arr=[];
        let regexArray=[];
        for(let i=0;i<priorityArray.length;i++){
          if(priorityArray[i]){
            let word=priorityArray[i];
            if(word==='Functional' || word==='Techno-Functional'){
              word='Consultant';
            }
            else if(word==='Technical'){
              word='6 DIFF KEYWORDS FOR ROLE TYPE CHECK';
              regexArray.push(word);
              continue;
            }
            let reg=new RegExp(`\\b${word}\\b`,'ig');
            regexArray.push(reg);
          }
        }
        let RegLen=regexArray.length;
        console.log(regexArray);
        candidates.forEach((ele)=>{
            let skill = ele.Skills.toLowerCase();
            let MayAlsoKnow = ele.MayAlsoKnow?ele.MayAlsoKnow.toLowerCase():'';
            let CandidateProfile=ele.CandidateProfile?ele.CandidateProfile.toLowerCase():'';
            let CurrentRole=ele.CurrentRole?ele.CurrentRole.toLowerCase():'';
            let PreviousRole=ele.PreviousRole?ele.PreviousRole.toLowerCase():'';
            let str=skill + ' , ' + MayAlsoKnow + ' , ' + CandidateProfile + ' , ' + CurrentRole + ' , ' + PreviousRole;
            let cnt=0;
            for(let i=0;i<RegLen;i++){
              let regex=regexArray[i];
              if(regex==='6 DIFF KEYWORDS FOR ROLE TYPE CHECK'){
                if(str.includes("developer") || str.includes("engineer") || str.includes("architect")){
                  cnt++; 
                }
              }
              else if(regex.test(str)){
                cnt++;
              }
            }    
            if(cnt===RegLen){
              arr.push(ele);
            }
        })
        console.log('Length',arr.length);
        return arr;
    }catch(err){
        console.log(err);
    }
}

function booleanFun(candidates,expression) {
  try{
    let ans=[];
    console.log(expression,candidates.length);
    for(let i=0;i<candidates.length;i++){
      //array of object
      let arr=candidates[i];
      let skill = arr.Skills.toLowerCase();
      let MayAlsoKnow = arr.MayAlsoKnow?arr.MayAlsoKnow.toLowerCase():'';
      let CandidateProfile=arr.CandidateProfile?arr.CandidateProfile.toLowerCase():'';
      let CurrentRole=arr.CurrentRole?arr.CurrentRole.toLowerCase():'';
      let PreviousRole=arr.PreviousRole?arr.PreviousRole.toLowerCase():'';
      let temp=skill + ' , ' + MayAlsoKnow + ' , ' + CandidateProfile + ' , ' + CurrentRole + ' , ' + PreviousRole;
      if(eval(expression)){
        ans.push(arr);
      }
    }
    return ans;
  }catch(err){
    console.log('err');
  }

}

const removeDuplicates=(candidates)=>{
    let set=new Set();
    let uniqueCandidates=[];
    console.log('****');
    candidates.forEach((ele)=>{
        let str=JSON.stringify(ele);
        if(set.has(str)){
            //nothing to do
        }else{
            set.add(str);
            uniqueCandidates.push(ele);
        }
    })
    return uniqueCandidates;
}

const getSAPZoho = async (req, res, urls, expression) => {
    try {
      let pageNumber=req.body.pageNoAxios;
      const responses = await Promise.all(urls.map(url => fetchData(url,pageNumber)));
      let finalArray=[];
      responses.forEach((arr)=>{
        if(arr){
            finalArray.push(...arr);
        }
        else{
          console.log("Error encountered123456");
        }
      });

      console.log('Total Candidates fetched is:',finalArray.length);

      const candidatesRelevantFields=findRelevantFields(finalArray);
      console.log('Total Candidates after relevant fields:=>',candidatesRelevantFields.length);

      const booleanCandidates=booleanFun(candidatesRelevantFields,expression);
      console.log('Total Candidates after boolean fields:=>',booleanCandidates.length,expression);

      const filteredCandidates=filterCandidates(booleanCandidates,req.body.profiles);
      console.log('Total Candidates after All the fields:=>',filteredCandidates.length);

      const unique=removeDuplicates(filteredCandidates);

      // const sorted=sortedCandidates(unique,req.body.profiles,[],[]);

      const finalCandidates=unique;
      console.log('SAP CANDIDATES:->',finalCandidates.length);

      return successResponse({
        res,
        data: { finalCandidates },
        message: "Success",
      });
    } catch (error) {
      console.log('abcdefgh',error)
      return errorResponse({ res, error });
    }
};

module.exports={getSAPZoho};