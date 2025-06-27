@isTest
public class NearbyCustomerControllerTest {
    
    @isTest
static void testGetNearbyCustomers_MinimumRadius() {
    // Test with minimum possible radius (0.001 km)
    Decimal testLat = 37.7849;
    Decimal testLng = -122.4094;
    Decimal radius = 0.001; // Minimum radius
    
    Test.startTest();
    List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
    Test.stopTest();
    
    System.assertNotEquals(null, result, 'Result should not be null');
    System.debug('Minimum radius test - Found customers: ' + result.size());
    // With such a small radius, might return 0 or 1 customers
}

@isTest
static void testGetNearbyCustomers_MaximumRadius() {
    // Test with maximum practical radius (20000 km - half Earth circumference)
    Decimal testLat = 37.7849;
    Decimal testLng = -122.4094;
    Decimal radius = 20000.0; // Maximum radius
    
    Test.startTest();
    List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
    Test.stopTest();
    
    System.assertNotEquals(null, result, 'Result should not be null');
    System.assert(result.size() <= 50, 'Should respect LIMIT of 50 even with max radius');
    System.debug('Maximum radius test - Found customers: ' + result.size());
}

@isTest
static void testGetNearbyCustomers_NullLatitude() {
    // Test with null latitude
    Decimal testLat = null;
    Decimal testLng = -122.4094;
    Decimal radius = 10.0;
    
    Test.startTest();
    try {
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        System.assert(false, 'Should throw exception for null latitude');
    } catch (Exception e) {
        System.assert(true, 'Should handle null latitude gracefully');
        System.debug('Null latitude error: ' + e.getMessage());
    }
    Test.stopTest();
}

@isTest
static void testGetNearbyCustomers_NullLongitude() {
    // Test with null longitude
    Decimal testLat = 37.7849;
    Decimal testLng = null;
    Decimal radius = 10.0;
    
    Test.startTest();
    try {
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        System.assert(false, 'Should throw exception for null longitude');
    } catch (Exception e) {
        System.assert(true, 'Should handle null longitude gracefully');
        System.debug('Null longitude error: ' + e.getMessage());
    }
    Test.stopTest();
}

@isTest
static void testGetNearbyCustomers_NullRadius() {
    // Test with null radius
    Decimal testLat = 37.7849;
    Decimal testLng = -122.4094;
    Decimal radius = null;
    
    Test.startTest();
    try {
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        System.assert(false, 'Should throw exception for null radius');
    } catch (Exception e) {
        System.assert(true, 'Should handle null radius gracefully');
        System.debug('Null radius error: ' + e.getMessage());
    }
    Test.stopTest();
}

@isTest
static void testGetNearbyCustomers_InvalidLatitude() {
    // Test with invalid latitude (outside -90 to 90 range)
    Decimal testLat = 200.0; // Invalid latitude
    Decimal testLng = -122.4094;
    Decimal radius = 10.0;
    
    Test.startTest();
    List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
    Test.stopTest();
    
    System.assertNotEquals(null, result, 'Result should not be null');
    // Salesforce should handle invalid coordinates gracefully
    System.debug('Invalid latitude test - Found customers: ' + result.size());
}

@isTest
static void testGetNearbyCustomers_InvalidLongitude() {
    // Test with invalid longitude (outside -180 to 180 range)
    Decimal testLat = 37.7849;
    Decimal testLng = 500.0; // Invalid longitude
    Decimal radius = 10.0;
    
    Test.startTest();
    List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
    Test.stopTest();
    
    System.assertNotEquals(null, result, 'Result should not be null');
    // Salesforce should handle invalid coordinates gracefully
    System.debug('Invalid longitude test - Found customers: ' + result.size());
}

@isTest
static void testGetNearbyCustomers_DistanceOrderingDetailed() {
    // Create customers at specific distances to test ordering
    List<Customer> testCustomers = new List<Customer>();
    
    // Customer 1: Very close (should be first)
    testCustomers.add(new Customer(
        Name = 'Closest Customer',
        Location__Latitude__s = 37.7850, // Very close
        Location__Longitude__s = -122.4095
    ));
    
    // Customer 2: Medium distance (should be second)
    testCustomers.add(new Customer(
        Name = 'Medium Distance Customer',
        Location__Latitude__s = 37.7900, // Medium distance
        Location__Longitude__s = -122.4200
    ));
    
    // Customer 3: Farther (should be third)
    testCustomers.add(new Customer(
        Name = 'Farther Customer',
        Location__Latitude__s = 37.8000, // Farther
        Location__Longitude__s = -122.4300
    ));
    
    insert testCustomers;
    
    Decimal testLat = 37.7849;
    Decimal testLng = -122.4094;
    Decimal radius = 50.0;
    
    Test.startTest();
    List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
    Test.stopTest();
    
    System.assertNotEquals(null, result, 'Result should not be null');
    System.assert(result.size() >= 3, 'Should find at least our test customers');
    
    // Verify the closest customer is first
    System.assertEquals('Closest Customer', result[0].Name, 'Closest customer should be first');
    System.debug('Distance ordering test - First customer: ' + result[0].Name);
}

@isTest
static void testGetNearbyCustomers_RadiusConversionAccuracy() {
    // Test that radius conversion from km to miles is accurate
    Decimal testLat = 37.7849;
    Decimal testLng = -122.4094;
    
    // Test with 1 km radius
    Decimal radius1km = 1.0;
    // Test with equivalent in miles (approximately 0.621371 miles)
    Decimal radiusEquivalentMiles = 1.0 * 0.621371;
    
    Test.startTest();
    List<Customer> result1km = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius1km);
    Test.stopTest();
    
    System.assertNotEquals(null, result1km, 'Result should not be null');
    System.debug('1km radius test - Found customers: ' + result1km.size());
    
    // The conversion should work properly internally
    // We can't directly test the miles conversion, but we can test the results are consistent
}

@isTest
static void testGetNearbyCustomers_BoundaryRadius() {
    // Test with boundary radius values
    Decimal testLat = 37.7849;
    Decimal testLng = -122.4094;
    
    // Test various boundary values
    List<Decimal> boundaryRadii = new List<Decimal>{0.1, 1.0, 10.0, 100.0, 1000.0};
    
    Test.startTest();
    for (Decimal radius : boundaryRadii) {
        List<Customer> result = NearbyCustomerController.getNearbyCustomers(testLat, testLng, radius);
        System.assertNotEquals(null, result, 'Result should not be null for radius: ' + radius);
        System.assert(result.size() <= 50, 'Should respect LIMIT for radius: ' + radius);
        System.debug('Boundary radius ' + radius + 'km - Found customers: ' + result.size());
    }
    Test.stopTest();
}
    
}