const axios=require("axios");
let url="https://recruit.zoho.in/recruit/v2/Candidates/search";
const accessToken="1000.28e6fb8434952507c489f1eb614e1a34.aab7578779b452454e607758231d5c54";
let test=async(url)=>{
    try{
        let resp=await axios.get(`${url}`,{
            headers:{
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            },
            params:{
                per_page:200,
                page:2
            }
        });
        console.log('QUERY HIT',resp.data.info);
        //return resp.data.data;
    }catch(err){
        console.log(err);
    }
}

const query=`${url}?criteria=${encodeURIComponent("Current_Role:contains:TM")}`;
test(query);


// let keyword='SAP';
// let primary="TM";
// let secondary="FI";
// let query1=`(Current_Role:contains:${keyword})or(Previous_Role:contains:${keyword})or(Skill_Set:contains:${keyword})or(Candidate_Profile:contains:${keyword})or(Additional_Skills:contains:${keyword})`;
// let query2=`(Skill_Set:contains:${primary})or(Additional_Skills:contains:${primary})`;
// let query3=`(Current_Role:contains:${secondary})or(Previous_Role:contains:${secondary})or(Skill_Set:contains:${secondary})or(Candidate_Profile:contains:${secondary})or(Additional_Skills:contains:${secondary})`;
// let query4=`(Current_Role:contains:${primary})`;
// let query5=`(Previous_Role:contains:${primary})`;
// let query6=`(Candidate_Profile:contains:${primary})`;
// const url1=`${url}?criteria=${encodeURIComponent(query1)}`;
// const url2=`${url}?criteria=${encodeURIComponent(query2)}`;
// const url3=`${url}?criteria=${encodeURIComponent(query3)}`;
// const url4=`${url}?criteria=${encodeURIComponent(query4)}`;
// const url5=`${url}?criteria=${encodeURIComponent(query5)}`;
// const url6=`${url}?criteria=${encodeURIComponent(query6)}`;
// let urls=[];
// urls.push(url1,url2,url3,url4,url5,url6);
// console.log(urls);
// //const responses = Promise.all(urls.map(url => test(url)));
// responses.then((ans)=>{
//     let finalArray=[];
//     ans.forEach((arr)=>{
//         finalArray.push(...arr);
//     });
//     console.log(finalArray.length);
// })