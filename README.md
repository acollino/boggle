This app implements a Boggle game where players can race against a timer to come up with as many words as possible from the generated letter tiles.

The app uses Flask, Jinja, and JS to create the board and run the game, and it makes use of Flask sessions to store the board and how the user has played on it (number of games, highest score) - these stored values will impact the end-of-game response that is shown to the player.

The app also utilizes a testing file, meant to ensure that the view functions in the app remained functional throughout development and to respond correctly to edge-case scenarios.

Previews:

<img src="https://user-images.githubusercontent.com/8853721/174897783-d2dce121-8556-4390-a40e-972802299220.png" alt="Boggle game board" width="500">
<img src="https://user-images.githubusercontent.com/8853721/174898158-48fdf6b5-7f04-41f1-a28c-60a6bf4ba74f.png" alt="Boggle game over" width="500">

