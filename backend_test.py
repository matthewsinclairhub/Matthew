import requests
import sys
from datetime import datetime
import json

class TimberGuardAPITester:
    def __init__(self, base_url="https://stump-experts.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response: Dict with keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_services_endpoint(self):
        """Test services endpoint"""
        success, response = self.run_test("Get Services", "GET", "services", 200)
        if success and isinstance(response, list) and len(response) == 5:
            print("   ✅ Services endpoint returns 5 services as expected")
            return True
        elif success:
            print(f"   ⚠️  Services endpoint returned {len(response) if isinstance(response, list) else 'non-list'} items")
        return success

    def test_testimonials_endpoint(self):
        """Test testimonials endpoint"""
        success, response = self.run_test("Get Testimonials", "GET", "testimonials", 200)
        if success and isinstance(response, list) and len(response) == 5:
            print("   ✅ Testimonials endpoint returns 5 testimonials as expected")
            return True
        elif success:
            print(f"   ⚠️  Testimonials endpoint returned {len(response) if isinstance(response, list) else 'non-list'} items")
        return success

    def test_gallery_endpoint(self):
        """Test gallery endpoint"""
        success, response = self.run_test("Get Gallery", "GET", "gallery", 200)
        if success and isinstance(response, list) and len(response) == 4:
            print("   ✅ Gallery endpoint returns 4 items as expected")
            return True
        elif success:
            print(f"   ⚠️  Gallery endpoint returned {len(response) if isinstance(response, list) else 'non-list'} items")
        return success

    def test_quote_submission(self):
        """Test quote request submission"""
        quote_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "(555) 123-4567",
            "service": "tree-removal",
            "address": "123 Test St, Portland, OR",
            "message": "Test quote request"
        }
        success, response = self.run_test("Submit Quote Request", "POST", "quotes", 200, quote_data)
        if success and response.get('id'):
            print("   ✅ Quote submission successful with ID")
            return True
        return success

    def test_booking_submission(self):
        """Test booking submission"""
        booking_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "(555) 123-4567",
            "service": "tree-trimming",
            "address": "123 Test St, Portland, OR",
            "preferred_date": "2024-12-25",
            "preferred_time": "10:00 AM - 12:00 PM",
            "notes": "Test booking"
        }
        success, response = self.run_test("Submit Booking", "POST", "bookings", 200, booking_data)
        if success and response.get('id'):
            print("   ✅ Booking submission successful with ID")
            return True
        return success

    def test_contact_submission(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "(555) 123-4567",
            "subject": "Test Subject",
            "message": "Test contact message"
        }
        success, response = self.run_test("Submit Contact", "POST", "contact", 201, contact_data)
        if success and response.get('id'):
            print("   ✅ Contact submission successful with ID")
            return True
        return success

    def test_get_quotes(self):
        """Test getting quotes (should work after submission)"""
        return self.run_test("Get Quotes", "GET", "quotes", 200)

    def test_get_bookings(self):
        """Test getting bookings (should work after submission)"""
        return self.run_test("Get Bookings", "GET", "bookings", 200)

    def test_form_validation(self):
        """Test form validation with missing required fields"""
        print(f"\n🔍 Testing Form Validation...")
        
        # Test quote with missing required field
        invalid_quote = {
            "name": "Test User",
            "email": "test@example.com"
            # Missing phone, service, address
        }
        
        try:
            response = requests.post(f"{self.api_url}/quotes", json=invalid_quote, timeout=10)
            if response.status_code == 422:  # Validation error
                print("✅ Quote validation working - returns 422 for missing fields")
                return True
            else:
                print(f"⚠️  Quote validation: Expected 422, got {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Quote validation test failed: {str(e)}")
            return False

def main():
    print("🌲 TimberGuard Tree Services API Testing")
    print("=" * 50)
    
    tester = TimberGuardAPITester()
    
    # Test all endpoints
    tests = [
        tester.test_root_endpoint,
        tester.test_services_endpoint,
        tester.test_testimonials_endpoint,
        tester.test_gallery_endpoint,
        tester.test_quote_submission,
        tester.test_booking_submission,
        tester.test_contact_submission,
        tester.test_get_quotes,
        tester.test_get_bookings,
        tester.test_form_validation
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {str(e)}")
            tester.failed_tests.append({
                "test": test.__name__,
                "error": f"Test crashed: {str(e)}"
            })
    
    # Print summary
    print(f"\n📊 Test Results Summary")
    print("=" * 30)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure.get('test', 'Unknown')}: {failure.get('error', failure.get('response', 'Unknown error'))}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())