const e = require("express");
const { head } = require("request");

let sortedCandidates=(candidates,obj,arr,ans)=>{
    try{
        let skillsDictionary=['TM','ABAP','FI','FICO','EWM','HANA','MM','SD','S4HANA','LBN','Node JS','Node-JS','NodeJS','JAVASCRIPT','ERP','BW','BI','LE','GTS','BRIM','BTP'];
        let priorityArray1=[];
        priorityArray1.push(obj.keyword);
        if(obj.primary_module){priorityArray1.push(obj.primary_module);}
        if(obj.secondary_module){priorityArray1.push(obj.secondary_module);}
        console.log("Priority Array",priorityArray1);
        let isPrimary=priorityArray1[1]?true:false;  
        let isSecondary=priorityArray1[2]?true:false;  
        if(!isPrimary){return candidates;}

        const primary_regex=new RegExp(`\\b${priorityArray1[1]}\\b`,'i');
        const secondary_regex=priorityArray1[2]?new RegExp(`\\b${priorityArray1[2]}\\b`,'i'):null;
        console.log(primary_regex,secondary_regex);


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

        let findIdx1=(ks,reg_ex)=>{
            if(reg_ex===null){
                return -1;
            }
            for(let i=0;i<ks.length;i++){
                let str=ks[i].trim();
                if(reg_ex.test(str)){
                    return i;
                }      
            } 
            return -1;
        }

        const checkForotherSkills1=(str,regex_all)=>{
            //ASSUMING HERE IT IS REG EX SKILL IS PRESENT
            let primary=false,secondary=false;
            for(let i=0;i<skillsDictionary.length;i++){
                let skill=skillsDictionary[i];
                let skill_regex=new RegExp(`\\b${skill}\\b`,'i');
                //skip primary or secondary skill
                if(regex_all.test(skill)){
                    continue;
                }
                if(skill_regex.test(str)){
                    return true;
                }
            }            
            return false;
        }


        const checkForotherSkills2=(str,primary_regex,secondary_regex)=>{
            //ASSUMING HERE IT IS PRIMARY SKILL AND SECONDARY SKILL ALREAD PRESENT
            let primary=false,secondary=false;
            for(let i=0;i<skillsDictionary.length;i++){
                let skill=skillsDictionary[i];
                let skill_regex=new RegExp(`\\b${skill}\\b`,'i');
                //skip primary and secondary skill
                if(primary_regex.test(skill) || secondary_regex.test(skill)){
                    continue;
                }
                if(skill_regex.test(str)){
                    return true;
                }
            }            
            return false;
        }


        let checkPriority=(a,b,str)=>{

            //CURRENT ROLE

            let cr_1 = a.CurrentRole?a.CurrentRole:'';
            let cr_1_arr=cr_1.length<=0?[]:cr_1.split(" ");
            let cr_1_idx_prim=-1;
            let cr_1_idx_sec=-1;
            cr_1_arr.forEach((ele,idx)=>{
                if(primary_regex && primary_regex.test(ele)){
                    cr_1_idx_prim=idx;
                }
                if(secondary_regex && secondary_regex.test(ele)){
                    cr_1_idx_sec=idx;
                }
            });

            let cr_2 = b.CurrentRole?b.CurrentRole:'';
            let cr_2_arr=cr_2.length>0?cr_2.split(" "):[];
            let cr_2_idx_prim=-1;
            let cr_2_idx_sec=-1;
            cr_2_arr.forEach((ele,idx)=>{
                if(primary_regex && primary_regex.test(ele)){
                    cr_2_idx_prim=idx;
                }
                if(secondary_regex && secondary_regex.test(ele)){
                    cr_2_idx_sec=idx;
                }
            });

            //PREVIOUS ROLE

            let pr_1 = a.PreviousRole?a.PreviousRole:'';
            let pr_1_arr=pr_1.length>0?pr_1.split(" "):[];
            let pr_1_idx_prim=-1;
            let pr_1_idx_sec=-1;
            pr_1_arr.forEach((ele,idx)=>{
                if(primary_regex && primary_regex.test(ele)){
                    pr_1_idx_prim=idx;
                }
                if(secondary_regex && secondary_regex.test(ele)){
                    pr_1_idx_sec=idx;
                }
            });

            let pr_2 = b.PreviousRole?b.PreviousRole:'';
            let pr_2_arr=pr_2.length>0 ?pr_2.split(" "):[];
            let pr_2_idx_prim=-1;
            let pr_2_idx_sec=-1;
            pr_2_arr.forEach((ele,idx)=>{
                if(primary_regex && primary_regex.test(ele)){
                    pr_2_idx_prim=idx;
                }
                if(secondary_regex && secondary_regex.test(ele)){
                    pr_2_idx_sec=idx;
                }
            });

            //CANDIDATE PROFILE

            let cp_1=a.CandidateProfile?a.CandidateProfile:'';
            let cp_1_arr=cp_1.length>0?cp_1.split(" "):[];
            let cp_1_idx_prim=99999;
            let cp_1_idx_sec=99999;
            for (let idx = 0; idx < cp_1_arr.length; idx++) {
                const ele = cp_1_arr[idx];
                if (primary_regex && primary_regex.test(ele)) {
                    cp_1_idx_prim = Math.min(idx,cp_1_idx_prim);   
                }
                if (secondary_regex && secondary_regex.test(ele)) {
                    cp_1_idx_sec = Math.min(idx,cp_1_idx_sec);   
                }
            }
            cp_1_idx_prim=(cp_1_idx_prim===99999)?-1:cp_1_idx_prim;
            cp_1_idx_sec=(cp_1_idx_sec===99999)?-1:cp_1_idx_sec;


            let cp_2=b.CandidateProfile?b.CandidateProfile:'';
            let cp_2_arr=cp_2.length>0?cp_2.split(" "):[];
            let cp_2_idx_prim=99999;
            let cp_2_idx_sec=99999;
            for (let idx = 0; idx < cp_2_arr.length; idx++) {
                const ele = cp_2_arr[idx];
                if (primary_regex && primary_regex.test(ele)) {
                    cp_2_idx_prim = Math.min(idx,cp_2_idx_prim);
                }
                if (secondary_regex && secondary_regex.test(ele)) {
                    cp_2_idx_sec = Math.min(idx,cp_2_idx_sec);   
                }
            }
            cp_2_idx_prim=(cp_2_idx_prim===99999)?-1:cp_2_idx_prim;
            cp_2_idx_sec=(cp_2_idx_sec===99999)?-1:cp_2_idx_sec;
            
            //KEY SKILLS

            let ks_1 = a.Skills.split(",");
            let ks_2 = b.Skills.split(",");

            let idx_primary_1=findIdx1(ks_1,primary_regex);
            let idx_primary_2=findIdx1(ks_2,primary_regex);

            let idx_secondary_1=findIdx1(ks_1,secondary_regex);
            let idx_secondary_2=findIdx1(ks_2,secondary_regex);

            const cr_1_prim_diffSkill=checkForotherSkills1(cr_1,primary_regex);
            const cr_2_prim_diffSkill=checkForotherSkills1(cr_2,primary_regex);
            const cr_1_sec_diffSkill=checkForotherSkills1(cr_1,secondary_regex);
            const cr_2_sec_diffSkill=checkForotherSkills1(cr_2,secondary_regex);

            const pr_1_prim_diffSkill=checkForotherSkills1(pr_1,primary_regex);
            const pr_2_prim_diffSkill=checkForotherSkills1(pr_2,primary_regex);
            const pr_1_sec_diffSkill=checkForotherSkills1(pr_1,secondary_regex);
            const pr_2_sec_diffSkill=checkForotherSkills1(pr_2,secondary_regex);

            const cp_1_prim_diffSkill=checkForotherSkills1(cp_1,primary_regex);
            const cp_2_prim_diffSkill=checkForotherSkills1(cp_2,primary_regex);
            const cp_1_sec_diffSkill=checkForotherSkills1(cp_1,secondary_regex);
            const cp_2_sec_diffSkill=checkForotherSkills1(cp_2,secondary_regex);

            const diffSkill_prim_sec_cr1=checkForotherSkills2(cr_1,primary_regex,secondary_regex);
            const diffSkill_prim_sec_cr2=checkForotherSkills2(cr_2,primary_regex,secondary_regex);

            const diffSkill_prim_sec_pr1=checkForotherSkills2(pr_1,primary_regex,secondary_regex);
            const diffSkill_prim_sec_pr2=checkForotherSkills2(pr_2,primary_regex,secondary_regex);

            const keySkills=()=>{
                if(idx_primary_1!=-1 && idx_primary_2!=-1){
                    if(idx_secondary_1!=-1 && idx_secondary_2!=-1){
                        if((idx_primary_1 < idx_secondary_1) && (idx_primary_2 < idx_secondary_2)){
                            if(idx_primary_1 < idx_primary_2){return true;}
                            else return false;
                        }
                        else if((idx_primary_1 < idx_secondary_1) && (idx_primary_2 > idx_secondary_2)){
                            return true;
                        }
                        else if((idx_primary_1 > idx_secondary_1) && (idx_primary_2 < idx_secondary_2)){
                            return false;
                        }else{
                            if(idx_primary_1 < idx_primary_2){
                                return true;
                            }else return false;
                        }
                    }
                    else if(idx_secondary_1!=-1){
                       return true;
                    }
                    else if(idx_secondary_2!=-1){
                        return false;
                    }
                    else{ 
                        if(idx_primary_1 < idx_primary_2)return true;
                        else return false;
                    }
                }
                else if(idx_primary_1!=-1){
                    return true;
                }
                else if(idx_primary_2!=-1){
                    return false;
                }else{
                    if(idx_secondary_1!=-1 && idx_secondary_2!=-1){
                        if(idx_secondary_1 < idx_secondary_2){return true;}
                        else return false;
                    }
                    else if(idx_secondary_1!=-1){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            }

            const headline=()=>{
                if(cp_1_idx_prim!=-1 && cp_2_idx_prim!=-1){
                    if(cp_1_idx_sec!=-1 && cp_2_idx_sec!=-1){
                        if((cp_1_idx_prim < cp_1_idx_sec) && (cp_2_idx_prim < cp_2_idx_sec)){
                            if((cp_1_idx_prim < cp_2_idx_prim) && keySkills()){return true;}
                            else if((cp_1_idx_prim > cp_2_idx_prim) && keySkills()){return false;}
                            else{
                                if((cp_1_idx_prim < cp_2_idx_prim)){return true;}
                                else if((cp_1_idx_prim > cp_2_idx_prim)){return false;}
                                else return keySkills();
                            }
                        }
                        else if((cp_1_idx_prim < cp_1_idx_sec) && (cp_2_idx_prim > cp_2_idx_sec)){return true;}
                        else if((cp_1_idx_prim > cp_1_idx_sec) && (cp_2_idx_prim < cp_2_idx_sec)){return false;}
                        else return false;
                    }
                    else if(cp_1_idx_sec!=-1){
                        return true;
                    }
                    else if(cp_2_idx_sec!=-1){
                        return false;
                    }
                    else{
                        if((cp_1_idx_prim < cp_2_idx_prim) && keySkills()){return true;}
                        else if((cp_1_idx_prim > cp_2_idx_prim) && keySkills()){return false;}
                        else{
                            if((cp_1_idx_prim < cp_2_idx_prim)){return true;}
                            else if((cp_1_idx_prim > cp_2_idx_prim)){return false;}
                            else return keySkills();
                        }
                    }
                }
                else if(cp_1_idx_prim!=-1){return true;}
                else if(cp_2_idx_prim!=-1){return false;}
                else{
                    if(cp_1_idx_sec!=-1 && cp_2_idx_sec!=-1){
                        if((cp_1_idx_sec < cp_2_idx_sec) && keySkills()){return true;}
                        else if((cp_1_idx_sec > cp_2_idx_sec) && keySkills()){return false;}
                        else{
                            return keySkills();
                        }
                    }
                    else if(cp_1_idx_sec!=-1){
                        return true;
                    }
                    else if(cp_2_idx_sec!=-1){
                        return false;
                    }else{
                        return keySkills();
                    }
                }
            }

            const prev=()=>{
                if(pr_1_idx_prim!=-1 && pr_2_idx_prim!=-1){
                    if(pr_1_idx_sec!=-1 && pr_2_idx_sec!=-1){
                        if(diffSkill_prim_sec_pr1===false && diffSkill_prim_sec_pr2===false){
                            //BEST CASE
                            if((pr_1_idx_sec > pr_1_idx_prim) && (pr_2_idx_sec > pr_2_idx_prim)){
                                if((pr_1_idx_prim < pr_2_idx_prim) && headline())return true;   
                                else if((pr_1_idx_prim > pr_2_idx_prim) && headline())return false;
                                else{
                                    if(pr_1_idx_prim < pr_2_idx_prim)return true;
                                    else if(pr_1_idx_prim > pr_2_idx_prim)return false;
                                    else return headline();
                                }
                            }
                            else if((pr_1_idx_sec > pr_1_idx_prim) && (pr_2_idx_sec < pr_2_idx_prim)){
                                return true;
                            }
                            else if((pr_1_idx_sec < pr_1_idx_prim) && (pr_2_idx_sec > pr_2_idx_prim)){
                                return false;
                            }
                            else{
                                if((pr_1_idx_prim < pr_2_idx_prim) && headline())return true;   
                                else if((pr_1_idx_prim > pr_2_idx_prim) && headline())return false;
                                else{
                                    if(pr_1_idx_prim < pr_2_idx_prim)return true;
                                    else if(pr_1_idx_prim > pr_2_idx_prim)return false;
                                    else return headline();
                                }
                            }
                        }
                        else if(diffSkill_prim_sec_pr1===true && diffSkill_prim_sec_pr2===false){return false;}
                        else if(diffSkill_prim_sec_pr1===false && diffSkill_prim_sec_pr2===true){return true;}
                        else{
                            if((pr_1_idx_sec > pr_1_idx_prim) && (pr_2_idx_sec > pr_2_idx_prim)){
                                if((pr_1_idx_prim < pr_2_idx_prim) && headline())return true;   
                                else if((pr_1_idx_prim > pr_2_idx_prim) && headline())return false;
                                else{
                                    if(pr_1_idx_prim < pr_2_idx_prim)return true;
                                    else if(pr_1_idx_prim > pr_2_idx_prim)return false;
                                    else return headline();
                                }
                            }
                            else if((pr_1_idx_sec > pr_1_idx_prim) && (pr_2_idx_sec < pr_2_idx_prim)){
                                return true;
                            }
                            else if((pr_1_idx_sec < pr_1_idx_prim) && (pr_2_idx_sec > pr_2_idx_prim)){
                                return false;
                            }
                            else{
                                if((pr_1_idx_prim < pr_2_idx_prim) && headline())return true;   
                                else if((pr_1_idx_prim > pr_2_idx_prim) && headline())return false;
                                else{
                                    if(pr_1_idx_prim < pr_2_idx_prim)return true;
                                    else if(pr_1_idx_prim > pr_2_idx_prim)return false;
                                    else return headline();
                                }
                            }
                        }
                    }
                    else if(pr_1_idx_sec!=-1){
                        return true;
                    }
                    else if(pr_2_idx_sec!=-1){
                        return false;
                    }
                    else{
                        //check for different primary skill
                        if(pr_1_prim_diffSkill===false && pr_2_prim_diffSkill===false){
                            if((pr_1_idx_prim < pr_2_idx_prim) && headline())return true;   
                            else if((pr_1_idx_prim > pr_2_idx_prim) && headline())return false;
                            else{
                                if(pr_1_idx_prim < pr_2_idx_prim)return true;
                                else if(pr_1_idx_prim > pr_2_idx_prim)return false;
                                else return headline();
                            }
                        }
                        else if(pr_1_prim_diffSkill===true && pr_2_prim_diffSkill===false){
                            return false;
                        }
                        else if(pr_1_prim_diffSkill===false && pr_2_prim_diffSkill===false){
                            return true;
                        }
                        else{
                            if((pr_1_idx_prim < pr_2_idx_prim) && headline())return true;   
                            else if((pr_1_idx_prim > pr_2_idx_prim) && headline())return false;
                            else{
                                if(pr_1_idx_prim < pr_2_idx_prim)return true;
                                else if(pr_1_idx_prim > pr_2_idx_prim)return false;
                                else return headline();
                            }
                        }
                    }
                }

                else if(pr_1_idx_prim!=-1){
                    return true;
                }

                else if(pr_2_idx_prim!=-1){
                    return false;
                }
                else{
                    if((pr_1_idx_sec > pr_1_idx_prim) && (pr_2_idx_sec > pr_2_idx_prim)){
                        if((pr_1_idx_prim < pr_2_idx_prim) && headline())return true;   
                        else if((pr_1_idx_prim > pr_2_idx_prim) && headline())return false;
                        else{
                            if(pr_1_idx_prim < pr_2_idx_prim)return true;
                            else if(pr_1_idx_prim > pr_2_idx_prim)return false;
                            else return headline();
                        }
                    }
                    else if((pr_1_idx_sec > pr_1_idx_prim) && (pr_2_idx_sec < pr_2_idx_prim)){
                        return true;
                    }
                    else if((pr_1_idx_sec < pr_1_idx_prim) && (pr_2_idx_sec > pr_2_idx_prim)){
                        return false;
                    }
                    else{
                        if((pr_1_idx_prim < pr_2_idx_prim) && headline())return true;   
                        else if((pr_1_idx_prim > pr_2_idx_prim) && headline())return false;
                        else{
                            if(pr_1_idx_prim < pr_2_idx_prim)return true;
                            else if(pr_1_idx_prim > pr_2_idx_prim)return false;
                            else return headline();
                        }
                    }
                }
            }

            if(isSecondary){

                if(cr_1_idx_prim!=-1 && cr_2_idx_prim!=-1){
                    if(cr_1_idx_sec!=-1 && cr_2_idx_sec!=-1){
                        //first check for any other skill and then for the index
                        //BEST CASE
                        if(diffSkill_prim_sec_cr1===false && diffSkill_prim_sec_cr2===false){
                            if((cr_1_idx_sec > cr_1_idx_prim) && (cr_2_idx_sec > cr_2_idx_prim)){
                                if((cr_1_idx_prim < cr_2_idx_prim) && prev())return true;   
                                else if((cr_1_idx_prim > cr_2_idx_prim) && prev())return false;
                                else{
                                    if(cr_1_idx_prim < cr_2_idx_prim)return true;
                                    else if(cr_1_idx_prim > cr_2_idx_prim)return false;
                                    else return prev();
                                }
                            }
                            else if((cr_1_idx_sec > cr_1_idx_prim) && (cr_2_idx_sec < cr_2_idx_prim)){
                                return true;
                            }
                            else if((cr_1_idx_sec < cr_1_idx_prim) && (cr_2_idx_sec > cr_2_idx_prim)){
                                return false;
                            }
                            else{
                                if((cr_1_idx_prim < cr_2_idx_prim) && prev())return true;   
                                else if((cr_1_idx_prim > cr_2_idx_prim) && prev())return false;
                                else{
                                    if(cr_1_idx_prim < cr_2_idx_prim)return true;
                                    else if(cr_1_idx_prim > cr_2_idx_prim)return false;
                                    else return prev();
                                }
                            }
                        }
                        else if(diffSkill_prim_sec_cr1===true && diffSkill_prim_sec_cr2===false){
                            return false;
                        }
                        else if(diffSkill_prim_sec_cr1===false && diffSkill_prim_sec_cr2===true){
                            return true;
                        }
                        //WORST CASE
                        else{
                            //means more skills other than primary and secondary are present
                            if((cr_1_idx_sec > cr_1_idx_prim) && (cr_2_idx_sec > cr_2_idx_prim)){
                                if(cr_1_idx_prim < cr_2_idx_prim){return true;}
                                else if(cr_1_idx_prim > cr_2_idx_prim){return false;}
                                else{
                                    if(cr_1_idx_sec < cr_2_idx_sec){return true;}
                                    else if(cr_1_idx_sec > cr_2_idx_sec){return false;}
                                    else{
                                        //check for previous role
                                        return prev();
                                    }
                                }
                            }
                            else if((cr_1_idx_sec > cr_1_idx_prim) && (cr_2_idx_sec < cr_2_idx_prim)){
                                return true;
                            }
                            else if((cr_1_idx_sec < cr_1_idx_prim) && (cr_2_idx_sec > cr_2_idx_prim)){
                                return false;
                            }
                            else{
                                if(cr_1_idx_prim < cr_2_idx_prim){return true;}
                                else if(cr_1_idx_prim > cr_2_idx_prim){return false;}
                                else{
                                    if(cr_1_idx_sec < cr_2_idx_sec){return true;}
                                    else if(cr_1_idx_sec > cr_2_idx_sec){return false;}
                                    else{
                                        //check for previous role
                                        return prev();
                                    }
                                }
                            }
                        }
                        
                    }
                    else if(cr_1_idx_sec!=-1){
                        return true;
                    }
                    else if(cr_2_idx_sec!=-1){
                        return false;
                    }
                    else{
                        //check for primary alone
                        if(cr_1_prim_diffSkill===false && cr_2_prim_diffSkill===false){
                            if((cr_1_idx_prim < cr_2_idx_prim) && prev())return true;   
                            else if((cr_1_idx_prim > cr_2_idx_prim) && prev())return false;
                            else{
                                if(cr_1_idx_prim < cr_2_idx_prim)return true;
                                else if(cr_1_idx_prim > cr_2_idx_prim)return false;
                                else return prev();
                            }
                        }
                        else if(cr_1_prim_diffSkill===true && cr_2_prim_diffSkill===false){
                            return false;
                        }
                        else if(cr_1_prim_diffSkill===false && cr_2_prim_diffSkill===false){
                            return true;
                        }
                        else{
                            if((cr_1_idx_prim < cr_2_idx_prim) && prev())return true;   
                            else if((cr_1_idx_prim > cr_2_idx_prim) && prev())return false;
                            else{
                                if(cr_1_idx_prim < cr_2_idx_prim)return true;
                                else if(cr_1_idx_prim > cr_2_idx_prim)return false;
                                else return prev();
                            }
                        }
                    }
                }
                
                else if(cr_1_idx_prim!=-1){
                    return true;
                }

                else if(cr_2_idx_prim!=-1){
                    return false;
                }

                else if(prev()){
                    return true;
                }
                else if(headline()){
                    return true;
                }
                else if(keySkills()){
                    return true;
                }
                else{
                    return false;
                }         

            }
            

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