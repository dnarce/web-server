const express = require('express');
const path = require('path');
const hbs = require('hbs');

const {fetchGeoCodingLocation} = require('./api/geo-code-api');
const {fetchCurrentWeather} = require('./api/weather-api');

const app = express();

// Setup static directory to serve
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// Set up Handlebars and views location
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);


const getViewHeaderLinks = (viewPath) => {
    const views = [
        {
            path: "/",
            linkText: "Home",
        },
        {
            path: "/about",
            linkText: "About",
        },
        {
            path: "/help",
            linkText: "Help",
        },
    ];
    return views.map((view) => ({
        ...view,
        isActive: view.path === viewPath,
    }));
}

app.get('', (req, res) => {
    // it will render the index view inside the views directory
    res.render("index", {
        title: "Wheather APP",
        pageTitle: "Home",
        description: "This page will show the weather",
        headerLinks: getViewHeaderLinks('/'),
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        pageTitle: 'About',
        description: 'This site it will show descritpion related to the purpose of the site.',
        headerLinks: getViewHeaderLinks('/about'),
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        pageTitle: 'Help',
        description: 'This site it will contain the help info.',
        headerLinks: getViewHeaderLinks('/help'),
    });
});

app.get('/weather', (req, res) => {
    const {search} = req.query;

    if(!search){
        return res.send({
            error: 'You should provide any value on "search" parameter.'
        })
    }

    fetchGeoCodingLocation(search)
        .then((location) => {
            fetchCurrentWeather(location).then((weather) =>
                res.send({
                    ...weather,
                })
            );
        })
        .catch((error) => res.send(error));

});

app.get('*', (req, res)=>{
    res.render('404', {
        headerLinks: getViewHeaderLinks('/404'),
    });
})

app.listen("3000", () => {
    console.log("App runing on port 3000");
});