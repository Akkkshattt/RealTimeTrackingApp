const socket = io();
// console.log("hey");

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
    (position)=>{
        const{latitude,longitude} = position.coords;
        socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.error(error);
    },{
        // high level accuracy of position
        enableHighAccuracy:true,
        //means kitne time mai baar baar nayi location update hoye
        timeout:5000,
        //means caching off so that stored location mai se location update na kre har bar nayi bheje
        maximumAge:0
    }
);
}
//Basically now we are using leaf map to render our map and L object comes from that only
//giving initial position and how much zoom we want
// and jo bracket mai map likha hai thats the id where we want to render this map.
//this will only display a background but wont have an actual map. 
const map = L.map("map").setView([0,0],10);

//to display original map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Akshat Jain"
}).addTo(map);


//making a marker object to display like a pointer on map
//in built in leaflet to make a marker on map
const markers = {};

//using that received-location event/object here now to update front end
//this is the exact part of code jiski wajah se map pr aapki real time location dikhegi
// this is 20 we passed to tell how much zoom we want
socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude],16);
    if(markers[id]){
        //means if already map pr kisi id ka marker present hai toh bas uski location update kro
        markers[id].setLatLang([latitude,longitude]);
    }
    else{
        //new id hai toh nya marker bnao
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

//handling event when the user is disconnected so removing its marker
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
}) 