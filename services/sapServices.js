const { 
    successResponse,
    errorResponse,
} = require('../utils/response/response.handler');
const {getSAPZoho}=require('../zohoDb/zohoSAP');
const {
    API_URL_SEARCH,
    API_DELETED_COUNT,
    API_URL_GET,
    API_URL_GET_TABULAR_OLD
  } = require("../utils/constants/constants");
const getSAPData=async(req,res)=>{
    try{
        console.log(req.body);
        let keyword=req.body.profiles.keyword;
        keyword=keyword.replace(/\"/g,'');
        keyword=keyword.replace(/ and /ig,' & ');
        keyword=keyword.replace(/ or /ig,' | ');
        let expression=keyword;
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

        console.log(expression,skill_stack);

        let primary=req.body.profiles.primary_module;
        let secondary=req.body.profiles.secondary_module;
        let roleType=req.body.profiles.role_type;
        let skills=req.body.profiles.Skill_Set;
        let projectType=req.body.profiles.project_type;
        let positionType=req.body.profiles.position_type;
        let hana_ecc=req.body.profiles.HANAECC;
        let query1={key:[]};
        if(skill_stack.length>0){
            for(let i=0;i<skill_stack.length;i++){
                let str=`(Current_Role:contains:${skill_stack[i]})or(Previous_Role:contains:${skill_stack[i]})or(Skill_Set:contains:${skill_stack[i]})or(Candidate_Profile:contains:${skill_stack[i]})or(Additional_Skills:contains:${skill_stack[i]})`;
                query1.key.push(str);
            }
            
        }
        let query2=`(Current_Role:contains:${primary})or(Previous_Role:contains:${primary})or(Skill_Set:contains:${primary})or(Candidate_Profile:contains:${primary})or(Additional_Skills:contains:${primary})`;
        let query3=`(Current_Role:contains:${secondary})or(Previous_Role:contains:${secondary})or(Skill_Set:contains:${secondary})or(Candidate_Profile:contains:${secondary})`;
        let query4=``;
        let query5=`(Current_Role:contains:${skills})or(Previous_Role:contains:${skills})or(Skill_Set:contains:${skills})or(Candidate_Profile:contains:${skills})or(Additional_Skills:contains:${skills})`;
        let query6=`(Current_Role:contains:${projectType})or(Previous_Role:contains:${projectType})or(Skill_Set:contains:${projectType})or(Candidate_Profile:contains:${projectType})or(Additional_Skills:contains:${projectType})`;
        let query7=`(Current_Role:contains:${positionType})or(Previous_Role:contains:${positionType})or(Skill_Set:contains:${positionType})or(Candidate_Profile:contains:${positionType})or(Additional_Skills:contains:${positionType})`;
        if(roleType==='Technical'){
            query4=`(Current_Role:contains:Developer)or(Current_Role:contains:Engineer)or(Current_Role:contains:Architect)`;
        }
        else if(roleType==='Functional' || roleType=='Techno_Functional'){
            query4=`(Current_Role:contains:Consultant)or(Previous_Role:contains:Consultant)or(Skill_Set:contains:Consultant)or(Candidate_Profile:contains:Consultant)or(Additional_Skills:contains:Consultant)`;
        }
        let query8=`(Current_Role:contains:${hana_ecc})or(Previous_Role:contains:${hana_ecc})or(Skill_Set:contains:${hana_ecc})or(Candidate_Profile:contains:${hana_ecc})or(Additional_Skills:contains:${hana_ecc})`;
        
        let query9=`(Current_Role:contains:certified)or(Previous_Role:contains:certified)or(Skill_Set:contains:certified)or(Candidate_Profile:contains:certified)or(Additional_Skills:contains:certified)`

        const url1=[];
        for(let i=0;i<skill_stack.length;i++){
            let str=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query1.key[i])}`
            url1.push(str);
        }
        const url2=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query2)}`;
        const url3=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query3)}`;
        const url4=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query4)}`;
        const url5=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query5)}`;
        const url6=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query6)}`;
        const url7=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query7)}`;
        const url8=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query8)}`;
        const url9=`${API_URL_SEARCH}?criteria=${encodeURIComponent(query9)}`;
        let url=[];
        url.push(...url1);
        if(req.body.profiles.primary_module){
            url.push(url2);
        }
        if(req.body.profiles.secondary_module){
            url.push(url3);
        }
        if(req.body.profiles.role_type){
            url.push(url4);
        }
        if(req.body.profiles.Skill_Set){
            url.push(url5);
        }
        if(req.body.profiles.project_type){
            url.push(url6);
        }
        if(req.body.profiles.position_type){
            url.push(url7);
        }
        if(req.body.profiles.HANAECC){
            url.push(url8);
        }
        if(req.body.profiles.Certified){
            url.push(url9);
        }
        console.log(url);
        const resp=await getSAPZoho(req,res,url,expression,skill_stack);
        return resp;
    }catch(err){
        console.log(err);
    }

}
module.exports={getSAPData};