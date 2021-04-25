import { LightningElement, wire, api, track} from 'lwc';
import getAllOpps from '@salesforce/apex/FetchContacts.getAllOpps';
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

export default class PaginationExample2 extends LightningElement {
    error;
    sortedDirection = 'asc';
    sortedBy = 'Name';
    searchKey = '';
    result;
    
    page = 1; 
    allItems = [];
    items = []; 
    data = []; 
    columns; 
    startingRecord = 1;
    endingRecord = 0; 
    pageSize = 10; 
    totalRecountCount = 0;
    totalPage = 0;
    searchTimeoutVar = null;
    len = false;
  
    @wire(getAllOpps)
    wiredAccounts({ error, data }) {
        if (data) {
            this.allItems = data;
            this.items = data;
            this.setPages();
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    setPages = () => {
        if(this.items.length>0){
            this.len = false;
            this.totalRecountCount = this.items.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.page = 1;
            
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = COLUMNS;
        }
        else{
            this.len = true;
        }
    }

    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        getOpps({searchKey: this.searchKey, sortBy: this.sortedBy, sortDirection: this.sortedDirection})
        .then((res) => {
            this.items = res;
            this.setPages();
        })
        .catch((err) => {
            console.log(err);
        })
    }
  
    handleKeyChange(event) {
        this.searchKey = event.target.value;
        if(this.searchTimeoutVar){
            clearTimeout(this.searchTimeoutVar);
        }
        this.searchTimeoutVar = setTimeout(() => {
            if(this.searchKey){
                this.items = this.allItems.filter((item) => {
                    return item.Name.toLowerCase().includes(this.searchKey.toLowerCase());
                })
                this.sortedDirection = 'asc';
                this.sortedBy = 'Name';
                this.setPages();
            }
            else if(!this.searchKey){
                this.items = this.allItems;
                this.setPages();
            }
        }, 2000);
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

}