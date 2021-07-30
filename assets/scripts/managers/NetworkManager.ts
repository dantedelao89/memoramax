import {DEPLOYMENT_MODE, BASE_ADDRESS} from "./NetworkConfig"
export class NetworkManager {
    private static _instance : NetworkManager;
    private baseUrl : string = "";

    static getInstance() : NetworkManager{
        if(!NetworkManager._instance){
            NetworkManager._instance = new NetworkManager();
        }
        return NetworkManager._instance;       
    }
  

    init(){
        this.baseUrl = BASE_ADDRESS;
    }

    sendRequest(api: string,  reuqestType : string, param : any, successCb : Function, errorCb :Function,requireToken: boolean = false){
        let xhr = new XMLHttpRequest();
        let fullurl = this.baseUrl + api;

        let readyStateChanged  = () =>{
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                let response : string = xhr.responseText;
                successCb(response);
            }else if(xhr.readyState === 4){
                let respone: string = xhr.responseText;
                errorCb(respone);
            }
        }
        
        xhr.open(reuqestType, fullurl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = readyStateChanged;
        console.log("param", param);
        xhr.send(JSON.stringify(param));
    }
}

