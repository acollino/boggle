from flask import Flask, redirect, render_template, request, session, jsonify, flash
from boggle import Boggle
import os

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev_only_default")

boggle_game = Boggle()


@app.route("/")
def display_home():
    """Shows the home page, either generating a new board or showing the
        existing one stored in the session"""
    stored_game = session.get("game", None)
    if stored_game:
        return render_template("index.html", board=stored_game)
    else:
        new_game = boggle_game.make_board()
        session["game"] = new_game
        return render_template("index.html", board=new_game)


@app.route("/submit/<word>")
@app.route("/submit/")
def check_word(word="-1"):
    """Validates the user-submitted word against the Boggle dictionary
        and responds with the result"""
    current_game = session.get("game", None)
    if not current_game:
        flash("You tried to enter a guess before the board was ready!")
        return redirect("/")
    else:
        result = boggle_game.check_valid_word(current_game, word)
        return jsonify(result)


@app.route("/score", methods=["POST"])
def record_score():
    """Records the user's score and responds with info about the 
        highest score and the number of games played"""
    score = request.json.get("score")
    high_score = session.get("high_score", None)
    new_record = False
    if high_score is None or score > high_score:
        high_score = score
        if not score == 0:
            new_record = True
    session["high_score"] = high_score
    num_games = session.get("num_games", None)
    if not num_games:
        num_games = 0
    num_games += 1
    session["num_games"] = num_games
    return jsonify({
        "highScore": high_score,
        "numGames": num_games,
        "newRecord": new_record
    })


@app.route("/new")
def new_board():
    """Empties the session and loads the main page to generate
        a new game board"""
    session.clear()
    return redirect("/")


@app.errorhandler(404)
def reroute_home(error):
    """In case the user tries to access a nonexistent page,
        they will be redirected to the main page"""
    flash("Sorry, something went wrong there!")
    flash("You've been returned to the main page instead.")
    return redirect("/")
