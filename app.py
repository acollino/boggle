from flask import Flask, render_template, session
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