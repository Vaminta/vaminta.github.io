/*
Vaminta
2024-06-05


*/
class ArticleManager {
	
	constructor(jsonURL){
		
		if(!jsonURL){
			let origin = window.location.origin;
			const relativePath = "/data/articles.json";
			if(window.location.pathname.substr(1,7)=="vaminta"){ //internal localhost server testing i.e. 192.168.*.***/vaminta/ is host
				origin += "/vaminta";
			}
			jsonURL = origin+relativePath;
		}
		
		this.url = jsonURL;
		this.status = "initialised";
		this.json = null;
		this.aList = null;
		this.featured = [];
		
		//private
		this._defaultThumb = 0;
	}
	
	_getThumbData(id, json){
		if(!json) json = this.json;
		const thumbs = json.thumbs.list;
		for(let i=0;i<thumbs.length;i++){
			if(thumbs[i].id == id){
				return thumbs[i];
			}
		}
		return -1;//error, cannot find
	}
	
	_processJSON(json){
		//when json imported convert date strings into date objects
		const defThumbs = json.thumbs.defaults;
		//const dThumbDir = json.thumbs.def_root_dir
		for(let i=0; i<json.articles.length; i++){
			json.articles[i].date_published = new Date(json.articles[i].date_published);
			if(json.articles[i].date_updated.length>1){
				json.articles[i].date_updated = new Date(json.articles[i].date_updated);
			}
			else{ //set the date updated to the same as published if not updated
				json.articles[i].date_updated = new Date(json.articles[i].date_published);
			}
			
			//new 2025 - set thumbnail data
			let cArticle = json.articles[i]; //current article
			let thumbnail = {
				src: "",
				width: 1280,
				height: 720
			};
			if(!cArticle.visible) continue; //add default thumb for invisible in future
			if(!cArticle.thumb || cArticle.thumb.length<1){ //custom thumb not set - set default
				const thumbID = defThumbs[this._defaultThumb % (defThumbs.length+0)]; //ID of def thumb to get
				const thumbData = this._getThumbData(thumbID,json);
				console.log(thumbData);
				this._defaultThumb++;
				thumbnail.src = json.thumbs.def_root_dir + thumbData.src;
				thumbnail.width = thumbData.width;
				thumbnail.height = thumbData.height;
			}
			else{ //custom thumb id specified
				
			}
			
			cArticle.thumbnail = thumbnail;
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
			.then(data=>{ // arrow func = lexical this
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
	
	getById(id,optArticles){
		let articles = this.aList;
		if(optArticles) articles = optArticles;
		
		let foundArticle = null;
		
		for(let i=0; i<articles.length; i++){ //linear search through
			if(articles[i].id == id){
				foundArticle = articles[i];
				break;
			}
		}
		
		return foundArticle;
	}
	
	getFeatured(){
		const featured = this.json.featured; 
		let featuredList= [];
		const articles = this.aList;
		
		for(let n=0; n<featured.length; n++){
			for(let i=0; i<articles.length; i++){
				if(articles[i].id == featured[n]){
					featuredList.push(articles[i]);
					break;
				}
			}
		}
		
		return featuredList;
	}
	
	_compare_rChronPub(art_a, art_b){
		const a = art_a.date_published.getTime();
		const b = art_b.date_published.getTime();
		if(a>b){
			return -1; //a should come before b (bc more in the future)
		}
		else if(a<b){
			return 1;
		}
		return 0;
	}
	
	sortArticles(sortType, optArticles){
		let articleArray = this.aList;
		let compareFn = null;
		
		if(sortType=="r-chron-pub"){ //reverse chronological
			compareFn = this._compare_rChronPub;
		}
		articleArray.sort(compareFn);
		return articleArray;
	}
	
	/*
	Param: art - article object
	Returns: (object) - contains 3 params: src (string), width (int), height (int)
	*/
	getThumbnail(art){
		return art.thumbnail;
		let thumbnail = {
			src: "",
			width: 1280,
			height: 720
		};
		if(this.status!="ready" || !art || art==null) return;
		const article = art;
		
		//check if custom thumbnail specified
		if(!article.thumb || article.thumb.length<1){ //get default thumbnail
			const default_thumbs = this.json.default_thumbs.list;
			const thumb = default_thumbs[this._defaultThumb % default_thumbs.length];
			this._defaultThumb++;
			thumbnail.src = this.json.default_thumbs.root_dir + thumb.src;
			thumbnail.width = thumb.width;
			thumbnail.height = thumb.height;
		}
		return thumbnail;
	}
	
	dateToString(date){
		const shortMonthsEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Nov","Dec"];
		let dateString = date.getDate().toString();
		dateString += " " + shortMonthsEn[date.getMonth()] + " " + date.getFullYear();
		return dateString;
	}
}