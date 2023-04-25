import { LightningElement,track,wire } from 'lwc';

export default class FilterMoviesLwc extends LightningElement {

    selectedMovieName = '';

    handleSearchChange(event){
        this.selectedMovieName = event.detail.value;
        const searchEvent = new CustomEvent('search',{
            detail: { movieName: this.selectedMovieName}
        })
        this.dispatchEvent(searchEvent);
    }
}