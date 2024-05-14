const axios=require("axios");
const clientId = '1000.S8V3LYRB2V3XD7HYM0A3CMNE1GMVJQ';
const clientSecret = 'c2f857f68c41176f93ff59eb51771a3223811e0b72';
const refreshtoken = '1000.50c452dd1039d358398b44cbd90836ac.a72ad80cde73e1e390c5c3910b9a5c31';
const requestData={
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: 'https://skillscapital.io/',
    code:'1000.da8760817735834d07d1e53614aa924c.f29513521e2ccf8edc17231e4895880d'
};
console.log('A');
let getAuthToken=(async()=>{
    try{
        let resp=await axios.post('https://accounts.zoho.in/oauth/v2/token',null,{
            params:requestData
        });
        console.log(resp);
    }catch(err){
        console.log('Errrooorrrr',err);
    }
})();
// data: {
//     access_token: '1000.1b3d6ec856796e62af0935de53e7f0ab.72a153da0f2f93ce6e16824c48a43f66',
//     refresh_token: '1000.8f47f6574b3cc12ed8cb2bfbfe5f3c29.e68c6e7c7fe34140c57c9ee33a37f3d4',
//     scope: 'ZohoRecruit.modules.ALL',
//     api_domain: 'https://www.zohoapis.in',
//     token_type: 'Bearer',
//     expires_in: 3600
//   }