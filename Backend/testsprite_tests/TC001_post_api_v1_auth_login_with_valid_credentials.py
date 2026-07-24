import requests

BASE_URL = "http://localhost:3001"
LOGIN_ENDPOINT = "/api/v1/auth/login"
TIMEOUT = 30

def test_post_api_v1_auth_login_with_valid_credentials():
    url = BASE_URL + LOGIN_ENDPOINT
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "email": "validuser@example.com",
        "password": "ValidPassword123"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed with exception: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

    try:
        response_json = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"

    # Check for presence of JWT access token in known keys
    token_keys = ["access_token", "token"]
    assert any(key in response_json for key in token_keys), "Response JSON does not contain a valid JWT access token"
    
    # Check for presence of user session details in expected keys
    user_session_keys = ["user", "session", "user_session"]
    assert any(key in response_json for key in user_session_keys), \
        "Response JSON does not contain user session details under expected keys"


test_post_api_v1_auth_login_with_valid_credentials()
