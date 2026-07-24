import requests

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

# Admin credentials for login - Replace with valid admin credentials
ADMIN_LOGIN_PAYLOAD = {
    "email": "admin@example.com",
    "password": "adminpassword"
}

def test_get_api_v1_users_with_admin_token():
    login_url = f"{BASE_URL}/api/v1/auth/login"
    users_url = f"{BASE_URL}/api/v1/users"

    try:
        # Step 1: Authenticate as admin to get JWT token
        login_response = requests.post(login_url, json=ADMIN_LOGIN_PAYLOAD, timeout=TIMEOUT)
        assert login_response.status_code == 200, f"Login failed with status {login_response.status_code}"
        login_data = login_response.json()
        assert "token" in login_data, "No token in login response"

        token = login_data["token"]
        headers = {
            "Authorization": f"Bearer {token}"
        }

        # Step 2: Call GET /api/v1/users with admin token
        users_response = requests.get(users_url, headers=headers, timeout=TIMEOUT)
        assert users_response.status_code == 200, f"Expected 200 OK, got {users_response.status_code}"

        users_data = users_response.json()
        # Expect paginated list structure: e.g. { "items": [...], "total": int, "page": int, "pageSize": int }
        assert isinstance(users_data, dict), "Users response is not a JSON object"
        assert "items" in users_data and isinstance(users_data["items"], list), "Users response missing 'items' list"
        assert "total" in users_data and isinstance(users_data["total"], int), "Users response missing 'total' count"
        assert "page" in users_data and isinstance(users_data["page"], int), "Users response missing 'page'"
        assert "pageSize" in users_data and isinstance(users_data["pageSize"], int), "Users response missing 'pageSize'"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"


test_get_api_v1_users_with_admin_token()
