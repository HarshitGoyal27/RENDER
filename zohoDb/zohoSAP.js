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
        let priorityArray=[obj.keyword,obj.primary_module,obj.secondary_module];
        let arr=[];
        candidates.forEach((ele)=>{
            let skill = ele.Skills.toLowerCase();
            let MayAlsoKnow = ele.MayAlsoKnow?ele.MayAlsoKnow.toLowerCase():'';
            let CandidateProfile=ele.CandidateProfile?ele.CandidateProfile.toLowerCase():'';
            let CurrentRole=ele.CurrentRole?ele.CurrentRole.toLowerCase():'';
            let PreviousRole=ele.PreviousRole?ele.PreviousRole.toLowerCase():'';
            let str=skill + ' , ' + MayAlsoKnow + ' , ' + CandidateProfile + ' , ' + CurrentRole + ' , ' + PreviousRole;
            let keyword=priorityArray[0].toLowerCase();
            let primary=priorityArray[1] && priorityArray[1].toLowerCase();
            let secondary=priorityArray[2] && priorityArray[2].toLowerCase();
            let primary_regex=new RegExp(`\\b${primary}\\b`,'ig');
            let secondary_regex=new RegExp(`\\b${secondary}\\b`,'ig');
            if(str.includes(keyword)){
                if(primary && secondary){
                    if(primary_regex.test(str) && secondary_regex.test(str)){
                        arr.push(ele);
                    }
                }else if(primary){
                    if(primary_regex.test(str)){
                        arr.push(ele);
                    }
                }else if(secondary){
                    if(secondary_regex.test(str)){
                        arr.push(ele);
                    }
                }else{
                    arr.push(ele);
                }
            }
        })
        return arr;
    }catch(err){
        console.log(err);
    }
}

// const sortedCandidates=(candidates,obj)=>{
//     try{
//         let priorityArray1=[];
//         priorityArray1.push(obj.keyword);
//         if(obj.primary_module){priorityArray1.push(obj.primary_module);}
//         if(obj.secondary_module){priorityArray1.push(obj.secondary_module);}
//         console.log(priorityArray1);
//         let isPrimary=priorityArray1[1]?true:false;  
//         let isSecondary=priorityArray1[2]?true:false;  
        
//         if(!isPrimary){return candidates;}

//         const sortOnCurrentRole=(a,b)=>{
//             let cr_1 = a.CurrentRole?a.CurrentRole:'';
//             let cr_2 = b.CurrentRole?b.CurrentRole:'';
//             let primary_regex=new RegExp(`[\\s-,]${priorityArray1[1]}[\\s,-]`,'ig');
//             if(isSecondary){
//                 let secondary_regex=new RegExp(`[\\s-,]${priorityArray1[2]}[\\s,-]`,'ig');
//                 if(primary_regex.test(cr_1) && secondary_regex.test(cr_1))
//                 {
//                     return -1;
//                 }
//                 else if(primary_regex.test(cr_2) && secondary_regex.test(cr_2))
//                 {
//                     return 1;
//                 }
//                 else if(primary_regex.test(cr_1)){
//                     return -1;
//                 }
//                 else if(primary_regex.test(cr_2)){
//                     return 1;
//                 }
//                 else{
//                     return 0;
//                 }
//             }
//             else{
//                 if(primary_regex.test(cr_1)){return -1;}
//                 else if(primary_regex.test(cr_2)){return 1;}
//                 else{return 0;}
//             }
//         }

//         const sortOnPreviousRole=(a,b)=>{
//             let pr_1 = a.PreviousRole?a.PreviousRole:'';
//             let pr_2 = b.PreviousRole?b.PreviousRole:'';
//             let primary_regex=new RegExp(`[\\s-,]${priorityArray1[1]}[\\s,-]`,'ig');
//             if(isSecondary){
//                 let secondary_regex=new RegExp(`[\\s-,]${priorityArray1[2]}[\\s,-]`,'ig');
//                 if(primary_regex.test(pr_1) && secondary_regex.test(pr_1))
//                 {
//                     return -1;
//                 }
//                 else if(primary_regex.test(pr_2) && secondary_regex.test(pr_2))
//                 {
//                     return 1;
//                 }
//                 else if(primary_regex.test(pr_1)){
//                     return -1;
//                 }
//                 else if(primary_regex.test(pr_2)){
//                     return 1;
//                 }
//                 else{
//                     return 0;
//                 }
//             }
//             else{
//                 if(primary_regex.test(pr_1)){return -1;}
//                 else if(primary_regex.test(pr_2)){return 1;}
//                 else{return 0;}
//             }
//         }

//         const sortOnKeySkills=(a,b)=>{
//             let ks_1=a.Skills.split(",");
//             let ks_2=b.Skills.split(",");
//             let primary_regex=new RegExp(`[\\s-,]${priorityArray1[1]}[\\s,-]`,'ig');
//             const findIdx1=(arr,reg_ex)=>{
//                 for(let i=0;i<arr.length;i++){
//                     if(reg_ex.test(`${arr[i]}`)){
//                         return i;
//                     }      
//                 } 
//                 return 999999;
//             }
//             let index_primary_a=findIdx1(ks_1,primary_regex);
//             let index_primary_b=findIdx1(ks_2,primary_regex);
//             if(isSecondary){
//                 let secondary_regex=new RegExp(`[\\s-,]${priorityArray1[2]}[\\s,-]`,'ig');
//                 let index_secondary_a=findIdx1(ks_1,secondary_regex);
//                 let index_secondary_b=findIdx1(ks_2,secondary_regex);
//                 if((index_primary_a < index_primary_b) && (index_secondary_a < index_secondary_b)){
//                     return -1;
//                 }
//                 else if((index_primary_a > index_primary_b) && (index_secondary_a > index_secondary_b)){
//                     return 1;
//                 }
//                 else if(index_primary_a < index_primary_b){return -1;}
//                 else if(index_primary_a > index_primary_b){return 1;}
//                 else{
//                     return 0;
//                 }
//             }else{
//                 if(index_primary_a < index_primary_b){return -1;}
//                 else if(index_primary_a > index_primary_b){return 1;}
//             }
//         }

//         const sortOnMayAlsoKnow=(a,b)=>{
//             let mak_1=a.MayAlsoKnow.split(",");
//             let mak_2=b.MayAlsoKnow.split(",");
//             let primary_regex=new RegExp(`[\\s-,]${priorityArray1[1]}[\\s,-]`,'ig');
//             const findIdx2=(arr,word,reg_ex)=>{
//                 for(let i=0;i<arr.length;i++){
//                     if(reg_ex.test(`${arr[i]}`)){
//                         return i;
//                     }      
//                 } 
//                 return 99999999;
//             }
//             let index_primary_a=findIdx2(mak_1,priorityArray1[1],primary_regex);
//             let index_primary_b=findIdx2(mak_2,priorityArray1[1],primary_regex);
//             if(isSecondary){
//                 let secondary_regex=new RegExp(`[\\s-,]${priorityArray1[2]}[\\s,-]`,'ig');
//                 let index_secondary_a=findIdx2(mak_1,priorityArray1[1],secondary_regex);
//                 let index_secondary_b=findIdx2(mak_2,priorityArray1[1],secondary_regex);
//                 if((index_primary_a < index_primary_b) && (index_secondary_a < index_secondary_b)){
//                     return -1;
//                 }
//                 else if((index_primary_a > index_primary_b) && (index_secondary_a > index_secondary_b)){
//                     return 1;
//                 }
//                 else if(index_primary_a < index_primary_b){return -1;}
//                 else if(index_primary_a > index_primary_b){return 1;}
//                 else{
//                     return 0;
//                 }
//             }else{
//                 if(index_primary_a < index_primary_b){return -1;}
//                 else if(index_primary_a > index_primary_b){return 1;}
//             }
//         }

//         let sortedCandidates=candidates.sort((a,b)=>{  
//             //Current Role
//             let cr_num=sortOnCurrentRole(a,b);
//             if(cr_num===0){
//                 //Previous Role
//                 let pr_num=sortOnPreviousRole(a,b);
//                 //KEY SKILLS
//                 if(pr_num===0){
//                     let ks_num=sortOnKeySkills(a,b);
//                     if(ks_num===0){
//                         let mak_num=sortOnMayAlsoKnow(a,b);
//                         return mak_num;
//                     }else{
//                         return ks_num;
//                     }
//                 }
//                 else{
//                     return pr_num;
//                 }
//             }
//             else{
//                 return cr_num;
//             }
//           });

//         return sortedCandidates;
        
//     }catch(err){
//         console.log(err);
//     }
// }

const removeDuplicates=(candidates)=>{
    let set=new Set();
    let uniqueCandidates=[];
    candidates.forEach((ele)=>{
        let str=JSON.stringify(ele);
        if(set.has(str)){
            //nothing to do
            console.log(ele.Name);
        }else{
            set.add(str);
            uniqueCandidates.push(ele);
        }
    })
    return uniqueCandidates;
}

const getSAPZoho = async (req, res, urls) => {
    try {
      let pageNumber=req.body.pageNoAxios;
      console.log('hellllooo',req.body.profiles);
      const responses = await Promise.all(urls.map(url => fetchData(url,pageNumber)));
      console.log(responses.length);
      let finalArray=[];
      responses.forEach((arr)=>{
        finalArray.push(...arr);
      });
      console.log('Total Candidates fetched is:',finalArray.length);
      const candidatesRelevantFields=findRelevantFields(finalArray);
      console.log('Total Candidates after relevant fields:=>',candidatesRelevantFields.length);
      let finalCandidates=filterCandidates(candidatesRelevantFields,req.body.profiles);
      console.log('Total Candidates after All the fields:=>',finalCandidates.length);
      const sorted=sortedCandidates(finalCandidates,req.body.profiles);
      const unique=removeDuplicates(sorted);
      console.log('SAP CANDIDATES:->',unique.length);
      finalCandidates=unique;
      console.log(finalCandidates[0]);
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