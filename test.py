from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    
    def test_display_home(self):
        """Test that the index response is received correctly 
            and has the expected content."""
        with app.test_client() as client:
            resp = client.get("/")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<div class="tile">', html)
            self.assertIn("Enter a word", html)
    
    def test_display_home_game(self):
        """Test that a new game stored in the session is 
            retained when the page is reloaded."""
        with app.test_client() as client:
            boggle = Boggle()
            game = boggle.make_board()
            with client.session_transaction() as current_session:
                current_session["game"] = game
            client.get("/")
            self.assertEqual(session["game"], game)
            client.get("/")
            self.assertEqual(session["game"], game)