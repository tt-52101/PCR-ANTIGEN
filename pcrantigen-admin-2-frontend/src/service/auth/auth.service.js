import axios from 'axios';
import { useCookies } from "vue3-cookies";
import {basic_url} from "/@src/utils/basic_config";

const { cookies } = useCookies();


class AuthService {
    login(admin2) {
      let data = new FormData();
      data.set("username",admin2.username);
      data.set("password",admin2.password);
      data.set("grant_type","password");
      let admin2Store = null
      return axios.post(`${basic_url}/oauth/token`,data,{auth:{username:'pcr',password:'1234'}})
        .then(response=>{
          console.log("login response",response)
          if (response.data.access_token){
            const admin2 = {
              name:response.data.name,
              contact:response.data.contact_number,
              access_token:response.data.access_token ,
              profile_url:response.data.profile_url ,
              branch_id:response.data.branch_id ,
            };
            admin2Store = {
              name:response.data.name,
              contact:response.data.contact_number,
              profile_url:response.data.profile_url ,
              branch_id:response.data.branch_id ,
            };
            cookies.set("admin2",admin2,60 * 60 * 24 * 1);
            console.log("name cookie",cookies.get('admin2').name)
          }
          return admin2Store;
        })
    }


    logout() {
      cookies.remove("admin2");
    }
}

export default new AuthService();
