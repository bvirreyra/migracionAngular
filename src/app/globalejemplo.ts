import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    /*DESARROLLO*/
    
    // rutaSrvBackEnd = 'http://192.168.30.178:8283/';
    // rutaSrvBackEndFonadal ='http://10.0.0.17:8585/';
    // rutaSrvFronEnd = 'http://192.168.30.68:8787';
    // rutaSrvReportes = 'http://192.168.30.68:8284';
    /*PRODUCCION*/
    //  rutaSrvBackEnd ='http://10.0.0.42:8283/';
    //  rutaSrvBackEndFonadal = 'http://10.0.0.17:8585/';     
    //  rutaSrvFronEnd ='http://10.0.0.91:8080';
    //  rutaSrvReportes ='http://10.0.0.91:8284';  
    /*PRODUCCION*/
    rutaSrvBackEnd ='http://200.105.137.131:8080/apisiga/';
    rutaSrvBackEndFonadal = 'http://200.105.137.131:8080/apisipta/';     
    rutaSrvFronEnd ='http://200.105.137.131:8080';
    rutaSrvReportes ='http://200.105.137.131:8080/apirpt';   
}

