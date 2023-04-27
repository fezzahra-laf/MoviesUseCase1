import { LightningElement,  track, api, wire } from 'lwc';
import {publish, MessageContext, APPLICATION_SCOPE} from 'lightning/messageService';
import getMovies from '@salesforce/apex/moviesController.getMovies';
import movieMC from '@salesforce/messageChannel/movieMChannel__c';

export default class MoviesResultsLwc extends LightningElement {

    @wire(MessageContext)
    messageCnx;

    movieName = '';

    @track 
    moviesList;

    @api
    selectedMovieId;

    @wire(getMovies, {movieName: '$movieName'})
    getMoviesList({data,error}){
        if(data){
            this.moviesList = data;

        }else if(error){
            console.log('error');
            console.log(error);
        }
    }


    @api 
    searchMovies(movieName){
        this.movieName = movieName;
    }

    selectMovie(event){
        this.selectedMovieId = event.currentTarget.dataset.id;
        this.sendMessage(this.selectedMovieId);
    }

    sendMessage(movieId){
        publish(this.messageCnx, movieMC, {movieRecId: movieId});
    }
}