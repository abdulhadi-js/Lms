import requests

BASE_URL = "http://localhost:3001"
LOGIN_ENDPOINT = "/api/v1/auth/login"
TIMEOUT = 30

def test_post_apiv1authlogin_with_valid_credentials():
    url = BASE_URL + LOGIN_ENDPOINT
    headers = {
        "Content-Type": "application/json"
    }
    # Replace these credentials with valid test user credentials available in the test environment
    payload = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"

    assert "access_token" in data and isinstance(data["access_token"], str) and data["access_token"], "Missing or invalid access_token"
    assert "refresh_token" in data and isinstance(data["refresh_token"], str) and data["refresh_token"], "Missing or invalid refresh_token"
    assert "session" in data and isinstance(data["session"], dict) and data["session"], "Missing or invalid session data"


test_post_apiv1authlogin_with_valid_credentials()
