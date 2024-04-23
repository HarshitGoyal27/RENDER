const {
  successResponse,
  errorResponse,
} = require("../utils/response/response.handler");
const {
  getCandidatesZoho,
  getCandidateZoho,
  addCandidatesZoho,
  getCandidatesSearchBarZoho,
  getLocationSearchBarZoho,
  deletedCandidatesZoho,
  updateCandidatesZoho,
  getTotalCountZoho,
  getFilteredZoho,
  getSCLCandidtatesZoho,
  getCertificationZoho,
  getLinkedinZoho
} = require("../zohoDb/zohoCandidateApis");
const {
  API_URL_SEARCH,
  API_DELETED_COUNT,
  API_URL_GET,
  API_URL_GET_TABULAR_OLD
} = require("../utils/constants/constants");


const getCandidatesData = async (req, res) => {
  try {
    let query = req.body.profiles.Skill_Set; 
    console.log('hellllooo',req.body,query);
    query=query.replace(/\"/g,'');
    query=query.replace(/ and /ig,' & ');
    query=query.replace(/ or /ig,' | ');
    console.log(query);
    query=query.trim();
    console.log('hhhhhhhh')
    const successResponse = await getCandidatesZoho(res, query,req.body); 
    return successResponse;
  } catch (error) {
    console.log('abcdefgh',error)
    return errorResponse({ res, error });
  }
};

const getCandidateData = async (req, res) => {
  try {
    const id = req.params.id;
    const url1 = `${API_URL_GET}/${id}`;
    const url2 = `${API_URL_GET_TABULAR_OLD}?id=${id}`;
    const successResponse = await getCandidateZoho(res, url1, url2);
    return successResponse; 
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const searchCandidateData = async (req, res) => {
  try {
    const candidates = await candidateService.searchCandidateZoho(req);
    return successResponse({ res, data: { candidates }, message: "Success" }); //function ending with zoho would make API calls
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getFilteredData = async (req, res) => {
  try {
    let query = req.body.prof;
    let pageNumber=req.body.pageNumber;
    let str = ""; 
    for (let key in query) {
      if (query[key] != "" && key!=="Experience_in_Years" && key!=="Current_Timezone") {
        str += `(${key.trim()}:contains:${query[key].trim()})and`;
      } else if ((key === "Experience_in_Years" || key==="Current_Timezone") && query[key] != "") {
        str += `(${key.trim()}:equals:${query[key]})and`;
      }
    }
    query = str.substring(0,str.length-3);
    console.log(query);
    const url = `${API_URL_SEARCH}?criteria=${encodeURIComponent(query)}`;
    const successResponse = await getFilteredZoho(res,url,pageNumber);
    return successResponse;
  } catch (error) {
    console.log('CC',error);
    return errorResponse({ res, error });
  }
};

const getSortedCandidateData = async (req, res) => {
  try {
    const data = req.body;
    const url = `${API_URL_SEARCH}?sort_order_by=${data.sortOrder}&sortBy=${data.sortBy}`;
    // const candidates = await candidateService.getSortedCandidateZoho(req);
    // return successResponse ({res, data: { candidates }, message: 'Success'})//function ending with zoho would make API calls
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getcandidateSearchBarData = async (req, res) => {
  try {
    const data = req.body;
    const searcH1 = `(Skill_Set:starts_with:${data.search})`;
    const url = `${API_URL_SEARCH}?criteria=${encodeURIComponent(searcH1)}`;
    console.log(url);
    const successResponse = await getCandidatesSearchBarZoho(res, url);
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};
const getLocationSearchBarData = async (req, res) => {
  try {
    const data = req.body;
    const searcH1 = `(Current_Location:starts_with:${data.searchLocation})`;
    const url = `${API_URL_SEARCH}?criteria=${encodeURIComponent(searcH1)}`;
    const successResponse = await getLocationSearchBarZoho(res, url);
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const deletedCandidatesData = async (req, res) => {
  try {
    const successResponse = await deletedCandidatesZoho(
      res,
      `${API_DELETED_COUNT}`
    ); //function ending with zoho would make API calls
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getTotalCountData=async(req,res)=>{
  try {
    let query = req.body.profiles; //we have to make query here and process it in zohoCandidateAPI
    let str = ""; //{[...]}
    for (let key in query) {
      if (query[key] != "" && key!=="Experience_in_Years" && key!=="Current_Timezone") {
        str += `(${key.trim()}:contains:${query[key].trim()})and`;
      } else if ((key === "Experience_in_Years" || key==="Current_Timezone") && query[key] != "") {
        str += `(${key.trim()}:equals:${query[key].trim()})and`;
      }
    }
    query = str.substring(0,str.length-3);
    console.log(query);
    const url = `${API_URL_SEARCH}?criteria=${encodeURIComponent(query)}`;
    console.log(url);
    const successResponse = await getTotalCountZoho(res, url); //function ending with zoho would make API calls
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
}

const getSCLCandidtatesData=async(req,res)=>{
  try{
    const query="(Skill_Set:contains:SAP)or(Skill_Set:contains:Legacy)or(Skill_Set:contains:Cloud)"
    const url = `${API_URL_SEARCH}?criteria=${encodeURIComponent(query)}`;
    const successResponse=await getSCLCandidtatesZoho(res,url);
    return successResponse;
  }catch(error){
    return errorResponse({res,error});
  }
}

const getCertificationData=async(req,res)=>{
  try{
    const query=req.body.word
    const successResponse=await getCertificationZoho(res,query);
    return successResponse;
  }catch(error){
    return errorResponse({res,error});
  }
}

const getLinkedinData=async(req,res)=>{
  try{
    const query=req.body.profile_link
    const successResponse=await getLinkedinZoho(res,query);
    return successResponse;
  }catch(error){
    return errorResponse({res,error});
  }
}

module.exports = {
  getCandidateData,
  getCandidatesData,
  searchCandidateData,
  getFilteredData,
  getSortedCandidateData,
  getcandidateSearchBarData,
  getLocationSearchBarData,
  deletedCandidatesData,
  getTotalCountData,
  getSCLCandidtatesData,
  getCertificationData,
  getLinkedinData
};
