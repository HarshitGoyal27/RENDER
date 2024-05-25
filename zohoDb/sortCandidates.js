const e = require("express");
const { head } = require("request");

let sortedCandidates=(candidates,arr,ans,skillsArr)=>{
    try{
        let skillsDictionary=['TM','ABAP','FI','FICO','EWM','HANA','MM','SD','S4HANA','LBN','Node JS','Node-JS','NodeJS','JAVASCRIPT','ERP','BW','BI','LE','GTS','BRIM','BTP'];
    
        let add=(ele)=>{
            arr.push(ele);
            upheapify(arr.length-1);
        }

        let remove=()=>{
            swap(0,arr.length-1);
            let data=arr.pop();
            downheapify(0);
            return data;
        }

        let upheapify=(i)=>{
            if(i===0){
                return;
            }
            let pi = Math.floor((i - 1) / 2);
            if(checkPriority(arr[i],arr[pi],'UP')){
                swap(i,pi);
                upheapify(pi);
            }
            
        }

        let downheapify=(pi)=>{
            let mini=pi;
            let li=2*pi+1;
            if(li<arr.length && checkPriority(arr[li],arr[mini],'DO1')){
                mini=li;
            }
            let ri=2*pi+2;
            if(ri<arr.length && checkPriority(arr[ri],arr[mini],'DO2')){
                mini=ri;
            }
            if(mini!=pi){
                swap(pi,mini);
                downheapify(mini);
            }
        }

        // let CheckDiffSkills=(str1,str2)=>{
            
        // }

        let CountSkills=(str1,str2)=>{
            //ONLY CHECK 
        }

        let checkPriority=(a,b)=>{
            //CURRENT ROLE
            let cr_1=a.CurrentRole?a.CurrentRole:"";
            let cr_2=b.CurrentRole?b.CurrentRole:"";
            //PREVIOUS ROLE
            let pr_1=a.PreviousRole?a.PreviousRole:"";
            let pr_2=b.PreviousRole?b.PreviousRole:"";
            //CANDIDATE PROFILE
            let cp_1=a.CandidateProfile?a.CandidateProfile:"";
            let cp_2=b.CandidateProfile?b.CandidateProfile:"";
            //TECHNICAL SKILLS
            let ts_1=a.Skills?a.Skills:"";
            let ts_2=b.Skills?b.Skills:"";

            // let currentRole_any_other_skill=CheckDiffSkills(cr_1,cr_2);
            // let previousRole_any_other_skill=CheckDiffSkills(pr_1,pr_2);
            // let candidateProfile_any_other_skill=CheckDiffSkills(cp_1,cp_2);\

            





        }

        let swap=(a,b)=>{
            let temp=arr[a];
            arr[a]=arr[b];
            arr[b]=temp;
        }

        for(let i=0;i<candidates.length;i++){
            add(candidates[i]);
        }

        for(let i=0;i<candidates.length;i++){
            ans.push(remove());
        }

        return ans;

    }catch(err){
        console.log(err);
    }
}

module.exports={sortedCandidates};