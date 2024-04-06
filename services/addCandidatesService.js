const { 
    successResponse,
    errorResponse,
} = require('../utils/response/response.handler')
const { addCandidatesZoho,updateCandidatesZoho } =require('../zohoDb/zohoCandidateApis');
const {API_URL_GET}=require("../utils/constants/constants");
const addCandidatesData = async (req,res) => {
    try {
        const dataFromrequest = req.body;//JSON array[{},{},{},...]
        let dataTobeAdded=[];
        dataTobeAdded.push(req.body);//req.body is a simple object
        let obj={};
        obj.data=dataTobeAdded; 
        const successResponse = await addCandidatesZoho(res,obj,API_URL_GET);//function ending with zoho would make API calls
        return successResponse
    } catch (error) {
        return errorResponse ({res, error})
    }
}
const updateCandidatesData = async (req, res) => {
    try {
      console.log('B');
      let obj=req.body;
      obj.id=req.params.id;
      
      let url=`${API_URL_GET}/${req.params.id}`;
      const successResponse = await updateCandidatesZoho(res,[obj],url); //function ending with zoho would make API calls
      return successResponse;
    } catch (error) {
      return errorResponse({ res, error });
    }
  };
module.exports={addCandidatesData,updateCandidatesData}