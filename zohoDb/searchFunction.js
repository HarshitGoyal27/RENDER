require("dotenv").config();
const {
  successResponse,
  errorResponse,
} = require("../utils/response/response.handler");
const axios = require("axios");
const { getAccessToken } = require("../accessToken");

let findIntersectionDirectly = (skills, result_stack, operator, memory) => {
  let data1 = result_stack.pop();
  let data2 = memory.ZohoResultArray;
  let finalArray = [];
  if (operator === "or") {
    return [...data1.ZohoResultArray, ...memory.ZohoResultArray];
  } else {
    console.log("abcdfgh", data1.ZohoResultArray.length, data2.length);
    data1.ZohoResultArray.map((ele) => {
      let skill = ele.Skills;
      if (skill.includes(skills[0])) {
        finalArray.push(ele);
      }
    });
  }
  return finalArray;
};
let findIntersectionatMultipleLevels = (result_stack, operator) => {
  try {
    console.log("multiple brackets reachedddddddddd", result_stack.length);
    let data1 = result_stack.pop();
    let data2 = result_stack.pop();
    console.log("SECOND BLOCK---->", data2.MemorySkill, data1.MemorySkill);
    // console.log(data1.length,data2.length);
    let finalArray = [];
    if (operator === "|") {
      finalArray = [...data1.ZohoResultAray, ...data2.ZohoResultAray];
    } else {
      console.log("AAHHHFVFFV");
      let word1 = data2.MemorySkill[0];
      let word2 = data2.MemorySkill[1];
      let op = data2.MemorySkill[2];
      console.log("length of data", data1.ZohoResultArray.length, word1, word2);
      data1.ZohoResultArray.map((ele) => {
        let skill = ele.Skills;
        // console.log(skill);
        if (op === "&" && skill.includes(word1) && skill.includes(word2)) {
          finalArray.push(ele);
        } else if (skill.includes(word1) || skill.includes(word2)) {
          finalArray.push(ele);
        }
      });
    }
    console.log("Length of final array", finalArray.length);

    return finalArray;
  } catch (err) {
    console.log("Multiple brackets,", err);
  }
};

let findRelevantFields = (C_data, profiles) => {
  let arr = [];
  console.log('find relevat fields');
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
        Education: ele.Highest_Qualification
      };
      if (profiles.minExp && profiles.maxExp && obj.Experience >= profiles.minExp && obj.Experience <= profiles.maxExp) {
        arr.push(obj);
      } else if (!(profiles.minExp || profiles.maxExp)) {
        // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
        arr.push(obj);
      }
    }
  }
  return arr;
};

let getZohoResults = async (skill, operator, result_stack, profiles) => {
  try {
    const accessToken = getAccessToken();
    let skills = skill.split(" # ");
    operator = operator === "&" ? "and" : "or";
    let query = skills.length > 1 ? `(Skill_Set:contains:${skills[0]})${operator}(Skill_Set:contains:${skills[1]})` : `(Skill_Set:contains:${skills[0]})`;
    console.log(query, operator);
    //call zoho function
    let candidates = await axios.get(
      `https://recruit.zoho.in/recruit/v2/Candidates/search?criteria=${query}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );
    let candidatesData = findRelevantFields(candidates.data.data, profiles);
    if(result_stack===null){
        console.log('abxkdinixdwxpoxome');
        return candidatesData;
    }
    let memory = {};
    skills.push(operator);
    memory.ZohoResultArray = candidatesData;
    memory.MemorySkill = skills;
    if (skills.length === 2) {
      //IF A SINGLE SKILL THAN FIND INTERSECTON DIRECTLY BETWEEN memory and result_stack.pop()
      let data = findIntersectionDirectly(
        skills,
        result_stack,
        operator,
        memory
      );
      let obj = {};
      obj.ZohoResultArray = data;
      result_stack.push(obj);
      console.log("Single skill function ended", data.length);
    } else {
      result_stack.push(memory);
      console.log(memory.ZohoResultArray.length);
    }
    console.log("yesss");
  } catch (err) {
    console.log("err", err);
  }
};

let generateQuery = async (str, profiles,flag) => {
  console.log("HHHHH", str);
  let skill_stack = [];
  let operator_stack = [];
  let result_stack = [];
  if(flag){
    let skill=profiles.Skill_Set;
    console.log(flag)
    let candidates=await getZohoResults(skill,null,null,profiles);
    return candidates;
  }else{
    for(let i = 0; i < str.length; i++) {
        let ch = str[i];
        // console.log(ch);
        if (ch === ")") {
          //ain logic
          let skill = "";
          while (skill_stack[skill_stack.length - 1] !== "(") {
            skill =
              skill.length === 0
                ? skill_stack.pop()
                : skill_stack.pop() + " # " + skill;
          }
          skill_stack.pop();
          skill = skill.trim();
          let operator = operator_stack.pop();
          if (skill.length > 0) {
            await getZohoResults(skill, operator, result_stack, profiles);
            console.log(result_stack.length);
          } else {
            //only works when multiple levels with mutiple queries
            console.log("aaaaaaabbbbbbb", skill);
            let data = findIntersectionatMultipleLevels(
              result_stack,
              operator,
              profiles
            );
            let obj = {};
            obj.ZohoResultArray = data;
            result_stack.push(obj);
          }
        } else if (/(\||&)/.test(ch)) {
          operator_stack.push(ch);
        } else {
          //merge skills with words
          if (str[i] === "(") {
            skill_stack.push("(");
          } else {
            let word = "";
            let j = i;
            while (true) {
              if ( str[j] === "|" || str[j] === "&" || str[j] === ")" || str[j] === "(" ) {
                break;
              }
              word += str[j];
              j++;
            }
            word = word.trim();
            console.log("hhhh", word);
            if (word.length > 0) {
              skill_stack.push(word);
            }
            i = j - 1;
          }
        }
      }
      return result_stack.pop().ZohoResultArray;
  }
};

module.exports={generateQuery};
