require("dotenv").config();
const {
  successResponse,
  errorResponse,
} = require("../utils/response/response.handler");
const axios = require("axios");
const { getAccessToken } = require("../accessToken");
const {generateQuery}=require("./searchFunction.js");
const removeDuplicates=(data)=>{
  const set=new Set();
  const arr=[]
  data.forEach((ele)=>{
    let temp=ele.toLowerCase();
    ele=ele.replace(ele.charAt(0),ele.charAt(0).toUpperCase()).trim();
    if(!set.has(temp)){
      set.add(temp);
      arr.push(ele);
    }
  });
  return arr;

}
const getRequiredFields = (C_data) => {
  return C_data.data.map((ele) => ({
    Name: ele.Full_Name,
    Email: ele.Email,
    Skills: ele.Skill_Set,
    id: ele.id,
    Experience: ele.Experience_in_Years,
    PreviousRole: ele.Previous_Role,
    CurrentRole: ele.Current_Role,
    CandidateProfile: ele.Candidate_Profile,
    Salary: ele.Current_Salary,
    PrefferedLocation: ele.Preferred_Location,
    CurrentLocation: ele.Current_Location,
  }));
};

const getTabularFields = ({ FL }) => {
  let obj = {};
  for (let i in FL) {
    let key = FL[i].val;
    key = !/\s\/\s/.test(key)
      ? key.replace(/\s/, "_")
      : key.replace(/\s\/\s/, "_").replace(/\s/, "_");
    let rows = {};
    let arr = [];
    if (FL[i].TR) {
      arr = [];
      FL[i].TR.forEach((ele) => {
        rows = {};
        ele.TL.forEach((values) => {
          if (values.val !== "TABULARROWID") {
            let val = !/\s\/\s/.test(values.val)
              ? values.val.replace(/\s/, "_")
              : values.val.replace(/\s\/\s/, "_");
            rows[val] = values.content;
          }
        });
        arr.push(rows);
      });
      obj[key] = arr;
    } else {
      obj[key] = "";
    }
  }
  return obj;
};

const getScore=({data})=>{
  let months_exp=0;
  data.experiences.forEach((ele)=>{
      const date=ele.caption;
      const regex=/[^·]+\s*[·]\s*([^\n\r]+)/;
      const duration=regex.test(date)?date.match(regex)[1]:'';//in months
      months_exp+=parseInt(duration.match(/([\d]+)/)[1]);
  });
  return months_exp;
}

const getCandidatesZoho = async (res, query, {profiles}) => {
  try {
    console.log('aaaa',query,profiles);
    const candidatesData = await generateQuery(query,profiles);
    console.log('candidatesData:->',candidatesData.length);
    return successResponse({
      res,
      data: { candidatesData },
      message: "Success",
    });
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getCandidateZoho = async (res, url1, url2) => {
  try {
    const accessToken = getAccessToken();
    const [candidates, tabular] = await Promise.all([
      axios.get(url1, {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }),
      axios.get(url2, {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }),
    ]);
    if (candidates.data != "") {
      const candidatesData = getRequiredFields(candidates.data); //Array of objects
      const tabularData = getTabularFields(
        tabular.data.response.result.Candidates
      ); //object
      candidatesData.push(tabularData);
      return successResponse({
        res,
        data: { candidatesData },
        message: "Success",
      });
    } else {
      return successResponse({
        res,
        data: { candidatesData:[] },
        message: "Success",
      });
    }
  } catch (error) {
    console.log(error);
    return errorResponse({ res, error });
  }
};

const searchCandidateZoho = async (url) => {
  try {
    const accessToken = getAccessToken();
    const candidates = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });
    return successResponse({ res, data: { candidates }, message: "Success" });
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getFilteredZoho = async (res,url,pageNumber) => {
  try {
    const accessToken = getAccessToken();
    const candidates = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      params: {
        per_page: 5,
        page: pageNumber,
      },
    });
    if (candidates.data != "") {
      const candidatesData = getRequiredFields(candidates.data);
      console.log(candidatesData);
      return successResponse({
        res,
        data: { candidatesData },
        message: "Success",
      });
    } else {
      return successResponse({
        res,
        data: { candidatesData: "Data not present" },
        message: "Success",
      });
    }
  } catch (error) {
    console.log('DD');
    return errorResponse({ res, error });
  }
};

const getSortedCandidateZoho = async (url) => {
  try {
    const accessToken = getAccessToken();
    const candidates = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });
    return successResponse({ res, data: { candidates }, message: "Success" });
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const addCandidatesZoho = async (res, data, url) => {
  try {
    const accessToken = getAccessToken();
    console.log('Reached 3');
    let candidatesidresp = await axios.post(url, data, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });
    console.log(candidatesidresp.data.data);
    return successResponse({
      res,
      data: "Candidates added Succesfully",
      message: "Success",
    });
  } catch (err) {
    console.log(err);
    return errorResponse({ res, err });
  }
};

const getCandidatesSearchBarZoho = async (res, url) => {
  try {
    const accessToken = getAccessToken();
    const resp1 = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      params: {
        per_page: 5 ,
        page: 1,
      },
    });
    const arr = resp1.data.data;
    if (!arr) {
      return successResponse({ res, data: [], message: "Success" });
    }
    const searchSkills = arr.map((ele) => {
      const skill = ele.Skill_Set.match(/^[^,•:]*/);
      return skill[0];
    });
    const uniqueSkills = removeDuplicates(searchSkills);
    return successResponse({ res, data: uniqueSkills, message: "Success" });
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getLocationSearchBarZoho = async (res, url) => {
  try {
    const accessToken = getAccessToken();
    const resp = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      params: {
        per_page: 8,
        page: 1,
      },
    });
    const arr = resp.data.data;
    if (!arr) {
      console.log('abcd');
      return successResponse({ res, data: [], message: "Success" });
    }
    const searchLocation = arr.map((ele) => {
      const location = ele.Current_Location;
      return location;
    });
    const uniqueLocations = removeDuplicates(searchLocation);
    return successResponse({ res, data: uniqueLocations, message: "Success" });
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const updateCandidatesZoho = async (res, data, url) => {
  try {
    const accessToken = getAccessToken();
    const resp = await axios.put(
      url,
      { data },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );
    console.log(resp);
    return successResponse({
      res,
      data: "Updated Succesfully",
      message: "Success",
    });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

const deletedCandidatesZoho = async (res, url) => {
  try {
    console.log('AAAAA')
    const accessToken = getAccessToken();
    const resp = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });
    return successResponse({ res, data: resp.data, message: "Success" });
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getTotalCountZoho=async(res,url)=>{
  try{
    const accessToken=getAccessToken();
    let pageNum=1;
    const resp=await axios.get(url,{
      headers:{
        Authorization:`Zoho-oauthtoken ${accessToken}`,
      },
      params:{
        page:pageNum
      }
    });
    //console.log(resp.data);
    let more_records=resp.data.info.more_records;
    let count=resp.data.info.count;
    while(more_records){
      pageNum++;
      console.log('A');
      const respInLoop=await axios.get(url,{
        headers:{
          Authorization:`Zoho-oauthtoken ${accessToken}`,
        },
        params:{
          page:pageNum
        }
      });
      more_records=respInLoop.data.info.more_records;
      count+=respInLoop.data.info.count;
    }
    return successResponse({res,data:count,message:"Success"});
  }catch(error){
    console.log('errorr in fetching too many records');
    return errorResponse({ res, error });
  }
}

const getSCLCandidtatesZoho=async(res,url)=>{
  const accessToken=getAccessToken();
  console.log('C');
  try{
    const candidates=await axios.get(url,{
      headers:{
        Authorization:`Zoho-oauthtoken ${accessToken}`
      },
      params:{
        per_page:5
      }
    });
    if (candidates.data != "") {
      const candidatesData = getRequiredFields(candidates.data);
      return successResponse({
        res,
        data: { candidatesData },
        message: "Success",
      });
    } else {
      return successResponse({
        res,
        data: { candidatesData: "Data not present" },
        message: "Success",
      });
    }
  }catch(error){
    return errorResponse({res,error});
  }
}

const getCertificationZoho=async(res,query_word)=>{
  try{

  }catch(err){

  }
}

const getLinkedinZoho=async(res,link)=>{
  const options = {
    method: 'POST',
    url: 'https://linkedin-data-scraper.p.rapidapi.com/person_deep',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '16f4cf4345msh4cdbad93810196fp11aa70jsn852dc5345e60',
      'X-RapidAPI-Host': 'linkedin-data-scraper.p.rapidapi.com'
    },
    data:{}
  };
  try{
    options.data.link=`${link}`;
    console.log('A',options)
    const response=await axios.request(options);
    const score=getScore(response.data);
    console.log('Score is ',score)
    return successResponse({
      res,
      data: { score: score},
      message: "Success",
    });
  }catch(err){
    console.log(err);
    return errorResponse({res,err});
  }
}


module.exports = {
  getCandidatesZoho,
  getCandidateZoho,
  searchCandidateZoho,
  getFilteredZoho,
  getSortedCandidateZoho,
  addCandidatesZoho,
  getCandidatesSearchBarZoho,
  getLocationSearchBarZoho,
  deletedCandidatesZoho,
  updateCandidatesZoho,
  getTotalCountZoho,
  getSCLCandidtatesZoho,
  getCertificationZoho,
  getLinkedinZoho
};

