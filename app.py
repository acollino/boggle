from flask import Flask, redirect, render_template, request, session, jsonify, flash
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "to be implemented"

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
    if not high_score or score > high_score:
        new_record = True
        high_score = score
    session["high_score"] = high_score
    num_games = session.get("num_games", None)
    if not num_games:
        num_games = 0
    num_games += 1
    session["num_games"] = num_games
    return jsonify({"highScore": high_score, "numGames": num_games, "newRecord": new_record})

@app.route("/new")
def new_board():
    session.clear()
    return redirect("/")