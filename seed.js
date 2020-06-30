var mongoose = require("mongoose"),
	Art = require("./models/art"),
	Comment = require("./models/comment");

var data = [
	{name: "Bust of Nefertiti", 
	 image: "https://pbs.twimg.com/media/EbAvPPFUEAAyuDi?format=jpg&name=large", 
	 info: "Thutmose, Circa 1345 BCE Limestone. A 'royal wife,' she was know as one of the three most beautiful women in ancient Egypt. It is known whether the left eye is missing because it fell out, or because it was never completed. A bust of Nefertiti, whose name means 'The beautiful one has come.'", 
	 museum:"Neues Museum", 
	 museumimage: "http://www.egyptian-museum-berlin.com/bilder/g_n_nofretete_02.jpg", 
	 ticket: 12,
	 location:"Neues Museum, Berlin, Germany",
	 author:{
		 id:"588c2e092403d111454fff76",
		 username:"JS"
	 }},
	{name: "The Fighting Temeraire", 
	 image: "https://pbs.twimg.com/media/EbAvPO7UEAEqSds?format=jpg&name=large", 
	 info: "Joseph Mallord William Turner 1839. Oil on canvas. A famous piece by Turner, a 'master of light.' It shows an English Navy ship commanded by Admiral Neision as it's being tugged toward its dismantling.", 
	 museum:"The National Gallery", 
	 museumimage: "https://s3-eu-west-1.amazonaws.com/lowres-picturecabinet.com/120/main/3/826783.jpg", 
	 ticket: 0,
	 location:"The National Gallery, London, UK",
	 author:{
            id : "588c2e092403d111454fff76",
            username: "JS"
        }
	},
	{name: "Venus de Milo", 
	 image: "https://pbs.twimg.com/media/EbRLmcIXsAsir-7?format=jpg&name=large", 
	 info: "A statue of the Roman goddess of love and beauty, Venus was found on the island of Milos. This beautiful sculpture makes many wonder what her original pose might have been", 
	 museum:"Louvre Museum", 
	 museumimage: "https://www.louvre.fr/sites/default/files/medias/medias_images/images/louvre-aphrodite-dite-venus-milo_0.jpg", 
	 ticket: 17,
	 location:"Louvre Museum, Paris, France",
	 author:{
            id : "588c2e092403d111454fff76",
            username: "JSS"
	 }
	}
]


function seedDB(){
   //Remove all arts
   Art.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed all arts!");
         //add a few arts
        data.forEach(function(seed){
            Art.create(seed, function(err, art){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a piece of art");
                    //create a comment
                    Comment.create(
                        {
                            text: "Let's gogogo!",
                            author:{
                                    id : "588c2e092403d111454fff76",
                                    username: "Jtest"
                                }
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                art.comments.push(comment);
                                art.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;

