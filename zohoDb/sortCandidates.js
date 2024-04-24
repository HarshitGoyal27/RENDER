let sortedCandidates=(candidates,obj)=>{
    try{
        let arr=[];
        let ans=[];
        let priorityArray1=[];
        priorityArray1.push(obj.keyword);
        if(obj.primary_module){priorityArray1.push(obj.primary_module);}
        if(obj.secondary_module){priorityArray1.push(obj.secondary_module);}
        console.log(priorityArray1);
        let isPrimary=priorityArray1[1]?true:false;  
        let isSecondary=priorityArray1[2]?true:false;  
        
        if(!isPrimary){return candidates;}

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
            if(li<arr.length && checkPriority(arr[li],arr[mini])){
                mini=li;
            }
            let ri=2*pi+2;
            if(ri<arr.length && checkPriority(arr[ri],arr[mini])){
                mini=ri;
            }
            if(mini!=pi){
                swap(pi,mini);
                downheapify(mini);
            }
        }

        let findIdx1=(ks,reg_ex)=>{
            for(let i=0;i<ks.length;i++){
                let str=ks[i].trim();
                if(reg_ex.test(str)){
                    return i;
                }      
            } 
            return 999999;
        }

        let checkPriority=(a,b,str)=>{
            let cr_1 = a.CurrentRole?a.CurrentRole:'';
            let cr_2 = b.CurrentRole?b.CurrentRole:'';
            let pr_1 = a.PreviousRole?a.PreviousRole:'';
            let pr_2 = b.PreviousRole?b.PreviousRole:'';
            let ks_1 = a.Skills.split(",");
            let ks_2 = b.Skills.split(",");
            let primary_regex=new RegExp(`\\b${priorityArray1[1]}\\b`,'i');
            let idx_primary_1=findIdx1(ks_1,primary_regex);
            let idx_primary_2=findIdx1(ks_2,primary_regex);
            if(isSecondary){
                let secondary_regex=new RegExp(`\\b${priorityArray1[2]}\\b`,'i');
                let idx_secondary_1=findIdx1(ks_1,secondary_regex);
                let idx_secondary_2=findIdx1(ks_2,secondary_regex);
                //CURRENT ROLE
                if(primary_regex.test(cr_1) && secondary_regex.test(cr_1))return true;
                else if(primary_regex.test(cr_2) && secondary_regex.test(cr_2))return false;
                else if(primary_regex.test(cr_1)){
                    if(secondary_regex.test(pr_1))return true;
                    else if(idx_secondary_1 < idx_secondary_2)return true;
                }
                else if(primary_regex.test(cr_2)){
                    if(secondary_regex.test(pr_2))return false;
                    else if(idx_secondary_1 > idx_secondary_2)return false;
                }
                else if(primary_regex.test(cr_1))return true;
                else if(primary_regex.test(cr_2))return false;
                //PREVIOUS ROLE
                if(primary_regex.test(pr_1) && secondary_regex.test(pr_1))return true;
                else if(primary_regex.test(pr_2) && secondary_regex.test(pr_2))return false;
                else if(primary_regex.test(pr_1)){
                    if(idx_secondary_1 < idx_secondary_2)return true;
                }
                else if(primary_regex.test(pr_2)){
                    if(idx_secondary_1 > idx_secondary_2)return false;
                }
                else if(primary_regex.test(pr_1))return true;
                else if(primary_regex.test(pr_2))return false;
                //SKILL SET
                if((idx_primary_1 < idx_primary_2) && (idx_secondary_1 < idx_secondary_2))return true;
                else if((idx_primary_1 > idx_primary_2) && (idx_secondary_1 > idx_secondary_2))return false;
                else if(idx_primary_1 < idx_primary_2) return true;
                else if(idx_primary_1 > idx_primary_2)return false;
                else return true;
            }else{
                console.log(true);
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