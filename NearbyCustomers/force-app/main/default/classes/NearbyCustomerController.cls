public with sharing class NearbyCustomerController {
    
    @AuraEnabled(cacheable=true)
    public static List<Customer> getNearbyCustomers(Decimal latitude, Decimal longitude, Decimal radiusKm) {
        // try {
            // Convert radius from kilometers to miles (Salesforce DISTANCE function uses miles)
            Decimal radiusMiles = radiusKm * 0.621371;
            
            // SOQL query to find nearby customers using DISTANCE function
            List<Customer> nearbyCustomers = [
                SELECT Id, Name, Location__Latitude__s, Location__Longitude__s
 
                FROM Customer 
                WHERE Location__Latitude__s != null
                AND DISTANCE(Location__c, GEOLOCATION(:latitude, :longitude), 'mi') < :radiusMiles
                ORDER BY DISTANCE(Location__c, GEOLOCATION(:latitude, :longitude), 'mi')
                LIMIT 50
            ];
            
            return nearbyCustomers;
        // } 
        // catch (Exception e) {
        //     throw new AuraHandledException('Error retrieving nearby customers: ' + e.getMessage());
        // }
    }

    @AuraEnabled(cacheable=true)
    public static List<Customer> getAllCustomers() {
        // try {
            // SOQL query to get all customers with location data
            List<Customer> allCustomers = [
                SELECT Id, Name, Location__Latitude__s, Location__Longitude__s
                FROM Customer 
                WHERE Location__Latitude__s != null
                AND Location__Longitude__s != null
                ORDER BY Name
                LIMIT 200
            ];
            
            return allCustomers;
        // } catch (Exception e) {
        //     throw new AuraHandledException('Error retrieving all customers: ' + e.getMessage());
        // }
    }
}





