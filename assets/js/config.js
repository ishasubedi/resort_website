/* Resort settings: edit this file. */
window.LGR=(function(){
/* ===== EDIT HERE: resort details, rooms and backend URL ===== */
var CFG={whatsapp:'9779805807476',phone:'+977 980-5807476',email:'theletegaunresort@gmail.com',
address:'Thasang-3, Lete, Mustang, Gandaki Province, Nepal',facebook:'https://www.facebook.com/letegaun/',
apiUrl:'',currency:'NPR',usdRate:null,
policies:{'Check-in':'','Check-out':'','Cancellation':''},
rooms:[
{id:'main',name:'Main Building',img:'main',alt:'The main building lit up at dusk',desc:'The two-storey house at the heart of the resort, with timber balconies, stone walls and warm lighting at night.',price:null},
{id:'cottage',name:'A-frame Cottages',img:'cottage',alt:'A-frame cottages glowing at dusk',desc:'Red-roofed A-frame cottages along a garden path, with pine forest behind and snow peaks beyond.',price:null}]};
var IMG={main:'assets/images/main-building.jpg',cottage:'assets/images/cottage.jpg',setting:'assets/images/setting.jpg',g1:'assets/images/gallery-1.jpg',g2:'assets/images/gallery-2.jpg',g3:'assets/images/gallery-3.jpg',g4:'assets/images/gallery-4.jpg',logo:'assets/images/logo.jpg'};
var GAL=[
{k:'g1',c:'Views',a:'The resort below the forested mountain',w:1},
{k:'g2',c:'Main building',a:'The main building lit up at dusk',p:'50% 72%'},
{k:'g3',c:'Cottages',a:'A-frame cottages glowing at dusk',p:'50% 52%'},
{k:'g4',c:'Cottages',a:'Cottages and garden path at dusk',p:'50% 45%'},
{k:'setting',c:'Views',a:'Cottages beneath a snow-capped peak'}];
/* =============================================================== */
return{CFG:CFG,IMG:IMG,GAL:GAL};
})();
