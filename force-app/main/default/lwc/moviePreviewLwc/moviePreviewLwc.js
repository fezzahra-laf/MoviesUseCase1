import { LightningElement,  track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import {subscribe,APPLICATION_SCOPE, publish, MessageContext} from 'lightning/messageService';
import movieMC from '@salesforce/messageChannel/movieMChannel__c';
import movieRef from '@salesforce/messageChannel/movieRefresh__c';
import { getRecord, getFieldValue, deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Movie__c.Id';
import NAME_FIELD from '@salesforce/schema/Movie__c.Name';
import CATEGORY_FIELD from '@salesforce/schema/Movie__c.Category__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Movie__c.Description__c';
import IMAGE_FIELD from '@salesforce/schema/Movie__c.Image__c';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import MOVIE_OBJECT from '@salesforce/schema/Movie__c';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

const fields = [
    ID_FIELD,
    NAME_FIELD,
    CATEGORY_FIELD,
    DESCRIPTION_FIELD,
    IMAGE_FIELD
];
export default class MoviePreviewLwc extends LightningElement {

    @wire(MessageContext)
    messageCnx;

    @wire(MessageContext)
    messageCnxRef;

    subscription = null;

    movieId;
    Name;
    Category__c;
    Description__c;
    Image__c;

    editMode = false;

    @track isModalOpen = false;
    openConfirmModal() {
        this.isModalOpen = true;
    }
    closeConfirmModal() {
        this.isModalOpen = false;
    }
    confirmDelete() {
        this.handleDeleteMovie();
        this.isModalOpen = false;
    }

    @wire(getObjectInfo, { objectApiName: MOVIE_OBJECT })
    movieMetadata;

    @wire(getPicklistValues,{
            recordTypeId: '$movieMetadata.data.defaultRecordTypeId', 
            fieldApiName: CATEGORY_FIELD
        }
    )
    categoryPicklist;

    @wire(getRecord, { recordId: '$movieId', fields })
    wiredRecord({ error, data }) {
        if (error) {
        } else if (data) {
            fields.forEach(
                (item) => (this[item.fieldApiName] = getFieldValue(data, item))
            );
        }
    }

    handleEditMovie(){
        this.editMode = true;
    }

    categ;
    changeCat(event){
        this.categ = event.target.value;
    }

    desc;
    changeDesc(event){
        this.desc = event.target.value;
    }

    handleSaveMovie() {
       
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.movieId;
        fields[NAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='Name']").value;
        fields[DESCRIPTION_FIELD.fieldApiName] = this.desc;
        fields[CATEGORY_FIELD.fieldApiName] = this.categ;

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact updated',
                        variant: 'success'
                    })
                );
                this.editMode = false;
                this.sendMessage();
                return refreshApex(this.movieId);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

    }

    handleCancel(event){
        this.editMode = false;
        this.desc = '';
        this.cat = '';
    }


    handleDeleteMovie(){
        deleteRecord(this.movieId) 
        .then(() =>{
    
           const toastEvent = new ShowToastEvent({
               title:'Record Deleted',
               message:'Record deleted successfully',
               variant:'success',
           })
           this.dispatchEvent(toastEvent);
           this.Name = '';
           this.sendMessage();
           return refreshApex(this.movieId);
           
           
        })
        .catch(error =>{
            window.console.log('Unable to delete record due to ' + error.body.message);
        });
     }


    connectedCallback(){
        this.subscribeMovieMC();
    }

    subscribeMovieMC(){
        if (!this.subscription) {
            this.editMode = false;
            this.subscription = subscribe(
                this.messageCnx,
                movieMC,
                (message) => {this.movieId = message.movieRecId},
                { scope: APPLICATION_SCOPE }
            );

        } 
    }

    sendMessage(){
        console.log('in send');
        publish(this.messageCnxRef, movieRef, {refreshRes: 'refresh'});
        console.log('in send 2');

    }
    
    

}