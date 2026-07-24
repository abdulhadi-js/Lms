
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** Backend
- **Date:** 2026-07-24
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 post api v1 auth login with valid credentials
- **Test Code:** [TC001_post_api_v1_auth_login_with_valid_credentials.py](./TC001_post_api_v1_auth_login_with_valid_credentials.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 39, in <module>
  File "<string>", line 31, in test_post_api_v1_auth_login_with_valid_credentials
AssertionError: Response JSON does not contain a valid JWT access token

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/656ca4db-9200-44e2-a088-5bbf2a53f0e9/76d5f604-df47-4089-b1ce-4e1a22ad8ae7
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 get api v1 users with admin token
- **Test Code:** [TC002_get_api_v1_users_with_admin_token.py](./TC002_get_api_v1_users_with_admin_token.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 44, in <module>
  File "<string>", line 21, in test_get_api_v1_users_with_admin_token
AssertionError: No token in login response

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/656ca4db-9200-44e2-a088-5bbf2a53f0e9/fcee9543-00e6-4a46-a228-7f46ce1aa856
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 get api v1 courses with authenticated token
- **Test Code:** [TC003_get_api_v1_courses_with_authenticated_token.py](./TC003_get_api_v1_courses_with_authenticated_token.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 33, in <module>
  File "<string>", line 27, in test_get_api_v1_courses_with_authenticated_token
AssertionError: Expected 200 OK, got 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/656ca4db-9200-44e2-a088-5bbf2a53f0e9/fa33745a-d1ba-46be-82e3-a2e39074f721
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 post api v1 applications with valid data
- **Test Code:** [TC004_post_api_v1_applications_with_valid_data.py](./TC004_post_api_v1_applications_with_valid_data.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 26, in test_post_api_v1_applications_with_valid_data
  File "/var/lang/lib/python3.12/site-packages/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 400 Client Error: Bad Request for url: http://localhost:3001/api/v1/applications

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 36, in <module>
  File "<string>", line 28, in test_post_api_v1_applications_with_valid_data
AssertionError: Request failed: 400 Client Error: Bad Request for url: http://localhost:3001/api/v1/applications

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/656ca4db-9200-44e2-a088-5bbf2a53f0e9/446489e1-c03e-4494-9e9c-c8df7c6effa9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 get api v1 assignments with authenticated token
- **Test Code:** [TC005_get_api_v1_assignments_with_authenticated_token.py](./TC005_get_api_v1_assignments_with_authenticated_token.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 42, in <module>
  File "<string>", line 22, in test_get_assignments_with_authenticated_token
AssertionError: token not found in login response

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/656ca4db-9200-44e2-a088-5bbf2a53f0e9/d77a4b7c-8d5b-4a8d-8d5e-dcc1028b5552
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---