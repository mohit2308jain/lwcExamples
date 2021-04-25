public with sharing class FetchContacts {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactRecords(){
        try {
            return [SELECT Id, Name, Email, Phone FROM Contact];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getAllOpps() {
        
        String query = 'SELECT Id, Name,StageName,CloseDate FROM Opportunity ORDER BY Name ASC';
        system.debug('query---'+query);
        return Database.query( query );
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpps( String searchKey, String sortBy, String sortDirection) {
        
        String query = 'SELECT Id, Name,StageName,CloseDate FROM Opportunity';
        system.debug('query---'+query);
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            query += ' WHERE Name LIKE :key';
        }
        if ( sortBy != null && sortDirection != null ) {
            query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }
        return Database.query( query );
    }
}
