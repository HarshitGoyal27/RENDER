require("dotenv").config();
const {
  successResponse,
  errorResponse,
} = require("../utils/response/response.handler");
const axios = require("axios");
const { getAccessToken } = require("../accessToken");

let findRelevantFields = (C_data,profiles) => {
  try{
    let arr = [];
    for (let i = 0; i < C_data.length; i++) {
      let ele = C_data[i];
      if ((ele.Previosus_Role || ele.Current_Role) && ele.Current_Location && ele.Current_Salary) {
        let obj = {
          Name: ele.Full_Name,
          Email: ele.Email,
          Skills: ele.Skill_Set,
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
        if (profiles.minExp && profiles.maxExp && obj.Experience >= profiles.minExp && obj.Experience <= profiles.maxExp) {
          if(profiles.Current_Location && profiles.Current_Location===obj.CurrentLocation){
            arr.push(obj);
          }else if(!profiles.Current_Location){
            arr.push(obj);
          }
        } else if (!(profiles.minExp || profiles.maxExp)) {
          arr.push(obj);
        }
      }
    }
    return arr;
  }catch(err){
    console.log('err')
  }
};

async function fetchCandidatesForSkill(skill,profiles) {
  const accessToken = getAccessToken();
  try{
    let candidatesData=await axios.get(`https://recruit.zoho.in/recruit/v2/Candidates/search?criteria=Skill_Set:contains:${skill}`,{
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      params:{
        per_page:200//change here
      }
    });
    candidatesData=findRelevantFields(candidatesData.data.data,profiles);
    return candidatesData;
  }catch(err){
    console.log('Errorr');
  }
}

async function filterCandidates(candidates,expression) {
  try{
    let ans=[];
    console.log(expression);
    for(let i=0;i<candidates.length;i++){
      //array of object
      let arr=candidates[i];
      for(let i=0;i<arr.length;i++){
        let skill=arr[i].Skills;
        let temp=skill.toLowerCase();
        if(eval(expression)){
          ans.push(arr[i]);
        }
      }
    }
    return ans;
  }catch(err){
    console.log('err');
  }

}

async function getCandidatesForExpression(expression,profiles) {
  expression=expression.toLowerCase();
  let skill_stack=[];
  let word="";
  for(let i=0;i<expression.length;i++){
      let ch=expression[i];
      if(ch==='(' || ch===')' || ch==='|' || ch==='&'){
          word=word.trim();
          word.length>0 && skill_stack.push(word);
          word="";
          continue;
      }
      word+=ch;
  }
  word=word.trim();
  word.length>0 && skill_stack.push(word);
  for(let i=0;i<skill_stack.length;i++){
      let skill=`temp.includes(\"${skill_stack[i]}\")`;
      expression=expression.replace(`${skill_stack[i]}`,skill)
  }
  expression=expression.replace(/\|/g,"||");
  expression=expression.replace(/\&/,"&&");
  console.log(expression);
  const skillResults = await Promise.all(skill_stack.map((skill)=>{
    let data=fetchCandidatesForSkill(skill,profiles);
    return data;
  }));
  const mergedResults = skillResults;
  const filteredCandidates = await filterCandidates(mergedResults,expression,profiles);
  return {filteredCandidates,skill_stack};
}

let generateQuery=async(expression,profiles)=>{
    try{
      let candidatesWithSkillStack=await getCandidatesForExpression(expression,profiles);
      let candidates=candidatesWithSkillStack.filteredCandidates;
      let prioritySkills=candidatesWithSkillStack.skill_stack;
      let sortedCandidates=candidates.sort((a,b)=>{
        const skillsA = a.Skills.toLowerCase();
        const skillsB = b.Skills.toLowerCase();
        for(let skill of prioritySkills){
            const indexA = skillsA.indexOf(skill.toLowerCase());
            const indexB = skillsB.indexOf(skill.toLowerCase());
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            } else if (indexA !== -1) {
                return -1;
            } else if (indexB !== -1) {
                return 1;
            }
        }
      });
      console.log('Data sorted',sortedCandidates.length);
      return sortedCandidates;
    }catch(err){
      console.log(err);
    }
}


module.exports={generateQuery};
