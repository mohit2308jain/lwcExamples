import { LightningElement } from 'lwc';

export default class FirstComponent extends LightningElement {

    userInput = '';

    handleInputChange = (event) => {
        this.userInput = event.target.value;
    }
}