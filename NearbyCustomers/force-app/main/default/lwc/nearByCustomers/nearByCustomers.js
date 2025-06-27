// // import { LightningElement, track, wire } from 'lwc';
// // import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// // import getNearbyCustomers from '@salesforce/apex/NearbyCustomerController.getNearbyCustomers';

// // export default class NearByCustomers extends LightningElement {
// //     @track currentLatitude;
// //     @track currentLongitude;
// //     @track radiusKm = 10; // Default radius in kilometers
// //     @track customers = [];
// //     @track isLoading = false;
// //     @track hasLocation = false;
// //     @track error;
// //     @track isSearching = false;
// //     @track hasSearched = false;

// //     // Columns for the data table
// //     columns = [
// //         { label: 'Name', fieldName: 'Name', type: 'text'},
// //         { label: 'Distance (km)', fieldName: 'DistanceKm', type: 'number', fixedWidth: 200 },
// //         { label: 'Latitude', fieldName: 'Latitude', type: 'number', fixedWidth: 120 },
// //         { label: 'Longitude', fieldName: 'Longitude', type: 'number', fixedWidth: 120 }
// //     ];

// //     connectedCallback() {
// //         this.getCurrentLocation();
// //     }

// //     getCurrentLocation() {
// //         this.isLoading = true;
        
// //         if (navigator.geolocation) {
// //             navigator.geolocation.getCurrentPosition(
// //                 (position) => {
// //                     this.currentLatitude = position.coords.latitude;
// //                     this.currentLongitude = position.coords.longitude;
// //                     this.hasLocation = true;
// //                     this.isLoading = false;
// //                     // this.searchNearbyCustomers();
// //                     this.showToast('Success', 'Location obtained successfully. Click Search to find nearby customers.', 'success');
// //                 },
// //                 (error) => {
// //                     this.handleLocationError(error);
// //                     this.isLoading = false;
// //                 },
// //                 {
// //                     enableHighAccuracy: true,
// //                     timeout: 10000,
// //                     maximumAge: 60000
// //                 }
// //             );
// //         } else {
// //             this.showToast('Error', 'Geolocation is not supported by this browser.', 'error');
// //             this.isLoading = false;
// //         }
// //     }

// //     handleLocationError(error) {
// //         let message;
// //         switch(error.code) {
// //             case error.PERMISSION_DENIED:
// //                 message = "Location access denied by user.";
// //                 break;
// //             case error.POSITION_UNAVAILABLE:
// //                 message = "Location information is unavailable.";
// //                 break;
// //             case error.TIMEOUT:
// //                 message = "Location request timed out.";
// //                 break;
// //             default:
// //                 message = "An unknown error occurred while retrieving location.";
// //                 break;
// //         }
// //         this.showToast('Location Error', message, 'error');
// //     }

// //     handleRadiusChange(event) {
// //         this.radiusKm = parseFloat(event.target.value);
// //         // if (this.hasLocation) {
// //         //     this.searchNearbyCustomers();
// //         // }
// //     }

// //     handleSearchClick() {
// //         this.searchNearbyCustomers();
// //     }

// //     searchNearbyCustomers() {
// //         if (!this.hasLocation) {
// //             this.showToast('Error', 'Location not available. Please allow location access.', 'error');
// //             return;
// //         }

// //         this.isSearching = true;
// //         this.hasSearched = true;
// //         this.error = null;

// //         getNearbyCustomers({
// //             latitude: this.currentLatitude,
// //             longitude: this.currentLongitude,
// //             radiusKm: this.radiusKm
// //         })
// //         .then(result => {
// //             // Process the geolocation data to extract latitude and longitude
// //             this.customers = result.map(customer => {
// //                let latitude = null;
// //                 let longitude = null;
// //                     let distanceKm = this.calculateDistance(this.currentLatitude,
// //                     this.currentLongitude,
// //                     customer.Location__Latitude__s,
// //                     customer.Location__Longitude__s
// //                 );
                
// //                 // Try different ways to access latitude/longitude
// //                 if (customer.Location__Latitude__s !== undefined && customer.Location__Longitude__s !== undefined) {
// //                     // Using the separate latitude/longitude fields
// //                     latitude = customer.Location__Latitude__s;
// //                     longitude = customer.Location__Longitude__s;
// //                 } else if (customer.Location__c) {
// //                     // Using the geolocation field object
// //                     if (typeof customer.Location__c === 'object') {
// //                         latitude = customer.Location__c.latitude;
// //                         longitude = customer.Location__c.longitude;
// //                     }
// //                 }

// //                 // let distanceKm = customer.Distance ? (customer.Distance * 1.60934).toFixed(2) : 'N/A';
                
// //                 return {
// //                     ...customer,
// //                     Latitude: latitude ? Number(latitude).toFixed(6) : 'N/A',
// //                     Longitude: longitude ? Number(longitude).toFixed(6) : 'N/A',
// //                     DistanceKm: distanceKm.toFixed(2)
// //                 };
// //             });
// //             this.isLoading = false;
// //             this.showToast('Success', `Found ${result.length} nearby customers`, 'success');
            
// //             // Debug: Log the first customer to see the structure
// //             if (result.length > 0) {
// //                 console.log('First customer data:', JSON.stringify(result[0], null, 2));
// //             }
// //         })
// //         .catch(error => {
// //             this.error = error;
// //             this.customers = [];
// //             this.isLoading = false;
// //             this.showToast('Error', 'Error retrieving nearby customers: ' + error.body.message, 'error');
// //         });
// //     }

// //     handleRefresh() {
// //         this.getCurrentLocation();
// //     }

// //     showToast(title, message, variant) {
// //         const evt = new ShowToastEvent({
// //             title: title,
// //             message: message,
// //             variant: variant,
// //         });
// //         this.dispatchEvent(evt);
// //     }

// //         /**
// //      * Calculate distance between two points using Haversine formula
// //      * Returns distance in kilometers
// //      */
// //     calculateDistance(lat1, lon1, lat2, lon2) {
// //         const earthRadius = 6371; // Earth's radius in kilometers
        
// //         // Convert degrees to radians
// //         const lat1Rad = lat1 * (Math.PI / 180);
// //         const lon1Rad = lon1 * (Math.PI / 180);
// //         const lat2Rad = lat2 * (Math.PI / 180);
// //         const lon2Rad = lon2 * (Math.PI / 180);
        
// //         // Calculate differences
// //         const deltaLat = lat2Rad - lat1Rad;
// //         const deltaLon = lon2Rad - lon1Rad;
        
// //         // Haversine formula
// //         const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
// //                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
// //                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        
// //         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
// //         // Calculate distance
// //         const distance = earthRadius * c;
        
// //         return distance;
// //     }

// //     get hasCustomers() {
// //         return this.customers && this.customers.length > 0;
// //     }

// //     get locationDisplay() {
// //         if (this.hasLocation) {
// //             return `Latitude: ${this.currentLatitude?.toFixed(6)}, Longitude: ${this.currentLongitude?.toFixed(6)}`;
// //         }
// //         return 'Location not available';
// //     }
// // }


// import { LightningElement, track, wire } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import getNearbyCustomers from '@salesforce/apex/NearbyCustomerController.getNearbyCustomers';

// export default class NearByCustomers extends LightningElement {
//     @track currentLatitude;
//     @track currentLongitude;
//     @track radiusKm = 10; // Default radius in kilometers
//     @track customers = [];
//     @track isLoading = false;
//     @track hasLocation = false;
//     @track error;
//     @track isSearching = false;
//     @track hasSearched = false;

//     // Columns for the data table
//     columns = [
//         { label: 'Name', fieldName: 'Name', type: 'text'},
//         { label: 'Distance (km)', fieldName: 'DistanceKm', type: 'number', fixedWidth: 200 },
//         { label: 'Latitude', fieldName: 'Latitude', type: 'number', fixedWidth: 120 },
//         { label: 'Longitude', fieldName: 'Longitude', type: 'number', fixedWidth: 120 }
//     ];

//     connectedCallback() {
//         this.getCurrentLocation();
//     }

//     getCurrentLocation() {
//         this.isLoading = true;
        
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     this.currentLatitude = position.coords.latitude;
//                     this.currentLongitude = position.coords.longitude;
//                     this.hasLocation = true;
//                     this.isLoading = false;
//                     // Removed automatic search - only get location
//                     this.showToast('Success', 'Location obtained successfully. Click Search to find nearby customers.', 'success');
//                 },
//                 (error) => {
//                     this.handleLocationError(error);
//                     this.isLoading = false;
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 10000,
//                     maximumAge: 60000
//                 }
//             );
//         } else {
//             this.showToast('Error', 'Geolocation is not supported by this browser.', 'error');
//             this.isLoading = false;
//         }
//     }

//     handleLocationError(error) {
//         let message;
//         switch(error.code) {
//             case error.PERMISSION_DENIED:
//                 message = "Location access denied by user.";
//                 break;
//             case error.POSITION_UNAVAILABLE:
//                 message = "Location information is unavailable.";
//                 break;
//             case error.TIMEOUT:
//                 message = "Location request timed out.";
//                 break;
//             default:
//                 message = "An unknown error occurred while retrieving location.";
//                 break;
//         }
//         this.showToast('Location Error', message, 'error');
//     }

//     handleRadiusChange(event) {
//         this.radiusKm = parseFloat(event.target.value);
//         // Removed automatic search when radius changes
//     }

//     handleSearchClick() {
//         this.searchNearbyCustomers();
//     }

//     searchNearbyCustomers() {
//         if (!this.hasLocation) {
//             this.showToast('Error', 'Location not available. Please allow location access.', 'error');
//             return;
//         }

//         this.isSearching = true;
//         this.hasSearched = true;
//         this.error = null;

//         getNearbyCustomers({
//             latitude: this.currentLatitude,
//             longitude: this.currentLongitude,
//             radiusKm: this.radiusKm
//         })
//         .then(result => {
//             // Process the geolocation data to extract latitude and longitude
//             this.customers = result.map(customer => {
//                let latitude = null;
//                 let longitude = null;
//                     let distanceKm = this.calculateDistance(this.currentLatitude,
//                     this.currentLongitude,
//                     customer.Location__Latitude__s,
//                     customer.Location__Longitude__s
//                 );
                
//                 // Try different ways to access latitude/longitude
//                 if (customer.Location__Latitude__s !== undefined && customer.Location__Longitude__s !== undefined) {
//                     // Using the separate latitude/longitude fields
//                     latitude = customer.Location__Latitude__s;
//                     longitude = customer.Location__Longitude__s;
//                 } else if (customer.Location__c) {
//                     // Using the geolocation field object
//                     if (typeof customer.Location__c === 'object') {
//                         latitude = customer.Location__c.latitude;
//                         longitude = customer.Location__c.longitude;
//                     }
//                 }
                
//                 return {
//                     ...customer,
//                     Latitude: latitude ? Number(latitude).toFixed(6) : 'N/A',
//                     Longitude: longitude ? Number(longitude).toFixed(6) : 'N/A',
//                     DistanceKm: distanceKm.toFixed(2)
//                 };
//             });
//             this.isSearching = false; // Fixed: was setting isLoading instead of isSearching
//             this.showToast('Success', `Found ${result.length} nearby customers`, 'success');
            
//             // Debug: Log the first customer to see the structure
//             if (result.length > 0) {
//                 console.log('First customer data:', JSON.stringify(result[0], null, 2));
//             }
//         })
//         .catch(error => {
//             this.error = error;
//             this.customers = [];
//             this.isSearching = false; // Fixed: was setting isLoading instead of isSearching
//             this.showToast('Error', 'Error retrieving nearby customers: ' + error.body.message, 'error');
//         });
//     }

//     handleRefresh() {
//         this.getCurrentLocation();
//     }

//     showToast(title, message, variant) {
//         const evt = new ShowToastEvent({
//             title: title,
//             message: message,
//             variant: variant,
//         });
//         this.dispatchEvent(evt);
//     }

//     /**
//      * Calculate distance between two points using Haversine formula
//      * Returns distance in kilometers
//      */
//     calculateDistance(lat1, lon1, lat2, lon2) {
//         const earthRadius = 6371; // Earth's radius in kilometers
        
//         // Convert degrees to radians
//         const lat1Rad = lat1 * (Math.PI / 180);
//         const lon1Rad = lon1 * (Math.PI / 180);
//         const lat2Rad = lat2 * (Math.PI / 180);
//         const lon2Rad = lon2 * (Math.PI / 180);
        
//         // Calculate differences
//         const deltaLat = lat2Rad - lat1Rad;
//         const deltaLon = lon2Rad - lon1Rad;
        
//         // Haversine formula
//         const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
//                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
//         // Calculate distance
//         const distance = earthRadius * c;
        
//         return distance;
//     }

//     // Getter methods that the HTML template expects
//     get hasCustomers() {
//         return this.customers && this.customers.length > 0;
//     }

//     get showNoResults() {
//         return this.hasSearched && !this.hasCustomers && !this.isSearching;
//     }

//     get locationDisplay() {
//         if (this.hasLocation) {
//             return `Latitude: ${this.currentLatitude?.toFixed(6)}, Longitude: ${this.currentLongitude?.toFixed(6)}`;
//         }
//         return 'Location not available';
//     }

//     // Getter for search button disabled state
//     get isSearchDisabled() {
//         return !this.hasLocation || this.isSearching;
//     }

//     // Getter for search button label
//     get searchButtonLabel() {
//         return this.isSearching ? 'Searching...' : 'Search Nearby Customers';
//     }
// }


import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getNearbyCustomers from '@salesforce/apex/NearbyCustomerController.getNearbyCustomers';
import getAllCustomers from '@salesforce/apex/NearbyCustomerController.getAllCustomers'; // Add this import

export default class NearByCustomers extends LightningElement {
    @track currentLatitude;
    @track currentLongitude;
    @track inputLatitude = '';
    @track inputLongitude = '';
    @track radiusKm = 10;
    @track customers = [];
    @track filteredCustomers = []; // New property for filtered customers
    @track allCustomers = []; // Store all customers for filtering
    @track isLoading = false;
    @track hasLocation = false;
    @track error;
    @track isSearching = false;
    @track hasSearched = false;
    @track showMap = true; // Default to map view
    @track showTable = false;
    @track mapMarkers = [];
    @track mapCenter = {};
    @track useCurrentLocation = false; // Toggle between manual and auto location
    @track isInitialLoad = true; // Track if this is initial load
    @track searchTerm = ''; // New property for customer name search

    // Columns for the data table
    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Distance (km)', fieldName: 'DistanceKm', type: 'number', fixedWidth: 150 },
        { label: 'Latitude', fieldName: 'Latitude', type: 'number', fixedWidth: 120 },
        { label: 'Longitude', fieldName: 'Longitude', type: 'number', fixedWidth: 120 },
    ];

    connectedCallback() {
        // Load all customers on initial page load
        this.loadAllCustomers();
    }

    // New method to load all customers
    loadAllCustomers() {
        this.isLoading = true;
        this.error = null;

        getAllCustomers()
        .then(result => {
            // Process all customers without distance calculation initially
            const processedCustomers = result.map(customer => {
                let latitude = null;
                let longitude = null;
                
                // Get latitude/longitude
                if (customer.Location__Latitude__s !== undefined && customer.Location__Longitude__s !== undefined) {
                    latitude = customer.Location__Latitude__s;
                    longitude = customer.Location__Longitude__s;
                } else if (customer.Location__c) {
                    if (typeof customer.Location__c === 'object') {
                        latitude = customer.Location__c.latitude;
                        longitude = customer.Location__c.longitude;
                    }
                }
                
                return {
                    ...customer,
                    Latitude: latitude ? Number(latitude).toFixed(6) : 'N/A',
                    Longitude: longitude ? Number(longitude).toFixed(6) : 'N/A',
                    DistanceKm: this.isInitialLoad ? 'N/A' : '0.00', // Show N/A for initial load
                    ActualLatitude: latitude, // Store actual values for map
                    ActualLongitude: longitude
                };
            });
            
            this.allCustomers = processedCustomers;
            this.customers = processedCustomers;
            this.filteredCustomers = processedCustomers;
            
            // Create map markers for all customers
            this.createAllCustomerMarkers();
            
            this.isLoading = false;
            
            if (result.length > 0) {
                console.log('Loaded all customers:', result.length);
                // console.log('First customer data:', JSON.stringify(result[0], null, 2));
            }
        })
        .catch(error => {
            this.error = error;
            this.customers = [];
            this.filteredCustomers = [];
            this.allCustomers = [];
            this.mapMarkers = [];
            this.isLoading = false;
            this.showToast('Error', 'Error loading customers: ' + (error.body?.message || error.message), 'error');
        });
    }

    // New method to handle customer name search
    handleCustomerSearch(event) {
        this.searchTerm = event.target.value.toLowerCase();
        this.filterCustomers();
    }

    // New method to filter customers based on search term
    filterCustomers() {
        if (!this.searchTerm) {
            this.filteredCustomers = [...this.customers];
        } else {
            this.filteredCustomers = this.customers.filter(customer => 
                customer.Name && customer.Name.toLowerCase().includes(this.searchTerm)
            );
        }
        
        // Update map markers with filtered customers
        this.updateMapMarkersWithFilteredCustomers();
    }

    // New method to update map markers with filtered customers
    updateMapMarkersWithFilteredCustomers() {
        let markers = [];
        
        // Add current location marker if search has been performed
        if (this.hasSearched && this.hasLocation) {
            markers.push({
                location: {
                    Latitude: this.currentLatitude,
                    Longitude: this.currentLongitude
                },
                title: 'Search Location',
                description: this.useCurrentLocation ? 'Current Location' : 'Manual Location',
                icon: 'utility:location',
                mapIcon: {
                    path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z',
                    fillColor: '#1589EE',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                    scale: 1.5
                }
            });
        }
        
        // Add filtered customer markers
        this.filteredCustomers.forEach((customer, index) => {
            if (customer.ActualLatitude && customer.ActualLongitude) {
                markers.push({
                    location: {
                        Latitude: customer.ActualLatitude,
                        Longitude: customer.ActualLongitude
                    },
                    title: customer.Name,
                    description: this.isInitialLoad ? 'Customer Location' : `Distance: ${customer.DistanceKm} km`,
                    icon: 'standard:account',
                    mapIcon: {
                        path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z',
                        fillColor: '#E74C3C',
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: '#FFFFFF',
                        scale: 1.2
                    }
                });
            }
        });
        
        // Set map center to first filtered customer with valid coordinates if no location is set
        if (markers.length > 0 && !this.hasLocation) {
            const customerMarkers = markers.filter(marker => marker.icon === 'standard:account');
            if (customerMarkers.length > 0) {
                this.mapCenter = {
                    location: {
                        Latitude: customerMarkers[0].location.Latitude,
                        Longitude: customerMarkers[0].location.Longitude
                    }
                };
            }
        }
        
        this.mapMarkers = markers;
    }

    // New method to create markers for all customers (without search location)
    createAllCustomerMarkers() {
        let markers = [];
        
        // Add customer markers
        this.customers.forEach((customer, index) => {
            if (customer.ActualLatitude && customer.ActualLongitude) {
                markers.push({
                    location: {
                        Latitude: customer.ActualLatitude,
                        Longitude: customer.ActualLongitude
                    },
                    title: customer.Name,
                    description: this.isInitialLoad ? 'Customer Location' : `Distance: ${customer.DistanceKm} km`,
                    icon: 'standard:account',
                    mapIcon: {
                        path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z',
                        fillColor: '#E74C3C',
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: '#FFFFFF',
                        scale: 1.2
                    }
                });
            }
        });
        
        // Set map center to first customer with valid coordinates if no location is set
        if (markers.length > 0 && !this.hasLocation) {
            this.mapCenter = {
                location: {
                    Latitude: markers[0].location.Latitude,
                    Longitude: markers[0].location.Longitude
                }
            };
        }
        
        this.mapMarkers = markers;
    }

    handleLatitudeChange(event) {
        this.inputLatitude = event.target.value;
        this.validateAndSetLocation();
    }

    handleLongitudeChange(event) {
        this.inputLongitude = event.target.value;
        this.validateAndSetLocation();
    }

    validateAndSetLocation() {
        const lat = parseFloat(this.inputLatitude);
        const lng = parseFloat(this.inputLongitude);
        
        if (!isNaN(lat) && !isNaN(lng) && 
            lat >= -90 && lat <= 90 && 
            lng >= -180 && lng <= 180) {
            this.currentLatitude = lat;
            this.currentLongitude = lng;
            this.hasLocation = true;
            
            // Set map center to input location
            this.mapCenter = {
                location: {
                    Latitude: this.currentLatitude,
                    Longitude: this.currentLongitude
                }
            };
        } else {
            this.hasLocation = false;
        }
    }

    // In your nearByCustomers.js file, update the handleUseCurrentLocationToggle method:

    handleUseCurrentLocationToggle(event) {
        this.useCurrentLocation = event.target.checked;
        if (this.useCurrentLocation) {
            // Automatically get current location when toggle is turned on
            this.getCurrentLocation();
        } else {
            // Clear auto-location and use manual input
            this.validateAndSetLocation();
        }
    }

    // Also update the getCurrentLocation method to ensure location is properly set:
    getCurrentLocation() {
        this.isLoading = true;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLatitude = position.coords.latitude;
                    this.currentLongitude = position.coords.longitude;
                    this.inputLatitude = this.currentLatitude.toString();
                    this.inputLongitude = this.currentLongitude.toString();
                    this.hasLocation = true;
                    this.isLoading = false;
                    
                    // Set map center to current location
                    this.mapCenter = {
                        location: {
                            Latitude: this.currentLatitude,
                            Longitude: this.currentLongitude
                        }
                    };
                    
                    this.showToast('Success', 'Current location obtained successfully.', 'success');
                },
                (error) => {
                    this.handleLocationError(error);
                    this.isLoading = false;
                    this.useCurrentLocation = false; // Reset toggle on error
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            this.showToast('Error', 'Geolocation is not supported by this browser.', 'error');
            this.isLoading = false;
            this.useCurrentLocation = false;
        }
    }

    handleLocationError(error) {
        let message;
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = "Location access denied by user.";
                break;
            case error.POSITION_UNAVAILABLE:
                message = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                message = "Location request timed out.";
                break;
            default:
                message = "An unknown error occurred while retrieving location.";
                break;
        }
        this.showToast('Location Error', message, 'error');
    }

    handleRadiusChange(event) {
        this.radiusKm = parseFloat(event.target.value);
    }

    handleSearchClick() {
        this.searchNearbyCustomers();
    }

    searchNearbyCustomers() {
        if (!this.hasLocation) {
            this.showToast('Error', 'Please enter valid latitude and longitude coordinates.', 'error');
            return;
        }

        this.isSearching = true;
        this.hasSearched = true;
        this.isInitialLoad = false; // No longer initial load
        this.error = null;

        getNearbyCustomers({
            latitude: this.currentLatitude,
            longitude: this.currentLongitude,
            radiusKm: this.radiusKm
        })
        .then(result => {
            // Process the geolocation data
            const processedCustomers = result.map(customer => {
                let latitude = null;
                let longitude = null;
                let distanceKm = this.calculateDistance(
                    this.currentLatitude,
                    this.currentLongitude,
                    customer.Location__Latitude__s,
                    customer.Location__Longitude__s
                );
                
                // Get latitude/longitude
                if (customer.Location__Latitude__s !== undefined && customer.Location__Longitude__s !== undefined) {
                    latitude = customer.Location__Latitude__s;
                    longitude = customer.Location__Longitude__s;
                } else if (customer.Location__c) {
                    if (typeof customer.Location__c === 'object') {
                        latitude = customer.Location__c.latitude;
                        longitude = customer.Location__c.longitude;
                    }
                }
                
                return {
                    ...customer,
                    Latitude: latitude ? Number(latitude).toFixed(6) : 'N/A',
                    Longitude: longitude ? Number(longitude).toFixed(6) : 'N/A',
                    DistanceKm: distanceKm.toFixed(2),
                    ActualLatitude: latitude, // Store actual values for map
                    ActualLongitude: longitude
                };
            });
            
            this.customers = processedCustomers;
            this.allCustomers = processedCustomers;
            
            // Apply current search filter if any
            this.filterCustomers();
            
            this.isSearching = false;
            this.showToast('Success', `Found ${result.length} nearby customers`, 'success');
            
            if (result.length > 0) {
                console.log('First customer data:', JSON.stringify(result[0], null, 2));
            }
        })
        .catch(error => {
            this.error = error;
            this.customers = [];
            this.filteredCustomers = [];
            this.allCustomers = [];
            this.mapMarkers = [];
            this.isSearching = false;
            this.showToast('Error', 'Error retrieving nearby customers: ' + error.body.message, 'error');
        });
    }

    createMapMarkers() {
        let markers = [];
        
        // Add current location marker
        markers.push({
            location: {
                Latitude: this.currentLatitude,
                Longitude: this.currentLongitude
            },
            title: 'Search Location',
            description: this.useCurrentLocation ? 'Current Location' : 'Manual Location',
            icon: 'utility:location',
            mapIcon: {
                path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z',
                fillColor: '#1589EE',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#FFFFFF',
                scale: 1.5
            }
        });
        
        // Add customer markers
        this.customers.forEach((customer, index) => {
            if (customer.ActualLatitude && customer.ActualLongitude) {
                markers.push({
                    location: {
                        Latitude: customer.ActualLatitude,
                        Longitude: customer.ActualLongitude
                    },
                    title: customer.Name,
                    description: `Distance: ${customer.DistanceKm} km`,
                    icon: 'standard:account',
                    mapIcon: {
                        path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z',
                        fillColor: '#E74C3C',
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: '#FFFFFF',
                        scale: 1.2
                    }
                });
            }
        });
        
        this.mapMarkers = markers;
    }

    // View toggle methods
    showMapView() {
        this.showMap = true;
        this.showTable = false;
    }

    showTableView() {
        this.showMap = false;
        this.showTable = true;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;
        
        const lat1Rad = lat1 * (Math.PI / 180);
        const lon1Rad = lon1 * (Math.PI / 180);
        const lat2Rad = lat2 * (Math.PI / 180);
        const lon2Rad = lon2 * (Math.PI / 180);
        
        const deltaLat = lat2Rad - lat1Rad;
        const deltaLon = lon2Rad - lon1Rad;
        
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                 Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                 Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return earthRadius * c;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    // Getter methods
    get hasCustomers() {
        return this.filteredCustomers && this.filteredCustomers.length > 0;
    }

    get showNoResults() {
        return this.hasSearched && !this.hasCustomers && !this.isSearching && !this.isInitialLoad;
    }

    get locationDisplay() {
        if (this.hasLocation) {
            const source = this.useCurrentLocation ? 'Current Location' : 'Manual Location';
            return `${source}: ${this.currentLatitude?.toFixed(6)}, ${this.currentLongitude?.toFixed(6)}`;
        }
        return 'Please enter location coordinates';
    }

    get isSearchDisabled() {
        return !this.hasLocation || this.isSearching;
    }

    get searchButtonLabel() {
        return this.isSearching ? 'Searching...' : 'Search Nearby Customers';
    }

    get mapViewVariant() {
        return this.showMap ? 'brand' : 'neutral';
    }

    get tableViewVariant() {
        return this.showTable ? 'brand' : 'neutral';
    }

    get longitude() {
        return this.hasLocation ? this.currentLongitude.toFixed(6) : '--';
    }

    get latitude() {
        return this.hasLocation ? this.currentLatitude.toFixed(6) : '--';
    }

    get latitudeInputValue() {
        return this.inputLatitude;
    }

    get longitudeInputValue() {
        return this.inputLongitude;
    }

    get isLocationValid() {
        return this.hasLocation;
    }

    // New getter for displaying customer count
    get customerCountDisplay() {
        if (this.searchTerm) {
            return `${this.filteredCustomers.length} of ${this.customers.length} customers`;
        }
        return `${this.customers.length} customers`;
    }
}