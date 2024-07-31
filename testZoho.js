const axios=require("axios");
const fs=require("fs");
let url="https://recruit.zoho.in/recruit/v2/Candidates/search";
const accessToken="1000.012e399e8f8c22d50d5f9460aab59b9c.26cee442859674147537cb24b2a4872e";
let test=async(url)=>{
    try{
        let resp=await axios.get(`${url}`,{
            headers:{
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            },
            params:{
                per_page:5,
                page:1
            }
        });
        console.log('QUERY HIT',resp.data.info);
        fs.writeFileSync("./testZoho.json",JSON.stringify(resp.data.data))
        //return resp.data.data;
    }catch(err){
        console.log(err);
    }
}

//const query=`${url}?criteria=(Current_Role:contains:EWM)and(Current_Role:contains:ABAP)or(Current_Role:contains:FICO)`;
//test(query);


function encodeFileToBase64(filePath) {
    const file = fs.readFileSync(filePath);
    return Buffer.from(file).toString('base64');
  }
  
  async function addDocument(filePath, accessToken) {
    try {
      const base64EncodedResume = encodeFileToBase64(filePath);
      const filename = filePath.split('/').pop(); // Extract filename from path
  
      const data = {
        "filename": filename,
        "document": base64EncodedResume
      };
  
      const headers = {
        "Authorization": `Zoho-oauthtoken ${accessToken}`,
        "Content-Type":"multipart/form-data"
      };
  
      const response = await axios.post("https://recruit.zoho.in/recruit/v2/Candidates/actions/import_document", data, { headers });
      console.log("API Response:", response.data);
    } catch (err) {
      console.error("Error:", err);
    }
  }
  
  
  const filePath = "./resume.docx";
  addDocument(filePath, accessToken);

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