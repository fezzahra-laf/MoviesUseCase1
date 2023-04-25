import { LightningElement,track,wire } from 'lwc';

export default class MoviesMainLwc extends LightningElement {

    searchMovies(event){
        let movieName = event.detail.movieName;
        this.template.querySelector('c-movies-results-lwc').searchMovies(movieName);
    }
}