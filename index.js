//require express
const express = require('express');
const app = express();
//require path, to be able to set the views path
const path = require('path');
//require method override MW
var methodOverride = require('method-override');
//require and execute uuid - unique id
const { v4: uuidv4 } = require('uuid');
uuidv4();
//setting view engine as EJS
app.set('view engine', 'ejs');
//setting views path
app.set('views', path.join(__dirname, 'views'));
//setting parsing method for urlencoded and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

//Fake data base ! 
let tweetFeed = [
    {
        "id": uuidv4(),
        "user": "Elon Musk",
        "tweet": "DodgeCoin to the MOON!"
    },
    {
        "id": uuidv4(),
        "user": "Steve Aoki",
        "tweet": "I would love to have a concert in Romania"
    },
    {
        "id": uuidv4(),
        "user": "SyberianHusky",
        "tweet": "AWUAWUAWUAWUAWU"
    },
    {
        "id": uuidv4(),
        "user": "OnlyBarks",
        "tweet": "Bark Bark Bark, bark bark BARK!"
    },
    {
        "id": uuidv4(),
        "user": "ElonMusket",
        "tweet": "Pew Pew Pew PEW!!"
    }
]

// Display all tweets
//Rendering tweetFeed ejs file and making tweetFeed aray avaiable in the ejs file
app.get('/tweets', (req, res) => {
    res.render('tweets/tweetFeed', { tweetFeed });
})
// Create a new tweet
// GET request to tweets/new to get the form
app.get('/tweets/new', (req, res) => {
    res.render('tweets/new')
})
//POST request to /tweets to update the array with entry from /new form
app.post('/tweets', (req, res) => {
    const { user, tweet } = req.body;
    tweetFeed.push({ user, tweet, id: uuidv4() });
    res.redirect('/tweets')
})
// Show a single tweet - we need to use ID!
app.get('/tweets/:id', (req, res) => {
    //getting id from request params
    const { id } = req.params;
    //selecting a specific tweet using the find method(first tweet that matches the id)
    const specificTweet = tweetFeed.find(t => t.id === id);
    //rendering the show ejs page and extracting the single tweet
    res.render('tweets/show', { specificTweet });
})

// Edit a tweet
//GET request for edit form
app.get('/tweets/:id/edit', (req, res) => {
    //destructuring the req.params to get the id
    const { id } = req.params;
    //select a specifc id using the find method
    const specificTweet = tweetFeed.find(t => t.id === id);
    //rendering the edit ejs page and extracting the specific tweet
    res.render('tweets/edit', { specificTweet });
})

//PATCH request for updating the tweet with the form data entered
app.patch('/tweets/:id', (req, res) => {
    //destructuring the req.params to get the id
    const { id } = req.params;
    //save form data in a new variable (form data sent in req.body.tweet)
    const newTweetText = req.body.specificTweet;
    //finding match tweet with the id
    const foundTweet = tweetFeed.find(t => t.id === id);
    //updating tweet body  with what was sent in the form
    foundTweet.tweet = newTweetText;
    //redirecting to /tweets feed
    res.redirect('/tweets');
})
// Delete a tweet
app.delete('/tweets/:id', (req, res) => {
    const { id } = req.params;
    tweetFeed = tweetFeed.filter(t => t.id !== id);
    res.redirect('/tweets');
})




//redirect home to tweets
app.get('/', (req, res) => {
    res.redirect('/tweets');
})
//listening for port 3000;
app.listen(3000, () => {
    console.log('listening on port 3000');
})