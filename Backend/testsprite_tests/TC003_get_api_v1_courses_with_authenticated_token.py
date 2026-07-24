import requests

BASE_URL = "http://localhost:3001"
LOGIN_ENDPOINT = f"{BASE_URL}/api/v1/auth/login"
COURSES_ENDPOINT = f"{BASE_URL}/api/v1/courses"
TIMEOUT = 30

def test_get_api_v1_courses_with_authenticated_token():
    # Credentials must be valid; using example placeholders
    login_payload = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    try:
        # Login to get JWT token
        login_resp = requests.post(LOGIN_ENDPOINT, json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
        login_data = login_resp.json()
        token = login_data.get("accessToken") or login_data.get("access_token") or login_data.get("token")
        assert token is not None, "JWT token not found in login response"
        headers = {
            "Authorization": f"Bearer {token}"
        }

        # Call GET /api/v1/courses with authenticated token
        courses_resp = requests.get(COURSES_ENDPOINT, headers=headers, timeout=TIMEOUT)
        assert courses_resp.status_code == 200, f"Expected 200 OK, got {courses_resp.status_code}"
        courses_data = courses_resp.json()
        assert isinstance(courses_data, list), "Courses response is not a list"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_api_v1_courses_with_authenticated_token()
