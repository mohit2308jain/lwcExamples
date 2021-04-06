import { LightningElement, wire, track } from 'lwc';
import getContactRecords from '@salesforce/apex/FetchContacts.getContactRecords';

export default class ConditionalRenderingExample1 extends LightningElement {

    contactList;
    allContactList;
    contactToShow;
    showViewModal = false;
    recIdForModal = '';
    len = false;
    timeoutVar = null;

    @wire(getContactRecords)
    fetching({error, data}){
        if(error){
            console.log(error);
            this.showErrorToast(error);
        }
        if(data){
            console.log(data);
            this.allContactList = data;
            this.contactList = data;
            this.setLen(this.contactList.length);
        }
    }

    searchContacts = (event) => {
        const searchTerm = event.target.value;

        if(this.timeoutVar){
            clearTimeout(this.timeoutVar);
        }
        this.timeoutVar = setTimeout(() => {
            if(searchTerm){
                this.contactList = this.allContactList.filter((con) => {
                    return con.Name.toLowerCase().includes(searchTerm.toLowerCase());
                })
                this.setLen(this.contactList.length);
            }
            if(!searchTerm){
                this.contactList = this.allContactList;
                this.setLen(this.contactList.length);
            }
        }, 1500);
    }   

    setLen = (res) => {
        this.len = (res) ? true : false;
    }

    openViewModal = (event) => {
        this.recIdForModal = event.target.name;
        this.contactToShow = this.contactList.filter((con) => {
            return (con.Id === this.recIdForModal)
        })[0];
        this.showViewModal = true;
    }

    closeViewModal = () => {
        this.showViewModal = false;
        this.contactToShow = null;
    }

    showErrorToast = (err) => {
        const event = new ShowToastEvent({
            title: 'Error',
            variant: 'error',
            message: err.body.message,
        });
        this.dispatchEvent(event);
    }

}

/*

handleshowprop = (event) => {
        console.log(event.target.name);
        this.showContacts.map((con) => {
            if(con.conId === event.target.name){
                con.show = !con.show
                console.log('a');
                console.log(con.show);
            }
        })
    }

*/