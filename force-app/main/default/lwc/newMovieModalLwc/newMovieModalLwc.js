import { LightningElement,track,api } from 'lwc';
import movie from "@salesforce/schema/Movie__c";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createMovie from '@salesforce/apex/moviesController.createMovie';


export default class NewMovieModalLwc extends LightningElement {

    @track movieActors   =  [];
    @track selectedActor = '';
    @track newMovie = {
        name:"",
        description:"",
        category:"",
        releaseDate:new Date(),
    };

    handleChangeName(event) {
        this.newMovie.name = event.target.value;
    }  

    handleChangeDesc(event) {
        this.newMovie.description = event.target.value;
    }  

    handleChangeCategory(event) {
        this.newMovie.category = event.target.value;
    }  

    handleChangeReleaseDate(event) {
        this.newMovie.releaseDate = event.target.value;
    }  

    handleChangeActor(event){
        this.selectedActor = event.target.value;
    }

    handleAddActor(){
        if(this.movieActors.find(key => key=== this.selectedActor)){
            this.selectedActor = '';
            this.displayMessage('You already choose this actor. Please select another actor','Duplicate actor');
        } 

        else if(this.selectedActor.length == 0){
            this.selectedActor = '';
            this.displayMessage('Please choose an actor','Required selection');
        } 
        else{
            this.movieActors.push(this.selectedActor);
            this.selectedActor = '';
        } 
    }

    handleRemoveActor(event){
        this.movieActors = this.movieActors.filter(actor => {return actor !== event.target.value;} );

    }

    handleCreateMovie(){
        this.handleAddActor();
        console.log(JSON.stringify(this.movieActors));
        createMovie({movie:this.newMovie ,actorsIds:JSON.stringify(this.movieActors)})
                   .then(result =>{
                       console.log('result'+result);
                       this.closeModal();
                   })
                   .catch(error =>{
                       console.log('error'+error);
                       this.closeModal();
                   })

        
    }

    displayMessage(msg,t){
        const ev = new ShowToastEvent({
            title: t,
            message: msg,
            variant: 'Warning',
        });
        this.dispatchEvent(ev);
    }

    closeModal(){
        const ev = new CustomEvent('closemodalevent', { });
        this.dispatchEvent(ev);
    }
}