import { LightningElement } from 'lwc';
import BULBON from '@salesforce/resourceUrl/bulbon';
import BULBOFF from '@salesforce/resourceUrl/bulboff';

export default class ConditionalRenderingBulb extends LightningElement {

    switchOn = false;
    switchLabel = 'Switch On';

    bulbOn = BULBON;
    bulbOff = BULBOFF;

    handleSwitch = (event) =>{
        
        this.switchOn = !this.switchOn;
        (this.switchOn === true) ? (this.switchLabel = 'Switch Off') : (this.switchLabel = 'Switch On');
    }
}