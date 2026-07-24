import requests

BASE_URL = "http://localhost:3001"
LOGIN_ENDPOINT = "/api/v1/auth/login"
ASSIGNMENTS_ENDPOINT = "/api/v1/assignments"
TIMEOUT = 30

def test_get_assignments_with_authenticated_token():
    login_payload = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    try:
        # Authenticate and get JWT token
        login_response = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=login_payload,
            timeout=TIMEOUT
        )
        assert login_response.status_code == 200, f"Login failed with status code {login_response.status_code}"
        login_data = login_response.json()
        assert "token" in login_data, "token not found in login response"
        token = login_data["token"]

        headers = {
            "Authorization": f"Bearer {token}"
        }

        # Get assignments with authenticated token
        assignments_response = requests.get(
            BASE_URL + ASSIGNMENTS_ENDPOINT,
            headers=headers,
            timeout=TIMEOUT
        )
        assert assignments_response.status_code == 200, f"Expected 200, got {assignments_response.status_code}"
        assignments_data = assignments_response.json()
        assert isinstance(assignments_data, list), "Assignments data should be a list"

    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_assignments_with_authenticated_token()
