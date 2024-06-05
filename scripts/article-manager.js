/*
Vaminta
2024-06-05


*/
class ArticleManager {
	
	constructor(jsonURL){
		
		if(!jsonURL){
			let origin = window.location.origin;
			const relativePath = "data/articles.json";
			if(window.location.pathname.substr(1,7)=="vaminta"){ //internal localhost server testing i.e. 192.168.1.***/vaminta/ is host
				origin += "/vaminta/";
			}
			jsonURL = origin+relativePath;
		}
		
		this.url = jsonURL;
		this.status = "initialised";
		this.json = null;
		this.aList = null;
		this.featured = [];
	}
	
	_processJSON(json){
		//when json imported convert date strings into date objects
		for(let i=0; i<json.articles.length; i++){
			json.articles[i].date_published = new Date(json.articles[i].date_published);
			if(json.articles[i].date_updated.length>1){
				json.articles[i].date_updated = new Date(json.articles[i].date_updated);
			}
			else{
				json.articles[i].date_updated = new Date(json.articles[i].date_published);
			}
		}
		return json;
	}
	
	/*
	Gets the json - REQUIRED to use the class
	*/
	fetchArticles(){
		this.status = "fetching";
		return fetch(this.url)
			.then(function(response){
				return response.json();
			})
			.then(data=>{
				this.json = this._processJSON(data);
				this.aList = this.json.articles;
				this.featured = this.json.featured;
				this.status = "ready";
				return this.json;
			})
			.catch(error => {
				this.status = "failed";
				console.error(error);
				throw error;
			});
	}
	
	getArticles(){
		return this.aList;
	}
	
}