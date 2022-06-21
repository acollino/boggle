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

    def test_check_word_redirect(self):
        """Test that an improper guess before loading the board
            will redirect the user to the main page"""
        with app.test_client() as client:
            resp = client.get("/submit/word")
            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location, "/")

    def test_check_word_submission(self):
        """Test that a guess will return a json-type response, even
            if the guess isn't a word"""
        with app.test_client() as client:
            resp = client.get("/")
            resp = client.get("/submit/notarealword")
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.mimetype, "application/json")

            resp = client.get("/submit/")
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.mimetype, "application/json")

            resp = client.get("/submit/13!8")
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.mimetype, "application/json")

    def test_check_score_low_score(self):
        """Test that a low final score will not update the high score
        and will not change the newRecord bool"""
        with app.test_client() as client:
            with client.session_transaction() as current_session:
                current_session["high_score"] = 5
            resp = client.post("/score", json={
                'score': 4, 
            })
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.mimetype, "application/json")
            self.assertIn('"highScore": 5', resp.get_data(as_text=True))
            self.assertIn('"numGames": 1', resp.get_data(as_text=True))
            self.assertIn('"newRecord": false', resp.get_data(as_text=True))

    def test_check_score_high_score(self):
        """Test that a higher final score will update the high score
        and will change the newRecord bool to true"""
        with app.test_client() as client:
            with client.session_transaction() as current_session:
                current_session["high_score"] = 5
            resp = client.post("/score", json={
                'score': 10, 
            })
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.mimetype, "application/json")
            self.assertIn('"highScore": 10', resp.get_data(as_text=True))
            self.assertIn('"numGames": 1', resp.get_data(as_text=True))
            self.assertIn('"newRecord": true', resp.get_data(as_text=True))
    
    def test_reset_page(self):
        """Test that using the /new route will clear the game from 
        the session and will redirect to the main page"""
        with app.test_client() as client:
            resp = client.get("/new")
            self.assertEqual(resp.status_code, 302)
            self.assertEqual(session.get("game", None), None)
            self.assertEqual(session.__len__(), 0)
            self.assertEqual(resp.location, "/")

    def test_nonexistent_page(self):
        """Test that accessing a page that doesn't exist will 
            redirect the user to the home page"""
        with app.test_client() as client:
            resp = client.get("/realpage/realnumber")

            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location, "/")
            
    def test_nonexistent_page_follow(self):
        """Test that accessing a page that doesn't exist will 
            redirect the user to the home page, and that the
            flashed messages display"""
        with app.test_client() as client:
            resp = client.get("/realpage/realnumber", follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("Sorry", html)
            self.assertIn("been returned", html)
           
