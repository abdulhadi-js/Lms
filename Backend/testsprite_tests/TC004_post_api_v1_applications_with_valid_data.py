import requests

BASE_URL = "http://localhost:3001"
APPLICATIONS_ENDPOINT = "/api/v1/applications"
TIMEOUT = 30

def test_post_api_v1_applications_with_valid_data():
    valid_application_data = {
        "name": "John Doe",
        "course_id": "course-12345",
        "email": "johndoe@example.com",
        "additional_info": "Looking forward to joining the course"
    }
    headers = {
        "Content-Type": "application/json"
    }

    response = None
    try:
        response = requests.post(
            BASE_URL + APPLICATIONS_ENDPOINT,
            json=valid_application_data,
            headers=headers,
            timeout=TIMEOUT
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 201, f"Expected status code 201, got {response.status_code}"
    json_response = response.json()
    assert "status" in json_response, "Response JSON missing 'status' field"
    assert json_response["status"] == "pending review", f"Expected application status 'pending review', got '{json_response['status']}'"


test_post_api_v1_applications_with_valid_data()
