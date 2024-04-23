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
const skill2=(skill)=>{
    return new Promise(async(resolve,reject)=>{
      const job_advertisement=`write ${skill} TRANSFORMATION CONSULTING CAPABILITIES in 3 points \n`
      const arr=[job_advertisement];
      const str=arr.join('');
      options.data.text=`${str}`;
      try{
        const response=await axios.request(options);
        let data=response.data.google.generated_text.replace(/\*/g, '').replace(/:/g, '').trim() + '\n\n';
        const regex = /^\d+\.\s*(.*)$/gm;
        data=data.match(regex);
        resolve(data);
      }catch(err){
        reject('Error in fetching data using openai');
      }
    })
}

module.exports={skill2};




