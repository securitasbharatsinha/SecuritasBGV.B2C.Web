import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";




@Injectable({
    providedIn: "root",
  })
  
export class SeoService{
    constructor(
        private _HttpClient: HttpClient
    ){}

    getData(id:number){
        const url = `https://jsonplaceholder.typicode.com/todos/${id}`
        return this._HttpClient.get<any>(url)
    }
  
  

}