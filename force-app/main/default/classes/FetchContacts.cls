public with sharing class FetchContacts {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactRecords(){
        try {
            return [SELECT Id, Name, Email, Phone FROM Contact];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
