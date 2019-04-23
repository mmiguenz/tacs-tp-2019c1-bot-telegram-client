const botgram = require("botgram");
const axios = require("axios");
const configEnviroment = require('./config');

const bot = botgram(configEnviroment.bot_token);

let venuesData = [];

bot.command("start", (msg, reply, next) => {
    console.log("Received a /start command from", msg.from.name);

    const keyboard = [
        [ { text: "Use my location", request: "location" }],       
      ];

    // Display the keyboard
    reply.keyboard(keyboard, true).text("Get near places?");     
    
});

bot.text(function (msg, reply, next) {
    const venue = venuesData.find(v => v.title === msg.text);
    if (venue) {
        reply.venue(venue.latitude, venue.longitude, venue.title, venue.address, venue.foursquareId)
    } else {
        reply.text("Please type /start to begin")
    }     
     
});

bot.location((msg, reply, next) => {

    axios.get(configEnviroment.url_places, {
        params: {
            lat: msg.latitude,
            lon: msg.longitude,
            radius: 1000
        }
    })
    .then((response) =>  {
        const venues = response.data.map(p => getVenue(p)); 
        const venuesToAdd = venues.filter(v => ! venuesData.some(vd => vd.foursquareId === v.foursquareId))

        venuesData.push(...venuesToAdd);     

        const keyboard = venues.map(v => v.title);

        reply.keyboard(keyboard, true).text("select a place");
    })
    .catch((error) => {
        reply.text("Please try later")
        console.log(error);
    });
});

getVenue = (forsquarevenue) => {
    const p =  {latitude: forsquarevenue.location.lat,
                longitude: forsquarevenue.location.lng,
                title: forsquarevenue.name,
                address: forsquarevenue.location.address,
                foursquareId: forsquarevenue.id};
    return p; 
};