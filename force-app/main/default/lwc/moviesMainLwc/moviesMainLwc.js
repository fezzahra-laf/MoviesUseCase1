import { LightningElement,track,wire } from 'lwc';

export default class MoviesMainLwc extends LightningElement {

    showModal = false;

    createNewMovie(){
      this.showModal = true;
    }
    
    closeModal(){
      this.showModal = false;
      var nm = ' ';
      this.template.querySelector('c-movies-results-lwc').searchMovies(nm);
    }

    searchMovies(event){
        let movieName = event.detail.movieName;
        this.template.querySelector('c-movies-results-lwc').searchMovies(movieName);
    }
}