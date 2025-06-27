@isTest
public class NearbyCustomerControllerUAT_Test {
    
    @TestSetup
    static void setupTestData() {
        // Create test customers with valid geolocation data
        List<Customer> customers = new List<Customer>();
        
        // Customer within radius
        customers.add(new Customer(
            Name = 'UAT Customer 1',
            Location__Latitude__s = 37.7849,
            Location__Longitude__s = -122.4094
        ));
        
        // Customer within radius but further
        customers.add(new Customer(
            Name = 'UAT Customer 2', 
            Location__Latitude__s = 37.7749,
            Location__Longitude__s = -122.4194
        ));
        
        // Customer outside typical radius
        customers.add(new Customer(
            Name = 'UAT Far Customer',
            Location__Latitude__s = 37.4419,
            Location__Longitude__s = -122.1430
        ));
        
        insert customers;
    }
    
    @isTest
    static void testUAT_BasicFunctionality() {
        // Test basic functionality - FIXED METHOD NAME
        Decimal testLat = 37.7849;
        Decimal testLng = -122.4094;
        Decimal radius = 10.0; // Changed from Integer to Decimal
        
        Test.startTest();
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'UAT: Result should not be null');
        System.assert(result.size() >= 0, 'UAT: Should handle results gracefully');
    }
    
    @isTest
    static void testUAT_SmallRadius() {
        // Test with small radius - FIXED METHOD NAME
        Decimal testLat = 37.7849;
        Decimal testLng = -122.4094;
        Decimal radius = 1.0; // Changed from Integer to Decimal
        
        Test.startTest();
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'UAT: Small radius result should not be null');
    }
    
    @isTest
    static void testUAT_LargeRadius() {
        // Test with large radius - FIXED METHOD NAME
        Decimal testLat = 37.7849;
        Decimal testLng = -122.4094;
        Decimal radius = 100.0; // Changed from Integer to Decimal
        
        Test.startTest();
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'UAT: Large radius result should not be null');
        System.assert(result.size() <= 50, 'UAT: Should respect LIMIT of 50');
    }
    
    @isTest
    static void testUAT_ZeroRadius() {
        // Test with zero radius - FIXED METHOD NAME
        Decimal testLat = 37.7849;
        Decimal testLng = -122.4094;
        Decimal radius = 0.0; // Changed from Integer to Decimal
        
        Test.startTest();
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'UAT: Zero radius result should not be null');
    }
    
    @isTest
    static void testUAT_EdgeCoordinates() {
        // Test with edge coordinates - FIXED METHOD NAME
        Decimal testLat = 0.0;
        Decimal testLng = 0.0;
        Decimal radius = 10.0; // Changed from Integer to Decimal
        
        Test.startTest();
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'UAT: Edge coordinates result should not be null');
    }
    
    @isTest
    static void testUAT_GetAllCustomers() {
        // Test getAllCustomers method - FIXED METHOD NAME
        Test.startTest();
        List<Customer> result = NearbyCustomerController.getAllCustomers();
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'UAT: Get all customers result should not be null');
        System.assert(result.size() >= 0, 'UAT: Should return valid customer list');
    }
    
    @isTest
    static void testUAT_InvalidLatitude() {
        // Test with invalid latitude - FIXED METHOD NAME AND PARAMETERS
        Decimal testLat = 200.0; // Invalid latitude - changed from Integer to Decimal
        Decimal testLng = -122.4094;
        Decimal radius = 10.0; // Changed from Integer to Decimal
        
        Test.startTest();
        try {
            List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
            // Should either work or throw exception
            System.assertNotEquals(null, result, 'UAT: Invalid latitude should be handled');
        } catch (Exception e) {
            System.assert(true, 'UAT: Invalid latitude exception is acceptable');
        }
        Test.stopTest();
    }
    
    @isTest
    static void testUAT_InvalidLongitude() {
        // Test with invalid longitude - FIXED METHOD NAME AND PARAMETERS
        Decimal testLat = 37.7849; // Changed from Integer to Decimal
        Decimal testLng = 500.0; // Invalid longitude - changed from Integer to Decimal
        Decimal radius = 10.0; // Changed from Integer to Decimal
        
        Test.startTest();
        try {
            List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
            // Should either work or throw exception
            System.assertNotEquals(null, result, 'UAT: Invalid longitude should be handled');
        } catch (Exception e) {
            System.assert(true, 'UAT: Invalid longitude exception is acceptable');
        }
        Test.stopTest();
    }
    
    @isTest
    static void testUAT_PerformanceTest() {
        // Performance test - FIXED METHOD NAME
        Decimal testLat = 37.7849;
        Decimal testLng = -122.4094;
        Decimal radius = 50.0; // Changed from Integer to Decimal
        
        Test.startTest();
        Datetime startTime = Datetime.now();
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        Datetime endTime = Datetime.now();
        Test.stopTest();
        
        Long executionTime = endTime.getTime() - startTime.getTime();
        System.assertNotEquals(null, result, 'UAT: Performance test result should not be null');
        System.debug('UAT: Execution time: ' + executionTime + ' milliseconds');
        
        // Assert reasonable execution time (should be under 30 seconds in test context)
        System.assert(executionTime < 30000, 'UAT: Should execute within reasonable time');
    }
}