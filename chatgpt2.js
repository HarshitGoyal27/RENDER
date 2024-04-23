const axios = require('axios');
const fs=require('fs')
const options = {
  method: 'POST',
  url: 'https://api.edenai.run/v2/text/chat',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzQ4NDVhN2QtMWNlMC00Y2YxLWFkN2UtZTg4NTlkZGE5YWY2IiwidHlwZSI6ImZyb250X2FwaV90b2tlbiJ9.GzZV6uw7Z8yg_jtcD0Ck65e59SDaXVE9VnTyvwv7B4w'
  },
  data: {
    response_as_dict: true,
    attributes_as_list: false,
    show_original_response: false,
    settings: '{"openai" : "gpt-4"}',
    temperature: 0,//same output for given input(randomness:0)
    max_tokens: 1000,
    providers: 'google',
    // text: 'Write minimum requirements for a Javascript developer with 3 years of experience nothing extra and give 6-8 points',
    chatbot_global_action: 'You are a helpful assistant'
  }
};
const skill=(skill)=>{
    return new Promise(async(resolve,reject)=>{
      const job_advertisement=`Write a brief job advertisement for ${skill} for the company "SkillCapital" The format should be like this "Brief Job advertisement for ${skill} and then give the response and there should be only a single paragraph of not more than 70-80 words Dont put an unnecessary link or any contact details \n`
      const job_roles_resp=`Write the roles and responsibilites for ${skill} The format of response should be like this "Roles and Responsibilities for ${skill}" and then give 6-8 points nothing extra and no subpoints and give different variety and point numbering should be from 1 Dont put an unnecessary link or any contact details Follow my instruction clearly and strictly \n`
      const job_req=`Write minimum requirements for ${skill} The format of response should be like this "Job Requirements for ${skill}" and then give 6-8 points nothing extra and no subpoints and give different variety and point numbering should be from 1 and make sure to add the point for minimum experience of 3 years or a highly skilled fresher and this point should be first. Dont put an unnecessary link or any contact details Follow my instruction clearly and strictly \n`
      const job_pref_skills=`Write preferred skills for ${skill} . The format of response should be like this "Preferred Skills for ${skill}" and then give 6-8 points nothing extra and no subpoints and give different variety and point numbering should be from 1 Dont put an unnecessary link or any contact details Follow my instruction clearly and strictly`
      const arr=[job_advertisement,job_roles_resp,job_req,job_pref_skills];
      const str=arr.join('');
      options.data.text=`${str}`;
      try{
        const response=await axios.request(options);
        let data=response.data.google.generated_text.replace(/\*/g, '').replace(/:/g, '').trim() + '\n\n';
        skill=skill.replace(/\s+Developer/ig,'').replace(/\s+/g,'-').trim();
        fs.appendFileSync(`./DynamicPages/SAP/${skill}.txt`,data);
        resolve('Data is successfully fetched using openai');
      }catch(err){
        reject('Error in fetching data using openai');
      }
    })
}

module.exports={skill};




