console.log("u suck")
/** 
* pulls information from the form and build the query URL
* @returns {string} URL for the NYT API based on form inputs
*/
function buildQueryURL() {
    //queryURL is the url we'll use to query the API
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
    
    //begin building an objext to contain our API call's query parameter
    //set the API key
    var queryParams = { "api-key": "b9f91d369ff59547cd47b931d8cbc56b:0:74623931" };

    //grab text the user typed into the search input, add to the quertParams object
    queryParams.q = $("#search-term")
        .val()
        .trim();

//if the user provides a startYear, include it in the queryParams object
var startYear = $("#start-year")
    .val()
    .trim();

if (parseInt(startYear)) {
    queryParams.begin_date = startYear + "0101";
}

//if user provides an endYear, include it int he queryParams object
var endYear = $("#end-year")
    .val()
    .trim();

if (parseInt(endYear)) {
    queryParams.end_date = endYear + "0101";
}

//logging the URL so we can have access to it for troubleshooting
console.log("---------\nURL: " +queryURL + "\n------------");
console.log(queryURL + $.param(queryParams));
return queryURL + $.param(queryParams);
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} NYTData -object containing NYT API data
 */
function updatePage(NYTData) {
    //get from the form the number of results to display
    //API doesnt have a "limit" parameter, so we have to do this ourselves
    var numArticles = $("#article-count").val();

    //log the NYDAta to console, where it will show up as an object
    console.log(NYTData);
    console.log("-------------"); 

    //loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
        //get specific article infor for the current index
        var article = NYTData.response.docs[i];

        //increase the articleCount (track article # -starting at 1)
        var articleCount = i + 1;

        // create the list group to contain the articles and add the the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        //the newly created element to the DOM
        $("#article-section").append($articleList);

        //if the article has a headline, log and append to $articleList
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
            console.log(headline.main);
            $articleListItem.append(
                "<span class='label label-primary'>" +
                    articleCount +
                    "</span"> +
                    "<strong> " +
                    headline.main +
                    "</strong>"
            );
        }
        //if the article has a byline, log and append to $articleList
        var byline = article.byline;

        if (byline && byline.original) {
            console.log(byline.original);
            $articleListItem.append("h5>" + byline.original + "</h5>");
        }

        //log section, and append to document if exists
        var section = article.section_name;
        console.log(article.section_name);
        if (section) {
            $articleListItem.append("<h5>Section: " + section + "</h5>");           
        }

        //log published date, and append to doucment if exists
        var pubDate= article.pub_date;
        console.log(article.pub_date);
        if (pubDate) {
            $articleListItem.append("<h5" + article.pub_date + "</h5>");
        }

        //append and log url
        $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a");
        console.log(article.web_url)

        //append the article
        $articleList.append($articleListItem);
    }
}
//function to empty out the articles
function clear() {
    $("#article-section").empty();
}

//click handlers
//================================

//.on("click") function ass. w/the search button
$("#run-search").on("click", function(event) {
    //this line allows us to take advantage of the HTML "submit" property
    //this way we can hit enter on the keyboard and it registers the search
    //(in addition to clicks). prevents the page from reloading on form submit.
    event.preventDefault();

    //empty the region associated with the articles
    clear();

    //build the query URL for the AJAXrequst to the NYT API
    var queryURL = buildQueryURL();

    //make the AJAX request to the API -GETs the JSON data at the queryURL
    //the data then gets passed as an argument to the updatePage function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);
});

//.on("click") function ass w/the c;ear button
$("#clear-all").on("click", clear);