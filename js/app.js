window.addEventListener('load', () => {
    let searchBtn = document.querySelector('#movieSearch');
    let results = document.querySelector('#searchResults');
    let seasons = document.querySelector('#seasons');
    let resultPoster = document.querySelector('.poster img');
    let resultTitle = document.querySelector('.movie-title');
    let resultActors = document.querySelector('.actors');
    let resultPlot = document.querySelector('.movie-plot');
    let episodes = document.querySelector('#episodes');

    results.style.display = 'none';

    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('#all-episodes').textContent = ' ';
        seasons.innerHTML = ' ';
        results.style.display = 'none';
        document.querySelector('#loader').style.display = 'flex';
        document.querySelector('#welcome').style.display = 'none';
        let movieYear = document.querySelector('#yearInput').value;
        let movieTitle = document.querySelector('#titleInput').value;
        let movieType = document.querySelector('#typeInput').value;

        const movieAPIKey = 'feaaf9d7';
        const proxy = `https://cors-anywhere.herokuapp.com/`;
        const api = `${proxy}http://www.omdbapi.com/?t=${movieTitle}&y=${movieYear}&type=${movieType}&apikey=${movieAPIKey}`;
        fetch(api)
            .then(responce => {
                return responce.json();
            })
            .then(data => {
                if (data.Error) {
                    results.textContent = data.Error;
                } else {
                    // Destructure the resulting object and assign the values to the DOM Elements
                    const { Poster, Plot, Title, Actors, Type, totalSeasons } = data;
                    document.querySelector('#loader').style.display = 'none';
                    results.style.display = 'flex';
                    resultPoster.setAttribute('src', Poster);
                    resultTitle.textContent = `${Title}`;
                    resultPlot.textContent = Plot;
                    resultActors.textContent = `${Actors}`;
                    document.title = `${Title} - ${Actors}`;

                    //if result is a series, turn the poster clickable to hide the search form and view more details
                    if (Type === 'series') {
                        // get the number of seasons and create links to them
                        let mySeasons = [];
                        for (let i = 1; i <= totalSeasons; i++) {
                            let seaLink = document.createElement('a');
                            seaLink.setAttribute('href', '#');
                            seaLink.textContent = `Season ${i} `;
                            mySeasons.push(seaLink)
                            seasons.appendChild(seaLink);
                        }

                        //get a list of all episodes the clicked season
                        for (let j = 0; j < mySeasons.length; j++) {
                            mySeasons[j].addEventListener('click', () => {
                                document.querySelector('#all-episodes').textContent = ' ';
                                let text = mySeasons[j].textContent;
                                let seasonText = text.slice(7, 8);

                                const epiAPI = `http://www.omdbapi.com/?t=${movieTitle}&Season=${seasonText}&apikey=${movieAPIKey}`;
                                fetch(epiAPI)
                                    .then(epiResponce => {
                                        return epiResponce.json();
                                    })
                                    .then(allEpisodes => {
                                        const oEpisodes = allEpisodes.Episodes;
                                        console.log(oEpisodes)
                                        for (let k = 0; k < oEpisodes.length; k++) {
                                            const element = oEpisodes[k];
                                            console.log(element.Title);
                                            let epiNumb = element.Episode;
                                            let epiItem = document.createElement('li');
                                            epiItem.setAttribute('class', 'episode');
                                            epiItem.textContent = `${epiNumb}. ${element.Title}`;
                                            document.querySelector('#all-episodes').appendChild(epiItem);
                                        }
                                    })

                            })

                        }
                        resultPoster.addEventListener('click', () => {
                            let returnToSearch = document.querySelector('#back-to-search');
                            let searchForm = document.querySelector('#search-form');
                            resultPoster.style.cursor = "default";
                            returnToSearch.style.display = "flex";
                            episodes.style.display = 'flex';
                            searchForm.style.display = 'none';
                            results.style['flex'] = '1';
                            returnToSearch.addEventListener('click', () => {
                                resultPoster.style.cursor = "pointer";
                                episodes.style.display = 'none';
                                searchForm.style.display = 'flex';
                                returnToSearch.style.display = "none";
                            })
                        })
                    }
                }
            })
    })

})