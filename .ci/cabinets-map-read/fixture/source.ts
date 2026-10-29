const params = new URLSearchParams(location.search);
const scene = params.get('scene') ?? 'nominal';
const row = (slug:string,name:string,city:string,status='en_exploitation') => ({slug,name,address:city+' · adresse fictive',city,status,lat:44.8,lng:-0.5,google_place_id:'ChIJFixture'+slug,date_ouverture_cible:status==='en_exploitation'?null:'2027-03-01'});
const all = [row('alpha','Cabinet Alpha','Bordeaux'),row('beta','Cabinet Beta','Toulouse','en_travaux'),row('gamma','Cabinet Gamma','Floirac'),row('omega','Cabinet Omega','Le Bouscat')];
export const supabase = { from:(table:string) => {
 if(table!=='projets')throw Error('Fixture table only');
 let start=0;
 const query={select(){return query;},not(){return query;},order(){return query;},range(value:number){start=value;return query;},then(resolve:(v:unknown)=>unknown){
  if(scene==='loading')return new Promise(()=>{});
  let result:unknown;
  if(scene==='refused')result={data:null,error:{message:'FIXTURE_REFUSAL'},count:null};
  else if(scene==='null')result={data:null,error:null,count:null};
  else if(scene==='empty')result={data:[],error:null,count:0};
  else {const rows=scene==='excluded'?[{...all[0],lat:91}]:all;result={data:rows.slice(start,start+2),error:null,count:rows.length};}
  return Promise.resolve(result).then(resolve);
 }};
 return query;
}};
