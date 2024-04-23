/* eslint-disable no-undef */
const { errorResponse } = require("../utils/response/response.handler");
const candidateService = require("../services/candidateService");
const addCandidatesService=require("../services/addCandidatesService");
const getCandidate = async (req, res) => {
  try {
    const successResponse = await candidateService.getCandidateData(req, res);
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getCandidatesBySearch = async (req, res) => {
  try {
    const successResponse = await candidateService.searchCandidateData(req);
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};
//this function
const getCandidates = async (req, res) => {
  try {
    console.log('Services fn',req.body);
    const successResponse = await candidateService.getCandidatesData(req, res);
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getFilteredCandidates = async (req, res) => {
  try {
    const successResponse = await candidateService.getFilteredData(req, res);
    console.log('AA');
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getSortedCandidates = async (req, res) => {
  try {
    const successResponse = await candidateService.getSortedCandidateData(req);
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getcandidateSearchBar = async (req, res) => {
  try {
    const successResponse = await candidateService.getcandidateSearchBarData(
      req,
      res
    );
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getLocationSearchBar = async (req, res) => {
  try {
    const successResponse = await candidateService.getLocationSearchBarData(
      req,
      res
    );
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const updateCandidates = async (req, res) => {
  try {
    console.log('A');
    const successResponse = await addCandidatesService.updateCandidatesData(req, res);
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const deletedCandidates = async (req, res) => {
  try {
    const successResponse = await candidateService.deletedCandidatesData(
      req,
      res
    );
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
};

const getTotalCount=async(req,res)=>{
  try {
    const successResponse = await candidateService.getTotalCountData(req,res);
    return successResponse;
  } catch (error) {
    return errorResponse({ res, error });
  }
}
const addCandidates = async (req, res) => {
  try {
    console.log('reached 1')
    const successResponse = await addCandidatesService.addCandidatesData(req, res);
    return successResponse;
  } catch (err) {
    return errorResponse({ res, err });
  }
};

const getSCLCandidtates=async(req,res)=>{
  try {
    const successResponse = await candidateService.getSCLCandidtatesData(req, res);
    return successResponse;
  } catch (err) {
    return errorResponse({ res, err });
  }
}
 const getCertification=async(req,res)=>{
  try {
    const successResponse = await candidateService.getCertificationData(req, res);
    return successResponse;
  } catch (err) {
    return errorResponse({ res, err });
  }
 }

const getLinkedin=async(req,res)=>{
  try {
    const successResponse = await candidateService.getLinkedinData(req, res);
    return successResponse;
  } catch (err) {
    return errorResponse({ res, err });
  }
}

const getCandidateSAP = async (req, res) => {
  console.log('aaaa')
  try {
    const successResponse = await candidateService.getLinkedinData(req, res);
    return successResponse;
  } catch (err) {
    return errorResponse({ res, err });
  }
};

module.exports = {
  getCandidate,
  getCandidatesBySearch,
  getCandidates,
  getFilteredCandidates,
  getSortedCandidates,
  getcandidateSearchBar,
  getLocationSearchBar,
  updateCandidates,
  getLinkedin,
  deletedCandidates,
  addCandidates,
  getTotalCount,
  getSCLCandidtates,
  getCertification,
  getCandidateSAP
};
