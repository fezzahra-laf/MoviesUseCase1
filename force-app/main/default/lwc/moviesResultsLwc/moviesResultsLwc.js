import { LightningElement,  track, api, wire } from 'lwc';
import {publish, subscribe, MessageContext, APPLICATION_SCOPE} from 'lightning/messageService';
import getMovies from '@salesforce/apex/moviesController.getMovies';
import movieMC from '@salesforce/messageChannel/movieMChannel__c';
import movieRef from '@salesforce/messageChannel/movieRefresh__c';


export default class MoviesResultsLwc extends LightningElement {

    @wire(MessageContext)
    messageCnx;

    @wire(MessageContext)
    messageCnxRef;

    movieName = '';

    @track 
    moviesList;

    @api
    selectedMovieId;


    @wire(getMovies, {movieName: '$movieName'})
    getMoviesList({data,error}){
        if(data){
            this.moviesList = data;
            console.log('in here')
        }else if(error){
            console.log('error');
            console.log(error);
        }
    }

    connectedCallback(){
        this.subscribeRefreshMC();
    }

    @api 
    searchMovies(movieName){
        console.log('mov' + movieName);
        this.movieName = movieName;
    }

    selectMovie(event){
        this.selectedMovieId = event.currentTarget.dataset.id;
        this.sendMessage(this.selectedMovieId);
    }

    sendMessage(movieId){
        publish(this.messageCnx, movieMC, {movieRecId: movieId});
    }

    subscribeRefreshMC(){
        if (!this.subscription) {
            this.editMode = false;
            console.log('in subs');

            this.subscription = subscribe(
                this.messageCnxRef,
                movieRef,
                (message) => {
                    getMovies({ movieName: ' ' })
                    .then(result => {
                        this.moviesList = result;
                    })
                    .catch(error => {
                        this.error = error;
                    });
                        },
                        { scope: APPLICATION_SCOPE }
                    );

        } 
    }
}