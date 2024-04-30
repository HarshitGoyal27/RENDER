let sortedCandidates=(candidates,obj,arr,ans)=>{
    try{
        let skillsDictionary=['TM','ABAP','FI','FICO','EWM','HANA','MM','SD','S4HANA','LBN','Node JS','Node-JS','NodeJS','JAVASCRIPT'];
        let priorityArray1=[];
        priorityArray1.push(obj.keyword);
        if(obj.primary_module){priorityArray1.push(obj.primary_module);}
        if(obj.secondary_module){priorityArray1.push(obj.secondary_module);}
        console.log(priorityArray1);
        let isPrimary=priorityArray1[1]?true:false;  
        let isSecondary=priorityArray1[2]?true:false;  
        if(!isPrimary){return candidates;}

        const primary_regex=new RegExp(`\\b${priorityArray1[1]}\\b`,'i');
        const secondary_regex=priorityArray1[2]?new RegExp(`\\b${priorityArray1[2]}\\b`,'i'):null;


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
                console.log('SECONDARY INDEX IS NULL');
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

        let checkForotherSkills=(arr,reg_ex)=>{
            //ASSUMING HERE IT IS PRIMARY SKILL ALRREADY PRESENT
            let s=arr.join(" ");
            for(let i=0;i<skillsDictionary.length;i++){
                let skill=skillsDictionary[i];
                let skill_regex=new RegExp(`\\b${skill}\\b`,'i');
                if(reg_ex.test(skill)){}
                else if(skill_regex.test(s)){
                    return true;
                }
            }
            return false;
        }

        let checkPriority=(a,b,str)=>{
            //CURRENT ROLE
            let cr_1 = a.CurrentRole?a.CurrentRole:'';
            let cr_1_arr=cr_1.length<=0?[]:cr_1.split(" ");
            let cr_1_idx=-1;
            cr_1_arr.forEach((ele,idx)=>{
                if(primary_regex.test(ele)){
                    cr_1_idx=idx;
                }
            });

            let cr_2 = b.CurrentRole?b.CurrentRole:'';
            let cr_2_arr=cr_2.length>0?cr_2.split(" "):[];
            let cr_2_idx=-1;
            cr_2_arr.forEach((ele,idx)=>{
                if(primary_regex.test(ele)){
                    cr_2_idx=idx;
                }
            });

            //PREVIOUS ROLE

            let pr_1 = a.PreviousRole?a.PreviousRole:'';
            let pr_1_arr=pr_1.length>0?pr_1.split(" "):[];
            let pr_1_idx=-1;
            pr_1_arr.forEach((ele,idx)=>{
                if(primary_regex.test(ele)){
                    pr_1_idx=idx;
                }
            });

            let pr_2 = b.PreviousRole?b.PreviousRole:'';
            let pr_2_arr=pr_2.length>0 ?pr_2.split(" "):[];
            let pr_2_idx=-1;
            pr_2_arr.forEach((ele,idx)=>{
                if(primary_regex.test(ele)){
                    pr_2_idx=idx;
                }
            });

            //CANDIDATE PROFILE

            let cp_1=a.CandidateProfile?a.CandidateProfile:'';
            let cp_1_arr=cp_1.length>0?cp_1.split(" "):[];
            let cp_1_idx=-1;
            for (let idx = 0; idx < cp_1_arr.length; idx++) {
                const ele = cp_1_arr[idx];
                if (primary_regex.test(ele)) {
                    cp_1_idx = idx;
                    break; // Exit the loop if the condition is met
                }
            }


            let cp_2=b.CandidateProfile?b.CandidateProfile:'';
            let cp_2_arr=cp_2.length>0?cp_2.split(" "):[];
            let cp_2_idx=-1;
            for (let idx = 0; idx < cp_2_arr.length; idx++) {
                const ele = cp_2_arr[idx];
                if (primary_regex.test(ele)) {
                    cp_2_idx = idx;
                    break; // Exit the loop if the condition is met
                }
            }
            
            //KEY SKILLS

            let ks_1 = a.Skills.split(",");
            let ks_2 = b.Skills.split(",");

            let idx_primary_1=findIdx1(ks_1,primary_regex);
            let idx_primary_2=findIdx1(ks_2,primary_regex);

            let idx_secondary_1=findIdx1(ks_1,secondary_regex);
            let idx_secondary_2=findIdx1(ks_2,secondary_regex);

            if(isSecondary){

                //CURRENT ROLE

                if(cr_1_idx!=-1 && cr_2_idx!=-1){
                    //check for lower index of current role
                    let diffSkill_cr_1=checkForotherSkills(cr_1_arr,primary_regex);
                    let diffSkill_cr_2=checkForotherSkills(cr_2_arr,primary_regex);
                    if(cr_1_idx < cr_2_idx){
                        //check for other skills
                        if(diffSkill_cr_2===false && diffSkill_cr_1===true){
                            return false;
                        }
                        else{
                            return true;
                        }
                        //return true;
                    }else if(cr_1_idx > cr_2_idx){
                        if(diffSkill_cr_2===true && diffSkill_cr_1===false){
                            return true;
                        }
                        else{
                            return false;
                        }   
                        //return false;
                    }
                    else{
                        //check for previous role
                        if(pr_1_idx !=-1 &&  pr_2_idx!=-1){
                            if(pr_1_idx < pr_2_idx){
                                return true;
                            }else if(pr_1_idx > pr_2_idx){
                                return false;
                            }else{
                                //compare candidate profile
                                if(cp_1_idx !=-1 && cp_2_idx!=-1){
                                    if(cp_1_idx < cp_2_idx)return true;
                                    else if(cp_1_idx > cp_2_idx)return false;
                                    else{
                                        //compare key skills
                                        if(idx_primary_1 < idx_primary_2)return true;
                                        else if(idx_primary_1 > idx_primary_2)return false;
                                        else{
                                            if(idx_secondary_1 < idx_secondary_2)return true;
                                            else if(idx_secondary_1 > idx_secondary_2)return false;
                                            else return false;
                                        }
                                    }
                                }
                                else if(cp_1_idx!=-1){
                                    return true;
                                }
                                else if(cp_2_idx!=-1){
                                    return false;
                                }
                                else{
                                    //check for key skills
                                    if(idx_primary_1 < idx_primary_2)return true;
                                    else if(idx_primary_1 > idx_primary_2)return false;
                                    else{
                                        if(idx_secondary_1 < idx_secondary_2)return true;
                                        else if(idx_secondary_1 > idx_secondary_2)return false;
                                        else return false;
                                    }
    
                                }
                            }
                        }
                        else if(pr_1_idx!=-1){
                            return true;
                        }
                        else if(pr_2_idx!=-1){
                            return false;
                        }
                        else{
                            //check for candidate profile
                            if(cp_1_idx !=-1 && cp_2_idx!=-1){
                                if(cp_1_idx < cp_2_idx)return true;
                                else if(cp_1_idx > cp_2_idx)return false;
                                else{
                                    //compare key skills
                                    if(idx_primary_1 < idx_primary_2)return true;
                                    else if(idx_primary_1 > idx_primary_2)return false;
                                    else{
                                        if(idx_secondary_1 < idx_secondary_2)return true;
                                        else if(idx_secondary_1 > idx_secondary_2)return false;
                                        else return false;
                                    }
                                }
                            }
                            else if(cp_1_idx!=-1){
                                return true;
                            }
                            else if(cp_2_idx!=-1){
                                return false;
                            }
                            else{
                                //check for key skills
                                if(idx_primary_1 < idx_primary_2)return true;
                                else if(idx_primary_1 > idx_primary_2)return false;
                                else{
                                    if(idx_secondary_1 < idx_secondary_2)return true;
                                    else if(idx_secondary_1 > idx_secondary_2)return false;
                                    else return false;
                                }

                            }
                        }

                    }
                }
                else if(cr_1_idx!=-1){
                    return true;
                }
                else if(cr_2_idx!=-1){
                    return false;
                }

                //PREVIOUS ROLE

                else if(pr_1_idx !=-1 &&  pr_2_idx!=-1){
                    if(pr_1_idx < pr_2_idx){
                        return true;
                    }else if(pr_1_idx > pr_2_idx){
                        return false;
                    }else{
                        //compare candidate profile
                        if(cp_1_idx !=-1 && cp_2_idx!=-1){
                            if(cp_1_idx < cp_2_idx)return true;
                            else if(cp_1_idx > cp_2_idx)return false;
                            else{
                                //compare key skills
                                if(idx_primary_1 < idx_primary_2)return true;
                                else if(idx_primary_1 > idx_primary_2)return false;
                                else{
                                    if(idx_secondary_1 < idx_secondary_2)return true;
                                    else if(idx_secondary_1 > idx_secondary_2)return false;
                                    else return false;
                                }
                            }
                        }
                        else if(cp_1_idx!=-1){
                            return true;
                        }
                        else if(cp_2_idx!=-1){
                            return false;
                        }
                        else{
                            //check for key skills
                            if(idx_primary_1 < idx_primary_2)return true;
                            else if(idx_primary_1 > idx_primary_2)return false;
                            else{
                                if(idx_secondary_1 < idx_secondary_2)return true;
                                else if(idx_secondary_1 > idx_secondary_2)return false;
                                else return false;
                            }

                        }
                    }
                }
                else if(pr_1_idx!=-1){
                    return true;
                }
                else if(pr_2_idx!=-1){
                    return false;
                }

                //CANDIDATE PROFILE

                else if(cp_1_idx!=-1 && cp_2_idx!=-1){
                    if(cp_1_idx < cp_2_idx)return true;
                    else if(cp_1_idx > cp_2_idx)return false;
                    else{
                        //check for key skills
                        if(idx_primary_1 < idx_primary_2)return true;
                        else if(idx_primary_1 > idx_primary_2)return false;
                        else{
                            if(idx_secondary_1 < idx_secondary_2)return true;
                            else if(idx_secondary_1 > idx_secondary_2)return false;
                            else return false;
                        }
                    }
                }
                else if(cp_1_idx!=-1){
                    return true;
                }
                else if(cp_2_idx!=-1){
                    return false;
                }

                //KEY SKILLS
                
                else if(idx_primary_1!=-1 && idx_primary_2!=-1){
                    if(idx_primary_1 < idx_primary_2){
                        return true;
                    }else if(idx_primary_1 > idx_primary_2){
                        return false;
                    }
                    else{
                        //check for secondary skills
                        if(idx_secondary_1!=-1 && idx_secondary_2!=-1){
                            if(idx_secondary_1 < idx_secondary_2)return true;
                            else return false;
                        }else if(idx_secondary_1!=-1)return true;
                        else return false;
                    }
                }
                else if(idx_primary_1!=-1)return true;
                else return false;

            }
            //ELSE BLOCK STARTS WITH NO SECONDARY
            else{

                //CURRENT ROLE

                if(cr_1_idx!=-1 && cr_2_idx!=-1){
                    //check for lower index of current role
                    let diffSkill_cr_1=checkForotherSkills(cr_1_arr,primary_regex);
                    let diffSkill_cr_2=checkForotherSkills(cr_2_arr,primary_regex);
                    if(cr_1_idx < cr_2_idx){
                        //check for other skills
                        if(diffSkill_cr_2===false && diffSkill_cr_1===true){
                            return false;
                        }
                        else{
                            return true;
                        }
                        //return true;
                    }else if(cr_1_idx > cr_2_idx){
                        if(diffSkill_cr_2===true && diffSkill_cr_1===false){
                            return true;
                        }
                        else{
                            return false;
                        }   
                        //return false;
                    }
                    else{
                        //check for previous role
                        if(pr_1_idx !=-1 &&  pr_2_idx!=-1){
                            if(pr_1_idx < pr_2_idx){
                                return true;
                            }else if(pr_1_idx > pr_2_idx){
                                return false;
                            }else{
                                //compare candidate profile
                                if(cp_1_idx !=-1 && cp_2_idx!=-1){
                                    if(cp_1_idx < cp_2_idx)return true;
                                    else if(cp_1_idx > cp_2_idx)return false;
                                    else{
                                        //compare key skills
                                        if(idx_primary_1 < idx_primary_2)return true;
                                        else if(idx_primary_1 > idx_primary_2)return false;
                                        else{
                                            return false;
                                        }
                                    }
                                }
                                else if(cp_1_idx!=-1){
                                    return true;
                                }
                                else if(cp_2_idx!=-1){
                                    return false;
                                }
                                else{
                                    //check for key skills
                                    if(idx_primary_1 < idx_primary_2)return true;
                                    else if(idx_primary_1 > idx_primary_2)return false;
                                    else{
                                        if(idx_secondary_1 < idx_secondary_2)return true;
                                        else if(idx_secondary_1 > idx_secondary_2)return false;
                                        else return false;
                                    }
    
                                }
                            }
                        }
                        else if(pr_1_idx!=-1){
                            return true;
                        }
                        else if(pr_2_idx!=-1){
                            return false;
                        }
                        else{
                            //check for candidate profile
                            if(cp_1_idx !=-1 && cp_2_idx!=-1){
                                if(cp_1_idx < cp_2_idx)return true;
                                else if(cp_1_idx > cp_2_idx)return false;
                                else{
                                    //compare key skills
                                    if(idx_primary_1 < idx_primary_2)return true;
                                    else if(idx_primary_1 > idx_primary_2)return false;
                                    else{
                                        return false;
                                    }
                                }
                            }
                            else if(cp_1_idx!=-1){
                                return true;
                            }
                            else if(cp_2_idx!=-1){
                                return false;
                            }
                            else{
                                //check for key skills
                                if(idx_primary_1 < idx_primary_2)return true;
                                else if(idx_primary_1 > idx_primary_2)return false;
                                else{
                                    if(idx_secondary_1 < idx_secondary_2)return true;
                                    else if(idx_secondary_1 > idx_secondary_2)return false;
                                    else return false;
                                }

                            }
                        }

                    }
                }
                else if(cr_1_idx!=-1){
                    return true;
                }
                else if(cr_2_idx!=-1){
                    return false;
                }

                //PREVIOUS ROLE

                else if(pr_1_idx !=-1 &&  pr_2_idx!=-1){
                    if(pr_1_idx < pr_2_idx){
                        return true;
                    }else if(pr_1_idx > pr_2_idx){
                        return false;
                    }else{
                        //compare candidate profile
                        if(cp_1_idx !=-1 && cp_2_idx!=-1){
                            if(cp_1_idx < cp_2_idx)return true;
                            else if(cp_1_idx > cp_2_idx)return false;
                            else{
                                //compare key skills
                                if(idx_primary_1 < idx_primary_2)return true;
                                else if(idx_primary_1 > idx_primary_2)return false;
                                else{
                                    return false;
                                }
                            }
                        }
                        else if(cp_1_idx!=-1){
                            return true;
                        }
                        else if(cp_2_idx!=-1){
                            return false;
                        }
                        else{
                            //check for key skills
                            if(idx_primary_1 < idx_primary_2)return true;
                            else if(idx_primary_1 > idx_primary_2)return false;
                            else{
                                return false;
                            }

                        }
                    }
                }
                else if(pr_1_idx!=-1){
                    return true;
                }
                else if(pr_2_idx!=-1){
                    return false;
                }

                //CANDIDATE PROFILE

                else if(cp_1_idx!=-1 && cp_2_idx!=-1){
                    if(cp_1_idx < cp_2_idx)return true;
                    else if(cp_1_idx > cp_2_idx)return false;
                    else{
                        //check for key skills
                        if(idx_primary_1 < idx_primary_2)return true;
                        else if(idx_primary_1 > idx_primary_2)return false;
                        else{
                            return false;
                        }
                    }
                }
                else if(cp_1_idx!=-1){
                    return true;
                }
                else if(cp_2_idx!=-1){
                    return false;
                }

                //KEY SKILLS
                
                else if(idx_primary_1!=-1 && idx_primary_2!=-1){
                    if(idx_primary_1 < idx_primary_2){
                        return true;
                    }else if(idx_primary_1 > idx_primary_2){
                        return false;
                    }
                    else{
                        return false;
                    }
                }
                else if(idx_primary_1!=-1)return true;
                else return false;
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