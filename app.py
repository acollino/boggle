from flask import Flask, redirect, render_template, session, jsonify, flash
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "to be implemented"

boggle_game = Boggle()

@app.route("/")
def display_home():
    stored_game = session.get("game", None)
    if stored_game:
        return render_template("index.html", board = stored_game)
    else:
        new_game = boggle_game.make_board()
        session["game"] = new_game
        return render_template("index.html", board = new_game)

@app.route("/submit/<word>")
@app.route("/submit/")
def check_word(word = "-1"):
    current_game = session.get("game", None)
    if not current_game:
        flash("You tried to enter a guess before the board was ready!")
        return redirect("/")
    else:
        result = boggle_game.check_valid_word(current_game, word)
        return jsonify(result)