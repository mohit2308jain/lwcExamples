import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpps from '@salesforce/apex/FetchContacts.getOpps';

const COLUMNS = [{
    label: 'Name',
    fieldName: 'Name',
    type: 'text',
    sortable: true
},
{
    label: 'Stage',
    fieldName: 'StageName',
    sortable: true
},
{
    label: 'Close Date',
    fieldName: 'CloseDate',
    sortable: true
}
];

export default class PaginationExample extends LightningElement {
    error;
    sortedDirection = 'asc';
    sortedBy = 'Name';
    searchKey = '';
    result;
    
    page = 1; 
    @track items = []; 
    @track data = []; 
    columns; 
    startingRecord = 1;
    endingRecord = 0; 
    pageSize = 10; 
    totalRecountCount = 0;
    totalPage = 0;
  
    @wire(getOpps, {searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'})
    wiredAccounts({ error, data }) {
        if (data) {
        
            this.items = data;
            this.totalRecountCount = data.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = COLUMNS;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page < this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    //this method displays records page by page
    displayRecordPerPage(page){

        this.startingRecord = ((page - 1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);
    }    

    
    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;

        //return refreshApex(this.result);
        
    }
  
    handleKeyChange(event) {
        this.searchKey = event.target.value;
        //return refreshApex(this.result);
    }

}