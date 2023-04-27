import { LightningElement,  track, api, wire } from 'lwc';
import {subscribe,APPLICATION_SCOPE, MessageContext} from 'lightning/messageService';
import movieMC from '@salesforce/messageChannel/movieMChannel__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Movie__c.Name';
import CATEGORY_FIELD from '@salesforce/schema/Movie__c.Category__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Movie__c.Description__c';
import IMAGE_FIELD from '@salesforce/schema/Movie__c.Image__c';

const fields = [
    NAME_FIELD,
    CATEGORY_FIELD,
    DESCRIPTION_FIELD,
    IMAGE_FIELD
];
export default class MoviePreviewLwc extends LightningElement {

    @wire(MessageContext)
    messageCnx;

    subscription = null;

    movieId;
    Name;
    Category__c;
    Description__c;
    Image__c;

    @wire(getRecord, { recordId: '$movieId', fields })
    wiredRecord({ error, data }) {
        if (error) {
            //this.dispatchToast(error);
        } else if (data) {
            fields.forEach(
                (item) => (this[item.fieldApiName] = getFieldValue(data, item))
            );
        }
    }


    connectedCallback(){
        this.subscribeMovieMC();
    }

    subscribeMovieMC(){
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageCnx,
                movieMC,
                (message) => {this.movieId = message.movieRecId},
                { scope: APPLICATION_SCOPE }
            );
        } 
    }
    
    

}