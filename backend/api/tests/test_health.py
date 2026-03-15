from django.test import SimpleTestCase
from rest_framework.test import APIClient

class HealthCheckAPITest(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_endpoint_returns_ok(self):
        response = self.client.get("/api/health/")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
